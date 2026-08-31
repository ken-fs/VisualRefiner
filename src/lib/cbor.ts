/**
 * Minimal CBOR (RFC 8949) decoder — just enough to read C2PA claim and
 * assertion payloads: definite and indefinite lengths, tags, text/byte
 * strings, arrays, maps, and numbers. No dependency, no allocation-heavy
 * streaming; it either decodes the value or throws.
 */

export type CborValue =
  | null
  | boolean
  | number
  | string
  | Uint8Array
  | CborValue[]
  | { [key: string]: CborValue };

const decoder = new TextDecoder();

export function decodeCbor(bytes: Uint8Array): CborValue {
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  let offset = 0;
  let depth = 0;
  const MAX_DEPTH = 100; // pathological nesting would otherwise blow the stack

  function readLength(info: number): number {
    if (info < 24) return info;
    if (info === 24) return view.getUint8(offset++);
    if (info === 25) {
      const v = view.getUint16(offset);
      offset += 2;
      return v;
    }
    if (info === 26) {
      const v = view.getUint32(offset);
      offset += 4;
      return v;
    }
    if (info === 27) {
      const v = view.getBigUint64(offset);
      offset += 8;
      return Number(v);
    }
    return -1; // 31 = indefinite
  }

  function readHalfFloat(): number {
    const half = view.getUint16(offset);
    offset += 2;
    const exp = (half & 0x7c00) >> 10;
    const frac = half & 0x03ff;
    const sign = half & 0x8000 ? -1 : 1;
    if (exp === 0) return sign * Math.pow(2, -14) * (frac / 1024);
    if (exp === 0x1f) return frac ? NaN : sign * Infinity;
    return sign * Math.pow(2, exp - 15) * (1 + frac / 1024);
  }

  function decodeItem(): CborValue {
    if (offset >= bytes.byteLength) throw new Error("CBOR: unexpected end");
    if (++depth > MAX_DEPTH) throw new Error("CBOR: nesting too deep");
    try {
      return decodeItemInner();
    } finally {
      depth--;
    }
  }

  function decodeItemInner(): CborValue {
    const initial = view.getUint8(offset++);
    const major = initial >> 5;
    const info = initial & 0x1f;

    switch (major) {
      case 0: {
        const v = readLength(info);
        if (v < 0) throw new Error("CBOR: indefinite uint");
        return v;
      }
      case 1: {
        const v = readLength(info);
        if (v < 0) throw new Error("CBOR: indefinite nint");
        return -1 - v;
      }
      case 2: {
        const len = readLength(info);
        if (len >= 0) {
          const out = bytes.subarray(offset, offset + len);
          offset += len;
          return out;
        }
        const parts: Uint8Array[] = [];
        while (view.getUint8(offset) !== 0xff) {
          const chunk = decodeItem();
          if (!(chunk instanceof Uint8Array)) throw new Error("CBOR: bad byte chunk");
          parts.push(chunk);
        }
        offset++;
        const total = parts.reduce((n, p) => n + p.length, 0);
        const out = new Uint8Array(total);
        let at = 0;
        for (const p of parts) {
          out.set(p, at);
          at += p.length;
        }
        return out;
      }
      case 3: {
        const len = readLength(info);
        if (len >= 0) {
          const out = decoder.decode(bytes.subarray(offset, offset + len));
          offset += len;
          return out;
        }
        let out = "";
        while (view.getUint8(offset) !== 0xff) {
          const chunk = decodeItem();
          if (typeof chunk !== "string") throw new Error("CBOR: bad text chunk");
          out += chunk;
        }
        offset++;
        return out;
      }
      case 4: {
        const len = readLength(info);
        const out: CborValue[] = [];
        if (len >= 0) {
          for (let i = 0; i < len; i++) out.push(decodeItem());
        } else {
          while (view.getUint8(offset) !== 0xff) out.push(decodeItem());
          offset++;
        }
        return out;
      }
      case 5: {
        const len = readLength(info);
        const out: { [key: string]: CborValue } = {};
        const readPair = () => {
          const key = decodeItem();
          const value = decodeItem();
          out[typeof key === "string" ? key : JSON.stringify(key)] = value;
        };
        if (len >= 0) {
          for (let i = 0; i < len; i++) readPair();
        } else {
          while (view.getUint8(offset) !== 0xff) readPair();
          offset++;
        }
        return out;
      }
      case 6: {
        readLength(info); // tag number — semantics we don't need; unwrap
        return decodeItem();
      }
      case 7: {
        if (info === 20) return false;
        if (info === 21) return true;
        if (info === 22 || info === 23) return null;
        if (info === 25) return readHalfFloat();
        if (info === 26) {
          const v = view.getFloat32(offset);
          offset += 4;
          return v;
        }
        if (info === 27) {
          const v = view.getFloat64(offset);
          offset += 8;
          return v;
        }
        if (info === 31) return null; // stray break
        throw new Error(`CBOR: unsupported simple value ${info}`);
      }
    }
    throw new Error("CBOR: unreachable");
  }

  return decodeItem();
}
