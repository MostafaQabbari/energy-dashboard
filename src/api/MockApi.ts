import type { BerlinDate, Device, DeviceReading } from "../types/devices";
import { getDevices } from "./Devices";
import { generateData } from "./DataGeneration";

export const settings = {
    minDelay: 300,
    maxDelay: 1200,
    failureRate: 0.2,
};

function wait(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fakeNetwork() {
    const delay = settings.minDelay + Math.random() * (settings.maxDelay - settings.minDelay);
    await wait(delay);

    if (Math.random() < settings.failureRate) {
        throw new Error('Network error');
    }
}


export async function getAllDevices(): Promise<Device[]> {
    await fakeNetwork();
    return getDevices(new Date());
}


export async function getDeviceReadings(id: string, date: BerlinDate): Promise<DeviceReading> {
    await fakeNetwork();

    const device = getDevices(new Date()).find((d) => d.id === id);

    if (device === undefined) {
        throw new Error('Device not found: ' + id);
    }

    return generateData(device, date);
}