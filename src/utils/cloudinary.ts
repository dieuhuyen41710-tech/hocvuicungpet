export const CLOUDINARY_CLOUD_NAME = (import.meta as any).env?.VITE_CLOUDINARY_CLOUD_NAME || 'sq7gvzba';
export const CLOUDINARY_UPLOAD_PRESET = (import.meta as any).env?.VITE_CLOUDINARY_UPLOAD_PRESET || 'ml_default';

export async function uploadToCloudinary(
  file: File,
  onProgress?: (progress: number) => void
): Promise<string> {
  const url = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/auto/upload`;
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', url, true);

    if (onProgress && xhr.upload) {
      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          const percent = Math.round((e.loaded * 100) / e.total);
          onProgress(percent);
        }
      };
    }

    xhr.onload = () => {
      if (xhr.status === 200) {
        try {
          const response = JSON.parse(xhr.responseText);
          if (response.secure_url) {
            resolve(response.secure_url);
          } else {
            reject(new Error('Cloudinary response missing secure_url'));
          }
        } catch (err) {
          reject(new Error('Failed to parse Cloudinary response'));
        }
      } else {
        try {
          const errRes = JSON.parse(xhr.responseText);
          reject(new Error(errRes.error?.message || `Upload failed with status ${xhr.status}`));
        } catch (e) {
          reject(new Error(`Upload failed with status ${xhr.status}`));
        }
      }
    };

    xhr.onerror = () => {
      reject(new Error('Network error during Cloudinary upload'));
    };

    xhr.send(formData);
  });
}
