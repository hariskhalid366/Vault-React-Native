import React, { useEffect, useState, useCallback } from 'react';
import {
  Alert,
  StyleSheet,
  Switch,
  Text,
  View,
  ActivityIndicator,
} from 'react-native';
import Header from '../../component/Header';
import CustomText from '../../component/CustomText';
import { useColors } from '../../utils/Constants';
import { storage } from '../../db/mmkv';
import { useMMKVBoolean, useMMKVObject } from 'react-native-mmkv';
import { navigate } from '../../utils/NavigationUtil';
import WireguardModule, { AppInfo } from 'wireguard-native-bridge';

const SETTINGS_ITEMS = [
  { title: 'VPN Proxy', type: 'Vpn' },
  { title: 'Default Theme', type: 'Theme' },
  { title: 'Enable Backup', type: 'Backup' },
  { title: 'Enable Biometric', type: 'Biometric' },
  {
    title: 'Lock Duration',
    type: 'Lock',
    dropdown: true,
    drop: ['3sec', '5sec', 'never'],
  },
];

const SettingScreen = () => {
  const [user] = useMMKVObject<{ skip: boolean }>('UserData', storage);
  const Colors = useColors();
  const [loading, setLoading] = useState(false);
  const [tunnelStatus, setTunnelStatus] = useState<string>('DOWN');
  const [installedApps, setInstalledApps] = useState<AppInfo[]>([]);
  const [vpnStatus, setVpnStatus] = useState<'connected' | 'disconnected'>(
    'disconnected',
  );
  const [biometricEnabled, setBiometricEnabled] = useMMKVBoolean(
    'biometric',
    storage,
  );
  const [darkThemeEnabled, setDarkThemeEnabled] = useMMKVBoolean(
    'darkheme',
    storage,
  );
  const [backupEnabled, setBackupEnabled] = useMMKVBoolean('backup', storage);

  const config = `[Interface]
  Address = 192.168.6.189/32
  DNS = 1.1.1.1,8.8.8.8
  PrivateKey = 4DA0hacGx3NtnpWhB4k+S1pBH/De+WqXiLgRopo3Sk0=
  
[Peer]
  PublicKey=mmSSSg1VPz8Gg7VYSgpkrYeylfAqn0m2Van+EidI11Q=
  AllowedIPs = 0.0.0.0/0, ::/0
  Endpoint = jp6.vpnjantit.com:1024`;

  useEffect(() => {
    const initVPN = async () => {
      try {
        const preparationResult = await WireguardModule.prepareVPN();
        console.log('VPN Prepared:', preparationResult);

        const status = await WireguardModule.getTunnelStatus();
        setTunnelStatus(status);
      } catch (error) {
        console.error('Error preparing VPN:', error);
      }
    };

    initVPN();
  }, []);

  const startVPN = async () => {
    try {
      const configString = config;
      const result = await WireguardModule.startTunnel(configString);
      console.log('Tunnel started:', result);

      const status = await WireguardModule.getTunnelStatus();
      setTunnelStatus(status);
    } catch (error) {
      console.error('Error starting VPN:', error);
    }
  };

  const stopVPN = async () => {
    try {
      await WireguardModule.stopTunnel();
      setTunnelStatus('DOWN');
      console.log('Tunnel stopped');
    } catch (error) {
      console.error('Error stopping VPN:', error);
    }
  };

  const handleSwitchChange = useCallback(
    async (type: string, value: boolean) => {
      if (type === 'Vpn') {
        if (value === true) {
          await startVPN();
        } else {
          await stopVPN();
        }
      } else if (type === 'Theme') {
        setDarkThemeEnabled(value);
      } else if (type === 'Biometric') {
        setBiometricEnabled(value);
      } else if (type === 'Backup') {
        if (user?.skip === false) {
          setBackupEnabled(value);
        } else {
          navigate('signin');
        }
      }
    },
    [
      startVPN,
      stopVPN,
      setDarkThemeEnabled,
      setBiometricEnabled,
      setBackupEnabled,
      user?.skip,
    ],
  );

  const getSwitchValue = useCallback(
    (type: string): boolean => {
      switch (type) {
        case 'Vpn':
          return vpnStatus === 'connected';
        case 'Theme':
          return darkThemeEnabled === undefined ? false : darkThemeEnabled;
        case 'Backup':
          return backupEnabled === undefined ? false : backupEnabled;
        case 'Biometric':
          return biometricEnabled === undefined ? false : biometricEnabled;
        case 'Lock':
          return biometricEnabled === undefined ? false : biometricEnabled;
        default:
          return false;
      }
    },
    [vpnStatus, darkThemeEnabled, backupEnabled, biometricEnabled],
  );

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      <Header title="Settings" />
      <View style={{ flex: 1, padding: 20 }}>
        {SETTINGS_ITEMS.map((item, index) => (
          <View key={index} style={styles.row}>
            <CustomText fontFamily="Okra-Medium" fontSize={14}>
              {item.title}
            </CustomText>
            <View
              style={[styles.switchContainer, { borderColor: Colors.icons }]}
            >
              <Switch
                value={getSwitchValue(item.type)}
                onValueChange={value => handleSwitchChange(item.type, value)}
                thumbColor={Colors.icons}
                trackColor={{
                  false: Colors.lockButton,
                  true: Colors.lockButton,
                }}
                disabled={item.type === 'Vpn' && loading}
              />
            </View>
          </View>
        ))}
        <View style={styles.statusContainer}>
          <Text
            style={{
              color:
                vpnStatus === 'connected'
                  ? Colors.primary
                  : Colors.primary_light,
              fontSize: 16,
              fontWeight: '600',
            }}
          >
            VPN Status: {vpnStatus.toUpperCase()}
          </Text>
          {loading && <ActivityIndicator size="small" color={Colors.icons} />}
        </View>
      </View>
    </View>
  );
};

export default SettingScreen;

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
  },
  switchContainer: {
    borderRadius: 20,
    padding: 2,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    alignSelf: 'center',
    marginTop: 20,
  },
});
