export interface Device {
    id: string;
    name: string;
    type: 'inverter' | 'battery';
    currentPowerW: number;
    lastseen: string;
    fault: boolean;

}


export interface Reading {
  timestamp: string;
  powerW: number;
}

export interface DeviceReading {
  deviceId: string;
  intervalSeconds: number;
  readings: Reading[];
}



export type DeviceStatus = 'online' | 'offline' | 'fault';