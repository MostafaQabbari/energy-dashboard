import { describe, it, expect } from 'vitest';
import { getExpectedSlots, getBerlinToday, formatBerlinTime } from './time';

describe('getExpectedSlots', () => {
    it('has 288 intervals on a normal winter day', () => {
        expect(getExpectedSlots('2026-11-03', 300)).toHaveLength(288);
    });

    it('has 288 intervals on a normal summer day', () => {
        expect(getExpectedSlots('2026-07-01', 300)).toHaveLength(288);
    });

    it('has 276 intervals when clocks go forward (29 March 2026)', () => {
        expect(getExpectedSlots('2026-03-29', 300)).toHaveLength(276);
    });

    it('has 300 intervals when clocks go back (25 October 2026)', () => {
        expect(getExpectedSlots('2026-10-25', 300)).toHaveLength(300);
    });

    it('starts at 00:05 and ends at 24:00 Berlin time in winter (UTC+1)', () => {
        const slots = getExpectedSlots('2026-11-03', 300);
        expect(slots[0]).toBe(Date.parse('2026-11-02T23:05:00Z'));
        expect(slots[slots.length - 1]).toBe(Date.parse('2026-11-03T23:00:00Z'));
    });

    it('starts at 00:05 and ends at 24:00 Berlin time in summer (UTC+2)', () => {
        const slots = getExpectedSlots('2026-07-01', 300);
        expect(slots[0]).toBe(Date.parse('2026-06-30T22:05:00Z'));
        expect(slots[slots.length - 1]).toBe(Date.parse('2026-07-01T22:00:00Z'));
    });

    it('has the right start and end on both daylight-saving days', () => {
        const march = getExpectedSlots('2026-03-29', 300);
        expect(march[0]).toBe(Date.parse('2026-03-28T23:05:00Z'));
        expect(march[march.length - 1]).toBe(Date.parse('2026-03-29T22:00:00Z'));

        const october = getExpectedSlots('2026-10-25', 300);
        expect(october[0]).toBe(Date.parse('2026-10-24T22:05:00Z'));
        expect(october[october.length - 1]).toBe(Date.parse('2026-10-25T23:00:00Z'));
    });

    it('has no duplicate times when 02:00-03:00 happens twice (25 October)', () => {
        const slots = getExpectedSlots('2026-10-25', 300);
        expect(new Set(slots).size).toBe(slots.length);
    });

    it('throws for an invalid date', () => {
        expect(() => getExpectedSlots('2026-13-45', 300)).toThrow();
    });
});

describe('getBerlinToday', () => {
    it('is already the next day in Berlin at 23:30 UTC in winter', () => {
        expect(getBerlinToday(new Date('2026-11-02T23:30:00Z'))).toBe('2026-11-03');
    });

    it('is the same day at midday', () => {
        expect(getBerlinToday(new Date('2026-11-03T12:00:00Z'))).toBe('2026-11-03');
    });
});

describe('formatBerlinTime', () => {
    it('adds 1 hour in winter and 2 hours in summer', () => {
        expect(formatBerlinTime('2026-11-03T10:42:10Z')).toBe('11:42');
        expect(formatBerlinTime('2026-07-01T10:42:10Z')).toBe('12:42');
    });
});