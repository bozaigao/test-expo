/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react-native/no-inline-styles */
import React, { useState, useEffect } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View, Alert } from 'react-native';

import TestConsole from './TestConsole';

import { Pushy, PushyProvider, usePushy } from 'react-native-update';
import _updateConfig from './update.json';
const {appKey} = _updateConfig.ios;

function Home() {
  const {
    client,
    checkUpdate,
    downloadUpdate,
    switchVersionLater,
    switchVersion,
    updateInfo,
    packageVersion,
    currentHash,
    progress: {received, total} = {},
  } = usePushy();
  const [useDefaultAlert, setUseDefaultAlert] = useState(false);
  const [showTestConsole, setShowTestConsole] = useState(false);
  const [showUpdateBanner, setShowUpdateBanner] = useState(false);
  const [showUpdateSnackbar, setShowUpdateSnackbar] = useState(false);
  const [currentOrientation, setCurrentOrientation] = useState<string>('未知');
  // if (updateInfo) {
  //   updateInfo!.name = 'name';
  //   updateInfo!.update = true;
  // }
  const snackbarVisible =
    !useDefaultAlert && showUpdateSnackbar && updateInfo?.update;

  if (showTestConsole) {
    return (
      <TestConsole visible={true} onClose={() => setShowTestConsole(false)} />
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.welcome}>欢迎使用Pushy热更新服务</Text>
      {/* <Text style={styles.welcome}>😁热更新成功</Text> */}
      {/* 原有的热更新功能 */}
      <View style={{flexDirection: 'row'}}>
        <TouchableOpacity
          onPress={() => {
            client?.setOptions({
              updateStrategy: !useDefaultAlert ? null : 'alwaysAlert',
            });
            setShowUpdateSnackbar(useDefaultAlert);
            setUseDefaultAlert(!useDefaultAlert);
          }}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <View
            style={{
              width: 20,
              height: 20,
              borderWidth: 1,
              borderColor: '#999',
              backgroundColor: useDefaultAlert ? 'blue' : 'white',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            {useDefaultAlert && <Text style={{color: 'white'}}>✓</Text>}
          </View>
          <Text style={{marginLeft: 8}}>
            {' '}
            {useDefaultAlert ? '当前使用' : '当前不使用'}默认的alert更新提示
          </Text>
        </TouchableOpacity>
      </View>
      <Image
        resizeMode={'contain'}
        source={require('./assets/images/shezhi.png')}
        style={styles.image}
      />
      <Text style={styles.instructions}>
        这是版本一 {'\n'}
        当前原生包版本号: {packageVersion}
        {'\n'}
        当前热更新版本Hash: {currentHash || '(空)'}
        {'\n'}
      </Text>
      <Text>
        下载进度：{received} / {total}
      </Text>
      <TouchableOpacity
        onPress={() => {
          checkUpdate();
          setShowUpdateSnackbar(true);
        }}>
        <Text style={styles.instructions}>点击这里检查更新</Text>
      </TouchableOpacity>

      <TouchableOpacity
        testID="testcase"
        style={{marginTop: 15}}
        onPress={() => {
          setShowTestConsole(true);
        }}>
        <Text style={styles.instructions}>
          react-native-update版本：{client?.version}
        </Text>
      </TouchableOpacity>
      {snackbarVisible && (
        <View style={styles.overlay}>
          <View
            style={{
              width: '100%',
              backgroundColor: '#333',
              padding: 16,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <Text style={{color: 'white'}}>
              有新版本({updateInfo.name})可用，是否更新？
            </Text>
            <View style={{flexDirection: 'row'}}>
              <TouchableOpacity
                onPress={() => setShowUpdateSnackbar(false)}
                style={{marginRight: 10}}>
                <Text style={{color: 'white'}}>取消</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={async () => {
                  setShowUpdateSnackbar(false);
                  await downloadUpdate();
                  setShowUpdateBanner(true);
                }}>
                <Text style={{color: '#2196F3'}}>更新</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
      {showUpdateBanner && (
        <View style={styles.overlay}>
          <View
            style={{
              width: '100%',
              backgroundColor: '#fff',
              padding: 16,
              borderBottomWidth: 1,
              borderBottomColor: '#eee',
            }}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text>更新已完成，是否立即重启？</Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-end',
                marginTop: 10,
              }}>
              <TouchableOpacity
                onPress={() => {
                  switchVersionLater();
                  setShowUpdateBanner(false);
                }}
                style={{marginRight: 20}}>
                <Text style={{color: '#2196F3'}}>下次再说</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={switchVersion}>
                <Text style={{color: '#2196F3'}}>立即重启</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  image: {},
  orientationSection: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    width: '90%',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  orientationText: {
    fontSize: 16,
    marginBottom: 15,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 10,
  },
  orientationButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});

const pushyClient = new Pushy({
  appKey,
  debug: true,
});

export default function HomeScreen() {
  return (
    <PushyProvider client={pushyClient}>
      <Home />
    </PushyProvider>
  );
}