/**
 * Shared ONNX Runtime setup for in-browser transformers.js models.
 *
 * The bundled asyncify WASM (~26MB) exceeds Cloudflare's 25MiB per-asset
 * limit, so the post-build step strips it and the runtime fetches it from the
 * CDN instead. Pinned to the exact onnxruntime-web build transformers ships
 * (see node_modules/.pnpm/onnxruntime-web@…); a version mismatch breaks WASM.
 */

type WasmEnv = { wasmPaths?: unknown; numThreads?: number };

export function configureOnnxRuntime(env: { backends: { onnx: { wasm?: WasmEnv } } }) {
  const wasmEnv = env.backends.onnx.wasm;
  if (!wasmEnv) return;
  wasmEnv.wasmPaths = "https://cdn.jsdelivr.net/npm/onnxruntime-web@1.31.0-dev.20260914-8d85527a0/dist/" as WasmEnv["wasmPaths"];
  // CDN 加载时 Worker 跨域会被浏览器拦截，多线程路径必挂——强制单线程，
  // 无 SharedArrayBuffer 依赖，也兼容没有 COOP/COEP 的部署。
  wasmEnv.numThreads = 1;
}

/** WebGPU 存在≠可用（headless/无 GPU 环境 requestAdapter 返回 null），
 *  而 transformers.js 会把第一次失败的 session 缓存在模型级，之后任何 device
 *  请求都复用这个 rejected promise——所以必须先探测，不能"先试再 catch"。 */
export async function webgpuAvailable(): Promise<boolean> {
  if (typeof navigator === "undefined" || !("gpu" in navigator)) return false;
  try {
    return Boolean(
      await (navigator as unknown as { gpu: { requestAdapter(): Promise<unknown> } }).gpu.requestAdapter(),
    );
  } catch {
    return false;
  }
}
