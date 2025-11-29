import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Alert,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import Header from '../../component/Header';
import * as Icons from 'lucide-react-native';
import {
  randText,
  screenHeight,
  screenWidth,
  useColors,
} from '../../utils/Constants';
import Option from '../../component/Option';
import CustomText from '../../component/CustomText';
import Section from '../../component/Section';
import { checkFilePermissions } from '../../utils/libraryHelpers';
import RNFS from 'react-native-fs';
import showToast from '../../component/Toast';
import CreateFolder from '../../component/model/CreateFolder';

import { navigate } from '../../utils/NavigationUtil';
import { useMMKVObject } from 'react-native-mmkv';
import { storage } from '../../db/mmkv';
import { FilesProps, ImageFileProps, VideoFileProps } from '../../utils/type';
import AvalibilityAnimation from '../../component/AvalibilityAnimation';
import { FolderItem } from '../../component/FolderItem';
import ProgressBar from '../../component/ProgressBar';
import Banner from '../../component/Banner';
import { useIsFocused } from '@react-navigation/native';
import Loading from '../../component/Loading';

const ICON_SIZE = screenWidth * 0.08;

const HomeScreen = () => {
  const isFocused = useIsFocused();
  const Colors = useColors();
  const vaultPath = useMemo(() => `${RNFS.DocumentDirectoryPath}/Vault`, []);

  // State Management
  const [folders, setFolders] = useState<any[]>([]);
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectedFolders, setSelectedFolders] = useState<string[]>([]);
  const [progress, setProgress] = useState<number>(0);
  const [isCancelable, setIsCancelable] = useState(true);

  const [onPickedUp, setOnPickedUp] = useMMKVObject<
    ImageFileProps[] | VideoFileProps[] | FilesProps[] | undefined
  >('FilePickUp', storage);

  //  Initial Setup
  useEffect(() => {
    (async () => {
      await checkFilePermissions();
      await ensureVaultExists();
      await loadFolders();
    })();
  }, [visible]);

  // Ensure Vault Folder Exists
  const ensureVaultExists = useCallback(async () => {
    const exists = await RNFS.exists(vaultPath);
    if (!exists) {
      await RNFS.mkdir(vaultPath);
      showToast('Vault folder created');
    }
  }, [vaultPath]);

  // Load Folders
  const loadFolders = useCallback(async () => {
    try {
      setLoading(true);
      const result = await RNFS.readDir(vaultPath);
      setFolders(result);
      setLoading(false);
    } catch (err) {
      console.log('Error reading folders:', err);
      setLoading(false);
    }
  }, [vaultPath, isFocused]);

  //  Selection Toggle
  const toggleSelection = useCallback(
    (path: string) => {
      if (!isSelecting) return;
      setSelectedFolders(prev => {
        const updated = prev.includes(path)
          ? prev.filter(p => p !== path)
          : [...prev, path];
        if (updated.length === 0) setIsSelecting(false);
        return updated;
      });
    },
    [isSelecting],
  );

  // 🗑 Delete Selected Folders
  const deleteSelectedFolders = useCallback(() => {
    if (selectedFolders.length === 0) {
      showToast('No folders selected ❌');
      return;
    }

    Alert.alert(
      'Confirm Delete',
      `Delete ${selectedFolders.length} folder(s)?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await Promise.all(
                selectedFolders.map(async path => {
                  const exists = await RNFS.exists(path);
                  if (exists) await RNFS.unlink(path);
                }),
              );
              showToast('Folders deleted 🗑️');

              setSelectedFolders([]);
              setIsSelecting(false);
              await loadFolders();
            } catch (err) {
              console.error('Error deleting folders:', err);
              showToast('Error deleting ❌');
            }
          },
        },
      ],
    );
  }, [selectedFolders, loadFolders]);

  const movePickedFileToVault = useCallback(
    async (destinationFolderPath: string) => {
      if (!onPickedUp?.length) return showToast('No picked files found');
      if (!destinationFolderPath)
        return showToast('Select a valid destination');

      try {
        setIsCancelable(false);
        for (let i = 0; i < onPickedUp.length; i++) {
          const file = onPickedUp[i];
          const originalPath =
            (file as ImageFileProps | VideoFileProps).originalPath ||
            (file as FilesProps).uri;
          const fileName =
            (file as ImageFileProps | VideoFileProps).fileName ||
            (file as FilesProps).name;
          if (!originalPath || !fileName) continue;

          const destinationPath = `${destinationFolderPath}/${fileName}`;
          await RNFS.moveFile(originalPath, destinationPath);

          setProgress((i + 1) / onPickedUp.length);
        }

        showToast('Files moved successfully');
        setOnPickedUp(undefined);
        setProgress(0);
        setIsCancelable(true);
        await loadFolders();
      } catch (err) {
        console.log('❌ Error moving file:', err);
        showToast('Error moving file');
        setIsCancelable(true);
      }
    },
    [onPickedUp, loadFolders],
  );

  // 🔹 Folder item press handlers
  const handleFolderPress = useCallback(
    (item: any, isSelected: boolean) => {
      if (isSelecting) return toggleSelection(item.path);
      if (onPickedUp) return movePickedFileToVault(item.path);
      if (!isSelected) navigate('asset', { path: item.path });
    },
    [isSelecting, onPickedUp, movePickedFileToVault, toggleSelection],
  );

  const handleLongPress = useCallback(() => {
    setIsSelecting(true);
  }, []);

  // 🖼 Media picker handlers
  const onMediaPickedUp = useCallback(setOnPickedUp, []);
  const onFilePickedUp = useCallback((file: any) => {
    console.log('file', file);
  }, []);
  const onVideoPickUp = useCallback(setOnPickedUp, []);
  const onAudioPickUp = useCallback((audio: any) => {
    console.log('audio', audio);
  }, []);

  return (
    <>
      {loading && <Loading />}
      <ScrollView
        stickyHeaderIndices={[0]}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: screenHeight * 0.2 }}
      >
        {/* 🔹 Header */}
        <Header
          title={isSelecting ? `${selectedFolders.length} Selected` : 'Home'}
          onRightActionPress={
            isSelecting ? deleteSelectedFolders : () => navigate('setting')
          }
          onLeftActionPress={() => setIsSelecting(false)}
          rightButton={
            isSelecting ? (
              <Icons.Trash2
                color={Colors.icons}
                size={ICON_SIZE}
                strokeWidth={1.2}
              />
            ) : (
              <Icons.Settings
                color={Colors.icons}
                size={ICON_SIZE}
                strokeWidth={1.2}
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

        {/* 🔹 Progress Bar */}
        {progress > 0 && <ProgressBar progress={progress} />}

        {/* 🔹 Vault Info */}
        <Banner />
        {/* 🔹 Options */}
        <Option
          onMediaPickUp={onMediaPickedUp}
          onFilePickUp={onFilePickedUp}
          onVideoPickUp={onVideoPickUp}
          onAudioPickUp={onAudioPickUp}
        />

        {/* 🔹 Folder Grid */}
        {folders.length > 0 && (
          <View
            style={{
              marginHorizontal: 25,
            }}
          >
            <CustomText
              fontFamily="Okra-Bold"
              fontSize={18}
              style={{ paddingBottom: 15 }}
            >
              Folders
            </CustomText>
            <FlatList
              style={{ flex: 1 }}
              contentContainerStyle={styles.flatlistView}
              data={folders}
              keyExtractor={(_, i) => i.toString()}
              scrollEnabled={false}
              removeClippedSubviews
              windowSize={10}
              initialNumToRender={20}
              renderItem={({ item, index }) => (
                <FolderItem
                  item={item}
                  index={index}
                  isSelected={selectedFolders.includes(item.path)}
                  Colors={Colors}
                  onPress={handleFolderPress}
                  onLongPress={handleLongPress}
                />
              )}
            />
          </View>
        )}

        <Section />
      </ScrollView>
      {/* 🔹 Floating Add Button */}
      {!isSelecting && !onPickedUp && (
        <TouchableOpacity
          style={[
            styles.addFolder,
            { backgroundColor: Colors.skeleton_Linear },
          ]}
          onPress={() => setVisible(true)}
        >
          <Icons.Plus color={Colors.icons} size={ICON_SIZE} />
        </TouchableOpacity>
      )}

      {/* 🔹 Folder Creator Modal */}
      <CreateFolder
        vaultPath={vaultPath}
        visible={visible}
        setVisible={setVisible}
      />

      {/* 🔹 Picked File Animation */}
      {onPickedUp && (
        <AvalibilityAnimation
          data={onPickedUp}
          cancel={isCancelable}
          onPress={() => setOnPickedUp(undefined)}
        />
      )}
    </>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  addFolder: {
    width: 60,
    height: 60,
    borderRadius: 15,
    position: 'absolute',
    bottom: 30,
    right: 20,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  flatlistView: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 8,
  },
});
