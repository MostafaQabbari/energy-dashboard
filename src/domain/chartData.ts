import type { BerlinDate, Reading } from '../types/devices';
import { getExpectedSlots } from './time';

export type ChartPoint = {
    time: number;          
    powerW: number | null; 
};


export function buildChartPoints(readings: Reading[], date: BerlinDate, intervalSeconds: number): ChartPoint[] {

    const powerByTime = new Map<number, number>();
    for (const reading of readings) {
        powerByTime.set(Date.parse(reading.timestamp), reading.powerW);
    }

    return getExpectedSlots(date, intervalSeconds).map((slot) => ({
        time: slot,
        powerW: powerByTime.get(slot) ?? null,
    }));
}