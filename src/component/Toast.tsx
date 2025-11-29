import { ToastAndroid } from 'react-native';

const showToast = (message: string) => {
  ToastAndroid.showWithGravity(
    message,
    ToastAndroid.SHORT,
    ToastAndroid.CENTER,
  );
};

export default showToast;
