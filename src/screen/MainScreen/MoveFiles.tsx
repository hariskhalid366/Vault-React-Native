import { FlatList, StyleSheet, Text, View } from 'react-native';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import RNFS from 'react-native-fs';
import { FolderItem } from '../../component/FolderItem';
import { useColors } from '../../utils/Constants';
import Header from '../../component/Header';
import showToast from '../../component/Toast';
import ProgressBar from '../../component/ProgressBar';
import { resetAndNavigate } from '../../utils/NavigationUtil';

const MoveFiles = ({ route }: any) => {
  const { files, currentFolder } = route.params;
  const Colors = useColors();
  const [folders, setFolders] = useState<any[] | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const vaultPath = useMemo(() => `${RNFS.DocumentDirectoryPath}/Vault`, []);

  const loadFolders = useCallback(async () => {
    try {
      const result = await RNFS.readDir(vaultPath);
      const filterFolder = result.filter(f => f.name !== currentFolder);
      setFolders(filterFolder);
      console.log(result);
    } catch (err) {
      console.log('Error reading folders:', err);
    }
  }, [vaultPath, currentFolder]);

  useEffect(() => {
    loadFolders();
  }, [loadFolders]);

  const movePickedFileToVault = useCallback(
    async (destinationFolderPath: string) => {
      if (!files?.length) return showToast('No picked files found');
      if (!destinationFolderPath)
        return showToast('Select a valid destination');

      try {
        for (let i = 0; i < files.length; i++) {
          const fileName = files[i].substring(files[i].lastIndexOf('/') + 1);
          console.log(fileName);

          const destinationPath = `${destinationFolderPath}/${fileName}`;
          
          // Check if file already exists to avoid overwrite or error
          const exists = await RNFS.exists(destinationPath);
          if (exists) {
              console.log(`File ${fileName} already exists in destination.`);
              // Optional: Rename or skip. For now, we'll skip or overwrite depending on requirement. 
              // RNFS.moveFile might fail if exists. Let's try to move and catch specific error if needed.
          }

          await RNFS.moveFile(files[i], destinationPath);

          setProgress((i + 1) / files.length);
        }

        showToast('Files moved successfully');
        setProgress(0);
        resetAndNavigate('home');
        await loadFolders();
      } catch (err) {
        console.log('❌ Error moving file:', err);
        showToast('Error moving file');
        setProgress(0);
      }
    },
    [files, loadFolders],
  );

  const handleFolderPress = useCallback(
    (item: any) => {
      if (item) {
        movePickedFileToVault(item.path);
      }
    },
    [movePickedFileToVault],
  );

  const renderItem = useCallback(({ item, index }: any) => (
    <FolderItem
      item={item}
      index={index}
      Colors={Colors}
      onPress={handleFolderPress}
    />
  ), [Colors, handleFolderPress]);

  return (
    <View style={{ flex: 1 }}>
      <Header title="Move To" />
      {progress !== 0 && <ProgressBar progress={progress} />}
      <FlatList
        contentContainerStyle={{ padding: 20 }}
        data={folders}
        keyExtractor={(item) => item.path}
        numColumns={4}
        scrollEnabled={true}
        removeClippedSubviews
        windowSize={10}
        initialNumToRender={20}
        renderItem={renderItem}
      />
    </View>
  );
};

export default MoveFiles;

const styles = StyleSheet.create({});
