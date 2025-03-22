import * as FileSystem from 'expo-file-system';
import { Alert } from 'react-native';

const API_BASE = 'http://192.168.0.7:25561';

export const uploadVideo = async (videoUri: string): Promise<string | null> => {
  if (!videoUri) return null;
  try {
    console.log('Uploading file from:', videoUri);
    const fileUploadUrl = `${API_BASE}/upload/video`;
    const uploadResult = await FileSystem.uploadAsync(fileUploadUrl, videoUri, {
      httpMethod: 'POST',
      fieldName: 'video',
      uploadType: FileSystem.FileSystemUploadType.MULTIPART,
    });
    if (uploadResult.status !== 200) {
      throw new Error('Video upload failed');
    }
    const result = JSON.parse(uploadResult.body);
    return result.fileUrl || null;
  } catch (error: any) {
    Alert.alert('Error', error.message);
    return null;
  }
};

export const uploadMetadata = async (metadata: any) => {
  try {
    const response = await fetch(`${API_BASE}/upload/metadata`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(metadata),
    });
    if (!response.ok) throw new Error('Metadata upload failed');
  } catch (error) {
    throw error;
  }
};
