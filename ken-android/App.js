import React, { useEffect, useState, useRef } from 'react';
import { StatusBar, BackHandler, Platform, StyleSheet, View, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import { Asset } from 'expo-asset';

export default function App() {
  const [htmlUri, setHtmlUri] = useState(null);
  const webviewRef = useRef(null);

  // アプリ内に同梱した app.html を読み込む
  useEffect(() => {
    (async () => {
      const asset = Asset.fromModule(require('./assets/app.html'));
      await asset.downloadAsync();
      setHtmlUri(asset.localUri || asset.uri);
    })();
  }, []);

  // Android の戻るボタンで WebView 内を戻る
  useEffect(() => {
    if (Platform.OS !== 'android') return;
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      if (webviewRef.current) {
        webviewRef.current.goBack();
        return true;
      }
      return false;
    });
    return () => sub.remove();
  }, []);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <StatusBar barStyle="dark-content" backgroundColor="#f7f8f3" />
        {htmlUri ? (
          <WebView
            ref={webviewRef}
            source={{ uri: htmlUri }}
            originWhitelist={['*']}
            javaScriptEnabled
            domStorageEnabled            // localStorage を有効化（データ保存に必須）
            allowFileAccess
            allowFileAccessFromFileURLs
            allowUniversalAccessFromFileURLs  // file:// から Netlify Functions へ fetch するために必要
            mixedContentMode="always"
            setSupportMultipleWindows={false}
            style={styles.webview}
          />
        ) : (
          <View style={styles.loading}>
            <ActivityIndicator size="large" color="#97C459" />
          </View>
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f7f8f3' },
  webview: { flex: 1, backgroundColor: '#f7f8f3' },
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
