declare module "heic2any" {
  type Options = {
    blob: Blob;
    toType?: "image/jpeg" | "image/png" | "image/gif";
    quality?: number;
    multiple?: boolean;
    gifInterval?: number;
  };

  export default function heic2any(options: Options): Promise<Blob | Blob[]>;
}
