import { StyleSheet, View } from 'react-native';
import React, { memo, useCallback, useEffect, useState } from 'react';
import { Album, CameraRoll } from '@react-native-camera-roll/camera-roll';
import Header from '../../component/Header';
import { AssetItem } from '../../component/AssetItem';
import { useIsFocused } from '@react-navigation/native';
import Loading from '../../component/Loading';
import { navigate } from '../../utils/NavigationUtil';

const CameraRolls = () => {
  const isFocused = useIsFocused();
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(false);

  const loadAlbums = useCallback(async () => {
    try {
      setLoading(true);
      const albumList = await CameraRoll.getAlbums({
        assetType: 'All',
        albumType: 'SmartAlbum',
      });
      const albumsWithFirstImage = await Promise.all(
        albumList.map(async album => {
          const photos = await CameraRoll.getPhotos({
            first: 1,
            groupName: album.title,
            assetType: 'All',
          });
          return {
            ...album,
            uri: photos.edges[0]?.node.image.uri,
          };
        }),
      );

      setAlbums(albumsWithFirstImage);
      setLoading(false);
    } catch (error) {
      console.log('Error loading albums', error);
    }
  }, []);

  useEffect(() => {
    loadAlbums();
  }, [isFocused]);

  const handleAlbumPress = async (name: string) => {
    navigate('asset', { name: name, isAlbum: true });
  };

  return (
    <>
      {loading && <Loading />}
      <View style={styles.container}>
        <Header title="Assets Picker" />
        <View style={styles.mainContainer}>
          {albums.map((item, index) => (
            <AssetItem
              key={index}
              item={item}
              index={index}
              onPress={() => {
                handleAlbumPress(item.title);
              }}
            />
          ))}
        </View>
      </View>
    </>
  );
};

export default memo(CameraRolls);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
  },
  mainContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});
