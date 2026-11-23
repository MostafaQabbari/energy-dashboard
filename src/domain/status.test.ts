import { describe, it, expect } from 'vitest';
import { getDeviceStatus, OFFLINE_THRESHOLD_MS } from './status';
import type { Device } from '../types/devices';

const NOW = new Date('2026-11-03T12:00:00Z');

function makeDevice(changes: Partial<Device> = {}): Device {
    return {
        id: 'inv-01',
        name: 'Test Inverter',
        type: 'inverter',
        currentPowerW: 1000,
        lastSeen: '2026-11-03T11:58:00Z', 
        fault: false,
        ...changes,
    };
}

function msBeforeNow(ms: number): string {
    return new Date(NOW.getTime() - ms).toISOString();
}

describe('getDeviceStatus', () => {
    it('is online when seen recently', () => {
        expect(getDeviceStatus(makeDevice(), NOW)).toBe('online');
    });

    it('is still online at exactly 15 minutes', () => {
        const device = makeDevice({ lastSeen: msBeforeNow(OFFLINE_THRESHOLD_MS) });
        expect(getDeviceStatus(device, NOW)).toBe('online');
    });

    it('is offline just after 15 minutes', () => {
        const device = makeDevice({ lastSeen: msBeforeNow(OFFLINE_THRESHOLD_MS + 1000) });
        expect(getDeviceStatus(device, NOW)).toBe('offline');
    });

    it('is fault when fault is true, even if seen recently', () => {
        expect(getDeviceStatus(makeDevice({ fault: true }), NOW)).toBe('fault');
    });

    it('is fault when fault is true, even if not seen for hours', () => {
        const device = makeDevice({ fault: true, lastSeen: '2026-11-03T08:00:00Z' });
        expect(getDeviceStatus(device, NOW)).toBe('fault');
    });

    it('is offline when lastSeen is not a valid timestamp', () => {
        expect(getDeviceStatus(makeDevice({ lastSeen: 'not-a-date' }), NOW)).toBe('offline');
    });
});