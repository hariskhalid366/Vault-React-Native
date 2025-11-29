import { launchImageLibrary, Asset } from 'react-native-image-picker';
import { pick } from '@react-native-documents/picker';
import { PermissionsAndroid, Platform } from 'react-native';
import { request, PERMISSIONS, RESULTS } from 'react-native-permissions';

type MediaPickedCallback = (media: Asset) => void;
type FilePickedCallback = (file: any) => void;

export const pickImage = (onMediaPickedUp: MediaPickedCallback) => {
  launchImageLibrary(
    {
      mediaType: 'photo',
      quality: 1,
      includeBase64: false,
      selectionLimit: 50,
    },
    (response: any) => {
      if (response.didCancel) {
        console.log('User canceled image picker');
      } else if (response.errorCode) {
        console.log('ImagePicker Error: ', response.errorMessage);
      } else {
        const { assets } = response;
        if (assets && assets.length > 0) {
          const selectedImage = assets;
          onMediaPickedUp(selectedImage);
        }
      }
    },
  );
};
export const pickVideos = (onMediaPickedUp: MediaPickedCallback) => {
  launchImageLibrary(
    {
      mediaType: 'video',
      includeBase64: false,
      videoQuality: 'high',
      selectionLimit: 20,
    },
    (response: any) => {
      if (response.didCancel) {
        console.log('User canceled image picker');
      } else if (response.errorCode) {
        console.log('ImagePicker Error: ', response.errorMessage);
      } else {
        const { assets } = response;
        if (assets && assets.length > 0) {
          const selectedImage = assets;
          onMediaPickedUp(selectedImage);
        }
      }
    },
  );
};

export const pickDocument = async (onFilePickedUp: FilePickedCallback) => {
  try {
    const [pickResult] = await pick({
      allowMultiSelection: true,
      allowVirtualFiles: true,
    });
    onFilePickedUp(pickResult);
  } catch (err: unknown) {
    console.log(err);
  }
};

export const formatFileSize = (sizeInBytes: number): string => {
  if (sizeInBytes >= 1024 ** 3) {
    return (sizeInBytes / 1024 ** 3).toFixed(2) + ' GB';
  } else if (sizeInBytes >= 1024 ** 2) {
    return (sizeInBytes / 1024 ** 2).toFixed(2) + ' MB';
  } else if (sizeInBytes >= 1024) {
    return (sizeInBytes / 1024).toFixed(2) + ' KB';
  } else {
    return sizeInBytes + ' B';
  }
};

export const convertMillisecondsToTime = (milliseconds: number) => {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

export const checkFilePermissions = async () => {
  if (Platform.OS === 'android') {
    try {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
        PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO,
      ]);

      if (
        granted['android.permission.READ_EXTERNAL_STORAGE'] ===
          PermissionsAndroid.RESULTS.GRANTED &&
        granted['android.permission.WRITE_EXTERNAL_STORAGE'] ===
          PermissionsAndroid.RESULTS.GRANTED
      ) {
        console.log('Storage permission granted ✅');
        return true;
      } else {
        console.log('Storage permission denied ❌');
        return false;
      }
    } catch (err) {
      console.log('Permission error:', err);
      return false;
    }
  } else if (Platform.OS === 'ios') {
    try {
      const result = await request(PERMISSIONS.IOS.MEDIA_LIBRARY);
      if (result === RESULTS.GRANTED) {
        console.log('iOS media library permission granted ✅');
        return true;
      } else {
        console.log('iOS media library permission denied ❌');
        return false;
      }
    } catch (error) {
      console.error('Error requesting iOS permission:', error);
      return false;
    }
  } else return;
};
