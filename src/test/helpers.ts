import { DateTime } from 'luxon';
import type { Reading } from '../types/devices';
import { getExpectedSlots, toUtcIso } from '../domain/time';


export function makeFullDay(date: string, powerW: number, intervalSeconds = 300): Reading[] {
    return getExpectedSlots(date, intervalSeconds).map((slot) => ({
        timestamp: toUtcIso(DateTime.fromMillis(slot)),
        powerW: powerW,
    }));
}