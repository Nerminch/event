import {
  generateUploadButton,
  generateUploadDropzone,
} from "@uploadthing/react";
import type { OurFileRouter } from "../app/api/uploadthing/core";

export function useUploadThing(uploadType: string) {
  return {
    startUpload: async (files: File[]) => {
      try {
        const response = await Promise.all(
          files.map(async (file) => {
            // Corrige ici avec des backticks pour la template string
            return { url: `uploaded_url_for_${file.name}` };
          })
        );
        return response;
      } catch (error) {
        console.error("Error uploading files:", error);
        throw error;
      }
    },
  };
}

export const UploadButton = generateUploadButton<OurFileRouter>();
export const UploadDropzone = generateUploadDropzone<OurFileRouter>();
