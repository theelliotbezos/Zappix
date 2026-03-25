import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const cloudinaryService = {
  /** Upload a file to Cloudinary and return the secure URL. */
  async upload(
    file: string, // base64 string or URL
    options?: {
      folder?: string;
      resourceType?: "image" | "video" | "raw" | "auto";
      publicId?: string;
    }
  ) {
    const result = await cloudinary.uploader.upload(file, {
      folder: options?.folder ?? "zappix",
      resource_type: options?.resourceType ?? "auto",
      public_id: options?.publicId,
    });

    return {
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
      format: result.format,
      bytes: result.bytes,
    };
  },

  /** Delete a file from Cloudinary. */
  async destroy(publicId: string) {
    return cloudinary.uploader.destroy(publicId);
  },

  /** Generate an optimized image URL. */
  getOptimizedUrl(
    publicId: string,
    options?: { width?: number; height?: number; quality?: number }
  ) {
    return cloudinary.url(publicId, {
      fetch_format: "auto",
      quality: options?.quality ?? "auto",
      width: options?.width,
      height: options?.height,
      crop: "fill",
    });
  },
};

export { cloudinary };
