import type { BerlinDate } from "../types/devices";
import { DateTime } from 'luxon';

export const BERLIN_ZONE = 'Europe/Berlin';



export function getBerlinDayStart(date: BerlinDate): DateTime {

    const dayStart = DateTime.fromISO(date, { zone: BERLIN_ZONE });
    if (!dayStart.isValid) {
        throw new Error('Invalid date: ' + date);
    }
    return dayStart;
}



export function getBerlinDayEnd(dayStart: DateTime): DateTime {

    return dayStart.plus({ days: 1 });
}


export function addInterval(time: DateTime, intervalSeconds: number): DateTime {

    return time.plus({ seconds: intervalSeconds });
}



export function getExpectedSlots(date: BerlinDate, intervalSeconds: number): number[] {

    const dayStart = getBerlinDayStart(date);
    const dayEnd = getBerlinDayEnd(dayStart);
    const slots: number[] = [];

    let time = addInterval(dayStart, intervalSeconds);

    while (time <= dayEnd) {
        slots.push(time.toMillis());
        time = addInterval(time, intervalSeconds);
    }

    return slots;
}



export function toUtcIso(time: DateTime): string {

    const timeStamp = time.toUTC().toISO({ suppressMilliseconds: true });
    if (timeStamp === null) {
        throw new Error('Invalid time');
    }
    return timeStamp;
}



export function utcToBerlin(timeStamp: string): DateTime {

    return DateTime.fromISO(timeStamp, { zone: 'utc' }).setZone(BERLIN_ZONE);
}



export function getBerlinToday(now: Date): BerlinDate {

    const today = DateTime.fromJSDate(now).setZone(BERLIN_ZONE).toISODate();
    if (today === null) {
        throw new Error('Invalid date');
    }
    return today;
}


export function formatBerlinTime(time: string | number, format: string = 'HH:mm'): string {

    if (typeof time === 'number') {
        return DateTime.fromMillis(time, { zone: BERLIN_ZONE }).toFormat(format);
    }
    return utcToBerlin(time).toFormat(format);
}