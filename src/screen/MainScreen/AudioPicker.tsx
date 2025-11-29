import React, {
  useCallback,
  useEffect,
  useState,
  useRef,
  useMemo,
} from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { fetchAudioFiles, Song } from '@gauch_99/react-native-audio-files';
import Header from '../../component/Header';
import ListView from '../../component/ListView';
import { screenWidth, useColors } from '../../utils/Constants';
import * as Icons from 'lucide-react-native';
import showToast from '../../component/Toast';
import RNFS from 'react-native-fs';
import ProgressBar from '../../component/ProgressBar';

const ITEM_HEIGHT = 64;
const ICON_SIZE = screenWidth * 0.06;

const MemoizedListView = React.memo(ListView);

const AudioPicker = () => {
  const audioPath = useMemo(
    () => `${RNFS.DocumentDirectoryPath}/Vault/Audios`,
    [],
  );

  const Colors = useColors();
  const [audioFiles, setAudioFiles] = useState<Song[]>([]);
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectedAudioSet, setSelectedAudioSet] = useState<Set<string>>(
    new Set(),
  );
  const [progress, setProgress] = useState<number>(0);

  const flatListRef = useRef<FlatList>(null);

  /** Fetch audio files once */
  useEffect(() => {
    const getAudioFiles = async () => {
      try {
        const result = await fetchAudioFiles();
        if (Array.isArray(result)) setAudioFiles(result);
      } catch (err) {
        console.error('Error fetching audio files:', err);
      }
    };
    getAudioFiles();
  }, []);

  /** Toggle selection efficiently using Set (O(1)) */
  const toggleSelectAudio = useCallback(
    (audio: Song) => {
      if (!isSelecting) return;
      setSelectedAudioSet(prev => {
        const newSet = new Set(prev);
        if (newSet.has(audio.audioUrl)) {
          newSet.delete(audio.audioUrl);
        } else {
          newSet.add(audio.audioUrl);
        }
        return newSet;
      });
    },
    [isSelecting],
  );

  /** Enable selection mode */
  const handleLongPress = useCallback(() => {
    setIsSelecting(true);
  }, []);

  /** Exit selection mode */
  const handleCancelSelection = useCallback(() => {
    setIsSelecting(false);
    setSelectedAudioSet(new Set());
  }, []);

  /** Optimize item rendering */
  const renderItem = useCallback(
    ({ item, index }: { item: Song; index: number }) => (
      <MemoizedListView
        index={index}
        item={item}
        isSelected={selectedAudioSet.has(item.audioUrl)}
        onPress={() => toggleSelectAudio(item)}
        onLongPress={handleLongPress}
      />
    ),
    [selectedAudioSet, toggleSelectAudio, handleLongPress],
  );

  /** Improve scroll performance with getItemLayout */
  const getItemLayout = useCallback(
    (_: any, index: number) => ({
      length: ITEM_HEIGHT,
      offset: ITEM_HEIGHT * index,
      index,
    }),
    [],
  );

  /** Move picked files to Vault */
  const movePickedFileToVault = useCallback(async () => {
    if (!selectedAudioSet.size) return showToast('No picked files found');
    const isExists = await RNFS.exists(audioPath);
    if (!isExists) await RNFS.mkdir(audioPath);

    try {
      const selectedArray = audioFiles.filter(audio =>
        selectedAudioSet.has(audio.audioUrl),
      );

      for (let i = 0; i < selectedArray.length; i++) {
        const file = selectedArray[i];
        const destinationPath = `${audioPath}/${file.title}`;
        await RNFS.moveFile(file.audioUrl, destinationPath);
        setProgress((i + 1) / selectedArray.length);
      }

      showToast('Files exported successfully');
      handleCancelSelection();
      setProgress(0);
    } catch (err) {
      console.error('❌ Error moving file:', err);
      showToast('Error moving file');
    }
  }, [selectedAudioSet, audioFiles, audioPath, handleCancelSelection]);

  return (
    <View style={styles.container}>
      <Header
        title={
          isSelecting ? `${selectedAudioSet.size} selected` : 'Audio Library'
        }
        leftButton={
          isSelecting && (
            <Icons.XIcon
              color={Colors.icons}
              size={ICON_SIZE}
              strokeWidth={1.2}
              onPress={handleCancelSelection}
            />
          )
        }
        rightButton={
          isSelecting && (
            <Icons.FolderCheck
              color={Colors.icons}
              size={ICON_SIZE}
              strokeWidth={1.2}
              onPress={movePickedFileToVault}
            />
          )
        }
      />
      {progress > 0 && <ProgressBar progress={progress} />}

      <FlatList
        ref={flatListRef}
        data={audioFiles}
        keyExtractor={item => item.audioUrl}
        renderItem={renderItem}
        getItemLayout={getItemLayout}
        extraData={selectedAudioSet}
        initialNumToRender={20}
        maxToRenderPerBatch={15}
        updateCellsBatchingPeriod={30}
        windowSize={10}
        removeClippedSubviews
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

export default AudioPicker;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 10,
    paddingBottom: 150,
  },
});
