import type { Device, DeviceStatus } from '../types/devices';
import { getDeviceStatus } from './status';

export type StatusFilter = 'all' | DeviceStatus;
export type SortBy = 'name' | 'power';

export function filterAndSortDevices(devices: Device[], filter: StatusFilter, sortBy: SortBy, now: Date): Device[] {

    let result = devices;

    if (filter !== 'all') {
        result = result.filter((device) => getDeviceStatus(device, now) === filter);
    }

    if (sortBy === 'name') {
        result = [...result].sort((a, b) => a.name.localeCompare(b.name));
    }
    else {
        result = [...result].sort((a, b) => b.currentPowerW - a.currentPowerW); // highest first
    }

    return result;
}