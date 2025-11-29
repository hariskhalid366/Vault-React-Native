import { useCallback, useEffect, useState } from 'react';
import { CameraRoll } from '@react-native-camera-roll/camera-roll';
import RNFS from 'react-native-fs';

interface useAlbumAssetsProps {
  isAlbum: boolean;
  name: string;
  path: string;
}

type AlbumAsset = {
  id: string;
  type: string;
  image: string;
  obj: any;
};

export const useAlbumAssets = ({
  isAlbum,
  name,
  path,
}: useAlbumAssetsProps) => {
  const [assets, setAssets] = useState<Array<AlbumAsset | RNFS.ReadDirItem>>(
    [],
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingNextPage, setIsLoadingNextPage] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [nextCursor, setNextCursor] = useState<string | undefined>(undefined);

  const pageSize = 50;

  const loadNextPage = useCallback(async () => {
    if (!isAlbum) return;

    try {
      setIsLoadingNextPage(true);
      const { edges, page_info } = await CameraRoll.getPhotos({
        first: pageSize,
        groupName: name,
        assetType: 'All',
        after: nextCursor,
      });

      const newAssets: AlbumAsset[] = edges.map(edge => ({
        id: edge.node.id,
        type: edge.node.type,
        image: edge.node.image.uri,
        obj: edge.node.image as any,
      }));

      setAssets(prev => [...prev, ...newAssets]);
      setNextCursor(page_info.end_cursor);
      setHasNextPage(page_info.has_next_page);
    } catch (err) {
      console.log('Error loading next page:', err);
    } finally {
      setIsLoadingNextPage(false);
    }
  }, [isAlbum, name, nextCursor]);

  const loadAssets = useCallback(async () => {
    try {
      setIsLoading(true);

      if (isAlbum) {
        const { edges, page_info } = await CameraRoll.getPhotos({
          first: pageSize,
          groupName: name,
          assetType: 'All',
        });

        const allAssets: AlbumAsset[] = edges.map(edge => ({
          id: edge.node.id,
          type: edge.node.type,
          image: edge.node.image.uri,
          obj: edge.node.image as any,
        }));

        setAssets(allAssets);
        setNextCursor(page_info.end_cursor);
        setHasNextPage(page_info.has_next_page);
      } else {
        const result = await RNFS.readDir(path);
        setAssets(result);
      }
    } catch (err) {
      console.log('Error reading folders:', err);
    } finally {
      setIsLoading(false);
    }
  }, [path, isAlbum, name]);

  useEffect(() => {
    loadAssets();
  }, [loadAssets]);

  return {
    assets,
    loadAssets,
    loadNextPage,
    isLoading,
    isLoadingNextPage,
    hasNextPage,
  };
};
