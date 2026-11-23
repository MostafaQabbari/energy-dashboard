export type DeviceType = 'inverter' | 'battery';

export type DeviceStatus = 'online' | 'offline' | 'fault';


export type BerlinDate = string;

export interface Device {
    id: string;
    name: string;
    type: DeviceType;
    currentPowerW: number;  
    lastSeen: string;       
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