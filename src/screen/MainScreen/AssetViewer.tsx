import React, { useRef, useState, useEffect } from 'react';
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import { FasterImageView } from '@rraut/react-native-faster-image';
import Animated, { SlideInUp, SlideOutUp } from 'react-native-reanimated';
import * as Icons from 'lucide-react-native';
import Header from '../../component/Header';
import { screenWidth, useColors } from '../../utils/Constants';
import Video from 'react-native-video';

const ICON_SIZE = screenWidth * 0.08;
const SIZE = screenWidth * 0.15;

const AssetViewer = ({ route }: any) => {
  const { data, selectedIndex } = route.params;
  const Colors = useColors();

  const [tapped, setTapped] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(selectedIndex);
  const [playingIndex, setPlayingIndex] = useState<number | null>(null); // 👈 track which video is playing

  const topRef = useRef<FlatList>(null);
  const thumbRef = useRef<FlatList>(null);

  useEffect(() => {
    if (data.length > 0) {
      topRef.current?.scrollToIndex({
        index: selectedIndex,
        animated: false,
      });
      thumbRef.current?.scrollToIndex({
        index: selectedIndex,
        animated: false,
        viewPosition: 0.5,
      });
    }
  }, [selectedIndex, data]);

  // Auto-hide header
  useEffect(() => {
    if (tapped) {
      const timer = setTimeout(() => setTapped(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [tapped]);

  const handleScrollEnd = (e: any) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / screenWidth);
    setCurrentIndex(index);
    setPlayingIndex(null); // 👈 stop playing when user scrolls
    thumbRef.current?.scrollToIndex({
      index,
      animated: true,
      viewPosition: 0.5,
    });
  };

  const handleThumbnailPress = (index: number) => {
    setCurrentIndex(index);
    setPlayingIndex(null); // 👈 stop playback when thumbnail changes
    topRef.current?.scrollToIndex({ index, animated: true });
    thumbRef.current?.scrollToIndex({
      index,
      animated: true,
      viewPosition: 0.5,
    });
  };

  const handleVideoPress = (index: number) => {
    // 👇 toggle play/pause
    setPlayingIndex(prev => (prev === index ? null : index));
  };

  return (
    <View style={[styles.container, { backgroundColor: Colors.background }]}>
      {tapped && (
        <Animated.View
          entering={SlideInUp.duration(200).damping(10)}
          exiting={SlideOutUp.duration(200).damping(10)}
          style={styles.headerContainer}
        >
          <Header
            background={Colors.background}
            leftButton={
              <Icons.ChevronLeft size={ICON_SIZE} color={Colors.icons} />
            }
          />
        </Animated.View>
      )}

      {/* Fullscreen viewer */}
      <FlatList
        ref={topRef}
        data={data}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(_, index) => index.toString()}
        onMomentumScrollEnd={handleScrollEnd}
        getItemLayout={(_, index) => ({
          length: screenWidth,
          offset: screenWidth * index,
          index,
        })}
        renderItem={({ item, index }) => {
          const isVideo = item.name.toLowerCase().includes('mp4');
          const isPlaying = playingIndex === index;

          return (
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => {
                setTapped(!tapped);
                if (isVideo) handleVideoPress(index); // 👈 toggle play/pause
              }}
              style={styles.fullImageWrapper}
            >
              {isVideo ? (
                <>
                  <Video
                    style={styles.fullImage}
                    paused={!isPlaying}
                    controls={isPlaying}
                    resizeMode="contain"
                    playInBackground={false}
                    preventsDisplaySleepDuringVideoPlayback={true}
                    source={{ uri: `file://${item.path}` }}
                  />
                  {!isPlaying && (
                    <View style={styles.centerPlayIcon}>
                      <Icons.Play size={40} color="#fff" />
                    </View>
                  )}
                </>
              ) : (
                <FasterImageView
                  source={{ uri: `file://${item.path}` }}
                  style={styles.fullImage}
                />
              )}
            </TouchableOpacity>
          );
        }}
      />

      {/* Thumbnails */}
      <View
        style={[
          styles.thumbnailContainer,
          { backgroundColor: Colors.background },
        ]}
      >
        <FlatList
          ref={thumbRef}
          horizontal
          data={data}
          keyExtractor={(_, index) => index.toString()}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.thumbListContent}
          getItemLayout={(_, index) => ({
            length: SIZE + 10,
            offset: (SIZE + 10) * index,
            index,
          })}
          renderItem={({ item, index }) => {
            const isActive = index === currentIndex;
            const showOverlay = item.name.toLowerCase().includes('mp4');

            return (
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => handleThumbnailPress(index)}
                style={[
                  styles.thumbnailWrapper,
                  isActive && { borderColor: Colors.primary, borderWidth: 2 },
                ]}
              >
                {showOverlay && (
                  <View style={styles.overlay}>
                    <Icons.PlayIcon
                      size={ICON_SIZE}
                      strokeWidth={1.2}
                      color="#fff"
                    />
                  </View>
                )}
                <FasterImageView
                  source={{ uri: `file://${item.path}` }}
                  style={styles.thumbnail}
                />
              </TouchableOpacity>
            );
          }}
        />
      </View>
    </View>
  );
};

export default AssetViewer;

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerContainer: {
    position: 'absolute',
    top: 0,
    zIndex: 2,
    width: '100%',
  },
  fullImageWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullImage: {
    width: screenWidth,
    height: '100%',
    resizeMode: 'contain',
  },
  centerPlayIcon: {
    position: 'absolute',
    alignSelf: 'center',

    backgroundColor: '#00000022',
    borderRadius: 100,
    padding: 20,
  },
  thumbnailContainer: {
    paddingVertical: 15,
    backgroundColor: 'rgba(0,0,0,0.8)',
  },
  thumbListContent: { paddingHorizontal: 10 },
  thumbnailWrapper: {
    width: SIZE,
    height: SIZE,
    borderRadius: 15,
    marginRight: 10,
  },
  thumbnail: {
    width: '100%',
    height: '100%',
    borderRadius: 15,
    resizeMode: 'cover',

    overflow: 'hidden',
  },
  overlay: {
    position: 'absolute',
    zIndex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    borderRadius: 15,
    backgroundColor: '#00000066',
  },
});
