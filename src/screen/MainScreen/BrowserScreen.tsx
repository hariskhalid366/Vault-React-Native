import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  BackHandler,
  Platform,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { screenWidth, useColors } from '../../utils/Constants'; // optional if you use a theme system
import Header from '../../component/Header';
import * as Icons from 'lucide-react-native';
import { goBack } from '../../utils/NavigationUtil';

const BrowserScreen = () => {
  const Colors = useColors();

  const webViewRef = useRef<WebView>(null);
  const [loading, setLoading] = useState(true);
  const [canGoBack, setCanGoBack] = useState(false);
  const [canGoForward, setCanGoForward] = useState(false);
  const [currentUrl, setCurrentUrl] = useState('https://www.google.com/');

  const onNavigationStateChange = (navState: any) => {
    setCanGoBack(navState.canGoBack);
    setCanGoForward(navState.canGoForward);
    setCurrentUrl(navState.url);
  };

  const handleForward = () => {
    if (canGoForward) {
      webViewRef.current?.goForward();
    }
  };

  const handleRefresh = () => {
    webViewRef.current?.reload();
  };

  const handleBack = useCallback(() => {
    if (canGoBack && webViewRef.current) {
      webViewRef.current.goBack();
      return true; // prevent default back behavior
    }
    return false; // allow default (exit screen/app)
  }, [canGoBack]);

  useEffect(() => {
    if (Platform.OS === 'android') {
      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        handleBack,
      );
      return () => backHandler.remove();
    }
  }, [handleBack]);

  return (
    <>
      <View style={{ flex: 1 }}>
        <Header
          title="Incognito Mode"
          leftButton={
            <Icons.ChevronLeft color={Colors.icons} size={screenWidth * 0.08} />
          }
          rightButton={
            <Icons.RefreshCcw color={Colors.icons} size={screenWidth * 0.08} />
          }
          onLeftActionPress={() => goBack()}
          onRightActionPress={() => handleRefresh()}
        />
        <WebView
          ref={webViewRef}
          source={{ uri: currentUrl }}
          style={[styles.webview, { backgroundColor: Colors.background }]}
          onLoadStart={() => setLoading(true)}
          onLoadEnd={() => setLoading(false)}
          onNavigationStateChange={onNavigationStateChange}
          incognito={true}
          cacheEnabled={false}
          javaScriptEnabled={true}
          domStorageEnabled={false}
          sharedCookiesEnabled={false}
          thirdPartyCookiesEnabled={false}
          allowsBackForwardNavigationGestures
        />

        {/* ⏳ Loading Indicator */}
        {loading && (
          <View style={styles.loader}>
            <ActivityIndicator size="large" color="#0f0" />
          </View>
        )}
      </View>

      {/* ⬅️➡️ Bottom Navigation */}
      {/* <View style={[styles.bottomNav, { backgroundColor: Colors.background }]}>
        <TouchableOpacity
          onPress={handleBack}
          disabled={!canGoBack}
          style={styles.navButton}
        >
          <Icons.ArrowLeft size={24} color={canGoBack ? Colors.text : '#555'} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleForward}
          disabled={!canGoForward}
          style={styles.navButton}
        >
          <Icons.ArrowRight
            size={24}
            color={canGoForward ? Colors.text : '#555'}
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={handleRefresh} style={styles.navButton}>
          <Icons.RefreshCw size={24} color={Colors.text} />
        </TouchableOpacity>
      </View> */}
    </>
  );
};

export default BrowserScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webview: {
    flex: 1,
  },
  loader: {
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  urlBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    marginBottom: 5,
    height: 45,
    borderRadius: 10,
    marginHorizontal: 10,
  },
  urlInput: {
    flex: 1,
    fontSize: 15,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 55,
  },
  navButton: {
    padding: 8,
  },
});
