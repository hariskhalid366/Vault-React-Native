import { Dimensions, useColorScheme } from 'react-native';
import * as OutLine from 'lucide-react-native';
import { storage } from '../db/mmkv';
import { useMMKVBoolean } from 'react-native-mmkv';

export const isBase64 = (str: string) => {
  const base64Regex =
    /^(?:[A-Za-z0-9+\/]{4})*(?:[A-Za-z0-9+\/]{2}==|[A-Za-z0-9+\/]{3}=)?$/;
  return base64Regex.test(str);
};

export const screenHeight = Dimensions.get('screen').height;
export const screenWidth = Dimensions.get('screen').width;
export const multiColor = [
  '#0B3D91',
  '#1E4DFF',
  '#104E8B',
  '#4682B4',
  '#6A5ACD',
  '#7B68EE',
];
export const svgPath =
  'M0,100L120,120C240,140,480,180,720,180C960,180,1200,140,1320,120L1440,100L1440,0L1320,0C1200,0,960,0,720,0C480,0,240,0,120,0L0,0Z';

export const Icons = [
  { name: 'Photos', icon: OutLine.Image, type: 'images' },
  { name: 'Videos', icon: OutLine.Film, type: 'videos' },
  { name: 'Audio', icon: OutLine.Music, type: 'audios' },
  { name: 'Files', icon: OutLine.FolderOpenIcon, type: 'files' },
];
export const Sections = [
  { name: 'Private Browser', icon: OutLine.HatGlasses, type: 'browser' },
  { name: 'Password', icon: OutLine.Lock, type: 'password' },
];

export const randText = {
  headings: [
    {
      title: 'Your Digital Safe Awaits',
      description:
        'With one tap, your files stay safe, protected, private, and beautifully organized. Security has never felt this simple.',
    },
    {
      title: 'Secure. Smart. Effortless.',
      description:
        'Encrypt, hide, and protect your files with confidence and style. Strength and simplicity, perfectly balanced.',
    },
    {
      title: 'Protect, Sneak & Smile',
      description:
        'Valut that keeps everything safe, encrypted, and always within reach. A joyful design with serious protection.',
    },
  ],
};

export const getMimeType = (uri: string): string => {
  if (!uri) return '*/*';
  const ext = uri.split('.').pop()?.toLowerCase() ?? '';

  switch (ext) {
    case 'jpg':
    case 'jpeg':
      return 'image/jpeg';
    case 'png':
      return 'image/png';
    case 'gif':
      return 'image/gif';
    case 'mp4':
      return 'video/mp4';
    case 'mp3':
    case 'mpeg':
      return 'audio/mpeg';
    case 'pdf':
      return 'application/pdf';
    case 'doc':
      return 'application/msword';
    case 'docx':
      return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    case 'xls':
      return 'application/vnd.ms-excel';
    case 'xlsx':
      return 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    case 'txt':
      return 'text/plain';
    default:
      return '*/*';
  }
};

export const useColors = () => {
  const systemScheme = useColorScheme(); // 'light' or 'dark'
  const [darkThemeEnabled] = useMMKVBoolean('darkheme', storage);

  const finalTheme =
    darkThemeEnabled === undefined || darkThemeEnabled === false
      ? 'light'
      : systemScheme; // fallback to system

  return finalTheme === 'dark' ? DarkColors : LightColors;
};
export enum LightColors {
  primary = '#007AFF',
  background = '#ffffff',
  icons = '#000',
  text = '#000',
  theme = '#CF551F',
  secondary = '#E5EBF5',
  tertiary = '#3C75BE',
  secondary_light = '#F6F7F9',
  primary_light = '#80BFFF',
  skeleton = '#f0f0f0',
  skeleton_Linear = '#f3f3f3',
  skeleton_Linear_Light = '#fff',
  lockButton = '#00000022',
}

export enum DarkColors {
  primary = '#3399FF', // Bright blue for dark background
  background = '#000000', // Deep dark background
  icons = '#FFF',
  text = '#E6E6E6', // Soft white text
  theme = '#FF784E', // Vibrant orange accent
  secondary = '#1C1F26', // Muted secondary surface
  tertiary = '#3C8DFF', // Bright tertiary blue
  secondary_light = '#2A2E36', // Slightly lighter surface shade
  primary_light = '#66B3FF', // Lighter blue gradient tone
  skeleton = '#ffffff34',
  skeleton_Linear = '#1e1e1e',
  skeleton_Linear_Light = '#181818',
  lockButton = '#ffffff22',
}
