import { Storage } from 'appwrite';
import { client } from './appwrite';

const storage = new Storage(client);

const BUCKET_ID = 'trafficImages';

export const uploadImage = async (file) => {
  try {
    return await storage.createFile(BUCKET_ID, 'unique()', file);
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};

export const getImagePreview = (fileId) => {
  return storage.getFilePreview(BUCKET_ID, fileId);
};

export const deleteImage = async (fileId) => {
  try {
    return await storage.deleteFile(BUCKET_ID, fileId);
  } catch (error) {
    console.error('Error deleting image:', error);
    throw error;
  }
};