import { api } from './axiosInstance';

export const compressImage = (file: File, quality: number = 0.7): Promise<File> => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const compressedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now(),
            });
            resolve(compressedFile);
          } else {
            resolve(file);
          }
        },
        file.type,
        quality
      );
    };
    img.onerror = () => {
      resolve(file);
    };
    img.src = URL.createObjectURL(file);
  });
};

export const uploadFileAndGetId = async (file: File): Promise<number> => {
  const response = await api.post('/storage/create-file', { fileName: file.name, contentType: file.type });
  const uploadUrl = response.uploadUrl;
  const fileObj = response.file;
  await fetch(uploadUrl, {
    method: 'PUT',
    headers: { 'Content-Type': file.type },
    body: file,
  });
  return fileObj.id;
};

export const deleteFileById = async (fileId: number): Promise<void> => {
  return api.delete(`/storage/file/${fileId}`);
};
