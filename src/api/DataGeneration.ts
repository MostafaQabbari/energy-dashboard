import type { BerlinDate, Device, DeviceReading } from "../types/devices";
import { DateTime } from 'luxon';
import { getExpectedSlots, toUtcIso } from '../domain/time';

const intervalMinutes = 5;
const gapChance = 0.05; 

function randomBetween(min: number, max: number): number {
    return min + Math.random() * (max - min);
}

function getPower(device: Device): number {
    if (device.type === 'inverter') {
        return Math.round(randomBetween(0, 10000));     
    }
    else {
        return Math.round(randomBetween(-5000, 5000));  
    }
}

export function generateData(device: Device, date: BerlinDate): DeviceReading {

    const intervalSeconds = intervalMinutes * 60;

    const generatedData: DeviceReading = {
        deviceId: device.id,
        intervalSeconds: intervalSeconds,
        readings: [],
    };

    for (const slot of getExpectedSlots(date, intervalSeconds)) {
        if (Math.random() >= gapChance) {
            const timeStamp = toUtcIso(DateTime.fromMillis(slot));
            generatedData.readings.push({ timestamp: timeStamp, powerW: getPower(device) });
        }
    }

    return generatedData;
}

