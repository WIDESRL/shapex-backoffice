import { api } from './axiosInstance';

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
