import WireguardModule from 'wireguard-native-bridge';
import RNFS from 'react-native-fs';
import { Linking, Platform } from 'react-native';

class VpnManager {
  private static instance: VpnManager;
  private configPath: string = `${RNFS.DocumentDirectoryPath}/vpn.conf`; // Or wherever vpn.conf is stored

  private constructor() {}

  public static getInstance(): VpnManager {
    if (!VpnManager.instance) {
      VpnManager.instance = new VpnManager();
    }
    return VpnManager.instance;
  }

  public async initialize(): Promise<boolean> {
    try {
      const result = await WireguardModule.prepareVPN();
      console.log('VPN Prepared:', result);
      return true;
    } catch (error) {
      console.error('Error preparing VPN:', error);
      return false;
    }
  }

  public async getStatus(): Promise<string> {
    try {
      return await WireguardModule.getTunnelStatus();
    } catch (error) {
      console.error('Error getting VPN status:', error);
      return 'DOWN';
    }
  }

  public async connect(): Promise<boolean> {
    try {
      // 1. Read config from file
      // Note: In a real app you might want to bundle this or download it.
      // For now, assuming it's in the bundle or copied to DocumentDirectory.
      // If it's in the bundle, we might need to read it differently or pass the string directly.
      // Let's assume we pass the string directly as in the original code for now, 
      // but ideally we read from a file.
      
      // Fallback to hardcoded config if file doesn't exist (for testing/demo)
      let config = `[Interface]
Address = 192.168.6.189/32
DNS = 1.1.1.1,8.8.8.8
PrivateKey = 4DA0hacGx3NtnpWhB4k+S1pBH/De+WqXiLgRopo3Sk0=

[Peer]
PublicKey=mmSSSg1VPz8Gg7VYSgpkrYeylfAqn0m2Van+EidI11Q=
AllowedIPs = 0.0.0.0/0, ::/0
Endpoint = jp6.vpnjantit.com:1024`;

      // Try reading from file if it exists
      // const exists = await RNFS.exists(this.configPath);
      // if (exists) {
      //   config = await RNFS.readFile(this.configPath, 'utf8');
      // }

      const result = await WireguardModule.startTunnel(config);
      console.log('Tunnel started:', result);
      return true;
    } catch (error) {
      console.error('Error starting VPN:', error);
      return false;
    }
  }

  public async disconnect(): Promise<boolean> {
    try {
      await WireguardModule.stopTunnel();
      console.log('Tunnel stopped');
      return true;
    } catch (error) {
      console.error('Error stopping VPN:', error);
      return false;
    }
  }

  public openSystemSettings() {
    if (Platform.OS === 'android') {
      Linking.sendIntent('android.net.vpn.SETTINGS');
    } else {
      Linking.openSettings();
    }
  }
}

export default VpnManager.getInstance();
