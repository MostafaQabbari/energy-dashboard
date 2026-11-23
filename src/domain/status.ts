import type { Device, DeviceStatus } from '../types/devices';

export const OFFLINE_THRESHOLD_MS = 15 * 60 * 1000; 

export function getDeviceStatus(device: Device, now: Date): DeviceStatus {

    if (device.fault) {
        return 'fault';
    }

    const lastSeenMs = Date.parse(device.lastSeen);
    if (Number.isNaN(lastSeenMs)) {
        return 'offline'; 
    }

    const msAgo = now.getTime() - lastSeenMs;
    if (msAgo > OFFLINE_THRESHOLD_MS) {
        return 'offline';
    }

    return 'online';
}