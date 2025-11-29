import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, View } from 'react-native';
import RNFS from 'react-native-fs';
import * as Icons from 'lucide-react-native';
import Animated, {
  LinearTransition,
  ZoomIn,
  ZoomOut,
} from 'react-native-reanimated';

import Header from '../../component/Header';
import ActionButtom from '../../component/ActionButtom';
import { screenWidth, useColors } from '../../utils/Constants';
import showToast from '../../component/Toast';
import { navigate } from '../../utils/NavigationUtil';
import { AssetItem } from '../../component/AssetItem';
import ProgressBar from '../../component/ProgressBar';
import { CameraRoll } from '@react-native-camera-roll/camera-roll';

const ICON_SIZE = screenWidth * 0.08;
const ITEM_SIZE = screenWidth * 0.24;
const NUM_COLUMNS = Math.floor(screenWidth / ITEM_SIZE);

interface useAlbumAssetsProps {
  isAlbum: boolean;
  name: string;
  path: string;
}

type AlbumAsset = {
  id: string;
  type: string;
  uri: string;
  obj: any;
};

const AssetsScreen: FC = ({ route }: any) => {
  const galleryPath = `${RNFS.PicturesDirectoryPath}/Vault`;

  const { path, name, isAlbum } = route.params;
  const Colors = useColors();

  const folderName = useMemo(
    () => (isAlbum ? name : path?.substring(path?.lastIndexOf('/') + 1)),
    [path, name],
  );

  const [assets, setAssets] = useState<any[]>([]);
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [selectAllActive, setSelectAllActive] = useState(false);
  const [progress, setProgress] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingNextPage, setIsLoadingNextPage] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [nextCursor, setNextCursor] = useState<string | undefined>(undefined);

  const pageSize = 100;

  const loadNextPage = useCallback(async () => {
    if (!isAlbum) return;
    if (isLoading) return;

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
        uri: edge.node.image.uri,
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

  // Example: infinite scroll
  const handleEndReached = () => {
    if (hasNextPage && !isLoadingNextPage) {
      loadNextPage();
    }
  };

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
          uri: edge.node.image.uri,
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

  const toggleSelection = useCallback(
    (item: any) => {
      if (!isSelecting) return;

      setSelectedFiles(prev => {
        const updated = prev.includes(item.path)
          ? prev.filter(p => p !== item.path)
          : [...prev, item.path];

        if (updated.length === assets.length) setSelectAllActive(true);
        if (updated.length !== assets.length) setSelectAllActive(false);
        if (updated.length === 0) setIsSelecting(false);

        return updated;
      });
    },
    [isSelecting, assets.length],
  );

  const handlePress = useCallback(
    (item: any, index: any) => {
      if (isSelecting) return toggleSelection(item);
      if (!isSelecting)
        return navigate('assetviewer', { data: assets, selectedIndex: index });
    },
    [isSelecting, toggleSelection],
  );

  const handleLongPress = useCallback(
    (item: any) => {
      setIsSelecting(true);
      toggleSelection(item);
    },
    [toggleSelection],
  );

  const deleteSelectedFiles = useCallback(() => {
    if (selectedFiles.length === 0) {
      showToast('No files selected ❌');
      return;
    }

    Alert.alert('Confirm Delete', `Delete ${selectedFiles.length} file(s)?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await Promise.all(
              selectedFiles.map(async filePath => {
                const exists = await RNFS.exists(filePath);
                if (exists) await RNFS.unlink(filePath);
              }),
            );
            showToast('Deleted successfully 🗑️');
            setSelectedFiles([]);
            setIsSelecting(false);
            setSelectAllActive(false);
            await loadAssets();
          } catch (err) {
            console.error('Error deleting files:', err);
            showToast('Error deleting ❌');
          }
        },
      },
    ]);
  }, [selectedFiles, loadAssets]);

  const handleMoveTo = useCallback(() => {
    navigate('move', {
      files: selectedFiles,
      currentFolder: folderName,
    });
  }, [selectedFiles, folderName]);

  const movePickedFileToVault = useCallback(
    async (destinationFolderPath: string) => {
      if (!selectedFiles?.length) return showToast('No picked files found');
      if (!destinationFolderPath)
        return showToast('Select a valid destination');

      try {
        for (let i = 0; i < selectedFiles.length; i++) {
          const fileName = selectedFiles[i].substring(
            selectedFiles[i].lastIndexOf('/') + 1,
          );
          console.log(fileName);

          const destinationPath = `${destinationFolderPath}/${fileName}`;
          await RNFS.moveFile(selectedFiles[i], destinationPath);

          setProgress((i + 1) / selectedFiles.length);
        }

        showToast('Files Exported successfully');
        setProgress(0);
        loadAssets();
      } catch (err) {
        console.log('❌ Error moving file:', err);
        showToast('Error moving file');
      }
    },
    [selectedFiles, loadAssets],
  );

  const handleExport = async () => {
    await RNFS.exists(galleryPath)
      .then(bool => {
        if (!bool) {
          RNFS.mkdir(galleryPath);
        }
      })
      .catch(err => console.log(err));
    Alert.alert('Confirm Export', `Export ${selectedFiles.length} file(s)?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Export',
        style: 'default',
        onPress: async () => {
          try {
            await movePickedFileToVault(galleryPath);
            setSelectedFiles([]);
            setIsSelecting(false);
            setSelectAllActive(false);
          } catch (err) {
            console.error('Error exporting files:', err);
            showToast('Error Exporting ❌');
          }
        },
      },
    ]);
  };

  const toggleSelectAll = useCallback(() => {
    if (!isSelecting) {
      setIsSelecting(true);
      setSelectAllActive(true);
      setSelectedFiles(assets.map(a => a.path));
      return;
    }

    if (selectAllActive) {
      setSelectedFiles([]);
      setSelectAllActive(false);
      setIsSelecting(false);
    } else {
      setSelectedFiles(assets.map(a => a.path));
      setSelectAllActive(true);
    }
  }, [isSelecting, selectAllActive, assets]);

  const actionButtons = useMemo(
    () => [
      { id: 0, title: 'Export', ICON: Icons.LogOut, onPress: handleExport },
      {
        id: 1,
        title: 'Delete',
        ICON: Icons.Trash2,
        onPress: deleteSelectedFiles,
      },
      {
        id: 2,
        title: 'Move To',
        ICON: Icons.FolderInput,
        onPress: handleMoveTo,
      },
    ],
    [handleExport, deleteSelectedFiles, handleMoveTo],
  );

  return (
    <View style={{ flex: 1 }}>
      <Header
        title={isSelecting ? `${selectedFiles.length} selected` : folderName}
        onRightActionPress={isSelecting ? toggleSelectAll : undefined}
        onLeftActionPress={() => {
          setIsSelecting(false);
          setSelectedFiles([]);
          setSelectAllActive(false);
        }}
        rightButton={
          isSelecting && (
            <Icons.BadgeCheck
              size={ICON_SIZE}
              strokeWidth={1.2}
              color={selectAllActive ? Colors.primary : Colors.icons}
            />
          )
        }
        leftButton={
          isSelecting && (
            <Icons.XIcon
              color={Colors.icons}
              size={ICON_SIZE}
              strokeWidth={1.2}
            />
          )
        }
      />
      {progress !== 0 && <ProgressBar progress={0} />}

      <Animated.FlatList
        data={assets}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <AssetItem
            key={(index / 100) * Math.random()}
            index={index}
            item={item}
            isSelected={selectedFiles.includes(item?.path)}
            onPress={handlePress}
            onLongPress={handleLongPress}
          />
        )}
        contentContainerStyle={styles.flatlist}
        style={{ flex: 1 }}
        itemLayoutAnimation={LinearTransition}
        initialNumToRender={30}
        maxToRenderPerBatch={50}
        updateCellsBatchingPeriod={50}
        windowSize={25}
        removeClippedSubviews={true}
        legacyImplementation={true}
        scrollEventThrottle={18}
        showsVerticalScrollIndicator={false}
        getItemLayout={(data, index) => ({
          length: ITEM_SIZE,
          offset: ITEM_SIZE * Math.floor(index / NUM_COLUMNS),
          index,
        })}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          isLoadingNextPage ? (
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                paddingVertical: 20,
              }}
            >
              <ActivityIndicator color={Colors.icons} size="small" />
            </View>
          ) : null
        }
      />

      {isSelecting && (
        <Animated.View
          entering={ZoomIn.springify().stiffness(200).damping(30)}
          exiting={ZoomOut.springify().stiffness(200).damping(30)}
          style={[
            { backgroundColor: Colors.skeleton_Linear },
            styles.actionBar,
          ]}
        >
          {actionButtons.map(item => (
            <ActionButtom
              key={item.id}
              text={item.title}
              onPress={item.onPress}
              ICON={item.ICON}
            />
          ))}
        </Animated.View>
      )}
    </View>
  );
};

export default AssetsScreen;

const styles = StyleSheet.create({
  flatlist: {
    alignItems: 'flex-start',
    marginTop: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  actionBar: {
    flexDirection: 'row',
    height: 85,
    bottom: 15,
    borderRadius: 15,
    overflow: 'hidden',
    marginHorizontal: 15,
    position: 'absolute',
    alignSelf: 'flex-end',
    gap: 30,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
