import { describe, it, expect } from 'vitest';
import { filterAndSortDevices } from './deviceList';
import { getDevices } from '../api/Devices';

const NOW = new Date('2026-11-03T12:00:00Z');
const devices = getDevices(NOW);

describe('filterAndSortDevices', () => {
    it('keeps only devices with the chosen status', () => {
        const result = filterAndSortDevices(devices, 'offline', 'name', NOW);
        expect(result.map((d) => d.id).sort()).toEqual(['bat-04', 'inv-04']);
    });

    it('sorts by name A to Z', () => {
        const names = filterAndSortDevices(devices, 'all', 'name', NOW).map((d) => d.name);
        expect(names).toEqual([...names].sort((a, b) => a.localeCompare(b)));
    });

    it('sorts by current power, highest first', () => {
        const powers = filterAndSortDevices(devices, 'all', 'power', NOW).map((d) => d.currentPowerW);
        expect(powers).toEqual([...powers].sort((a, b) => b - a));
    });
});