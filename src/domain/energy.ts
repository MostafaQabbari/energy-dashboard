import type { BerlinDate, Reading } from '../types/devices';
import { getExpectedSlots } from './time';


export function calculateNetEnergyKwh(readings: Reading[], date: BerlinDate, intervalSeconds: number): number {

    const expectedSlots = new Set(getExpectedSlots(date, intervalSeconds));
    const alreadyCounted = new Set<number>();
    const hoursPerInterval = intervalSeconds / 3600;

    let totalKwh = 0;

    for (const reading of readings) {
        const time = Date.parse(reading.timestamp);

        if (!expectedSlots.has(time)) {
            continue; // not part of this day
        }
        if (alreadyCounted.has(time)) {
            continue; // duplicate
        }
        alreadyCounted.add(time);

        const kwh = (reading.powerW * hoursPerInterval) / 1000;
        totalKwh = totalKwh + kwh;
    }

    return totalKwh;
}

export type Completeness = {
    received: number;
    expected: number;
};


export function getCompleteness(readings: Reading[], date: BerlinDate, intervalSeconds: number): Completeness {

    const expectedSlots = getExpectedSlots(date, intervalSeconds);
    const receivedTimes = new Set(readings.map((reading) => Date.parse(reading.timestamp)));

    let received = 0;
    for (const slot of expectedSlots) {
        if (receivedTimes.has(slot)) {
            received++;
        }
    }

    return { received: received, expected: expectedSlots.length };
}