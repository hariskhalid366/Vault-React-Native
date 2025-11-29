import { createMMKV, MMKV } from 'react-native-mmkv';

export const storage = createMMKV({
  id: 'fileVault',
  encryptionKey:
    'c75e1a7a6bdb6e5cb2e3f1a9130d2b79d874df40ac3b6a1b2ef9450b2391a2fd',
});

export const mmkvStorage = {
  setItem: (key: string, value: any) => {
    storage.set(key, value);
  },
  getItem: (key: string) => {
    const value = storage.getString(key);
    return value ?? null;
  },
  removeItem: (key: string) => {
    storage.remove(key);
  },
};
