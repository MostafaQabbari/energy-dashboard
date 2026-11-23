import { describe, it, expect } from 'vitest';
import { calculateNetEnergyKwh, getCompleteness } from './energy';
import { makeFullDay } from '../test/helpers';

const INTERVAL = 300;

describe('calculateNetEnergyKwh', () => {
    it('is 24 kWh for 1000 W during a full normal day', () => {
        const readings = makeFullDay('2026-11-03', 1000);
        expect(calculateNetEnergyKwh(readings, '2026-11-03', INTERVAL)).toBeCloseTo(24, 6);
    });

    it('does not count missing readings (no data is not zero, and not guessed)', () => {
        const readings = makeFullDay('2026-11-03', 1000).slice(18); 
        expect(calculateNetEnergyKwh(readings, '2026-11-03', INTERVAL)).toBeCloseTo(22.5, 6);
    });

    it('subtracts negative power (battery charging)', () => {
        const day = makeFullDay('2026-11-03', 1000);
        const readings = day.map((reading, index) => ({
            ...reading,
            powerW: index < 144 ? 1000 : -1000, 
        }));
        expect(calculateNetEnergyKwh(readings, '2026-11-03', INTERVAL)).toBeCloseTo(0, 6);
    });

    it('is 23 kWh on the short daylight-saving day (29 March 2026)', () => {
        const readings = makeFullDay('2026-03-29', 1000);
        expect(calculateNetEnergyKwh(readings, '2026-03-29', INTERVAL)).toBeCloseTo(23, 6);
    });

    it('is 25 kWh on the long daylight-saving day (25 October 2026)', () => {
        const readings = makeFullDay('2026-10-25', 1000);
        expect(calculateNetEnergyKwh(readings, '2026-10-25', INTERVAL)).toBeCloseTo(25, 6);
    });

    it('ignores readings from another day and duplicates', () => {
        const readings = [
            ...makeFullDay('2026-11-03', 1000),
            { timestamp: '2026-11-03T23:05:00Z', powerW: 99999 }, 
            { timestamp: '2026-11-02T23:05:00Z', powerW: 99999 }, 
        ];
        expect(calculateNetEnergyKwh(readings, '2026-11-03', INTERVAL)).toBeCloseTo(24, 6);
    });

    it('is 0 when there are no readings', () => {
        expect(calculateNetEnergyKwh([], '2026-11-03', INTERVAL)).toBe(0);
    });
});

describe('getCompleteness', () => {
    it('is 288 of 288 for a full normal day', () => {
        expect(getCompleteness(makeFullDay('2026-11-03', 1000), '2026-11-03', INTERVAL))
            .toEqual({ received: 288, expected: 288 });
    });

    it('counts gaps, including one at the very start of the day', () => {
        const readings = makeFullDay('2026-11-03', 1000).filter((_, index) => index !== 0 && index !== 100);
        expect(getCompleteness(readings, '2026-11-03', INTERVAL)).toEqual({ received: 286, expected: 288 });
    });

    it('expects 276 and 300 intervals on the daylight-saving days', () => {
        expect(getCompleteness([], '2026-03-29', INTERVAL)).toEqual({ received: 0, expected: 276 });
        expect(getCompleteness([], '2026-10-25', INTERVAL)).toEqual({ received: 0, expected: 300 });
    });

    it('matches timestamps written with milliseconds too', () => {
        const readings = [{ timestamp: '2026-11-02T23:05:00.000Z', powerW: 1 }];
        expect(getCompleteness(readings, '2026-11-03', INTERVAL).received).toBe(1);
    });
});