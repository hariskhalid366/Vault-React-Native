export type MMKVProps = {
  id: string;
  encryptionKey: string;
};

export interface ImageFileProps {
  fileName?: string;
  fileSize?: number;
  height?: number;
  path?: string;
  originalPath?: string;
  type?: string;
  uri?: string;
  width?: number;
}

export interface VideoFileProps {
  fileName: string;
  fileSize: number;
  height: number;
  width: number;
  originalPath: string;
  type: string;
  uri: string;
  duration?: number;
  bitrate?: number;
}

export interface FilesProps {
  convertibleToMimeTypes: string[] | null;
  error: string | null;
  hasRequestedType: boolean;
  isVirtual: boolean;
  name: string;
  nativeType: string;
  size: number;
  type: string;
  uri: string;
}
