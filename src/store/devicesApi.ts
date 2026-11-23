import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import type { BerlinDate, Device, DeviceReading } from '../types/devices';
import { getAllDevices, getDeviceReadings } from '../api/MockApi';

export const devicesApi = createApi({
    reducerPath: 'devicesApi',
    baseQuery: fakeBaseQuery<string>(),
    endpoints: (builder) => ({

        getDevices: builder.query<Device[], void>({
            queryFn: async () => {
                try {
                    const devices = await getAllDevices();
                    return { data: devices };
                }
                catch (error) {
                    return { error: String(error) };
                }
            },
        }),

        getReadings: builder.query<DeviceReading, { id: string; date: BerlinDate }>({
            queryFn: async ({ id, date }) => {
                try {
                    const readings = await getDeviceReadings(id, date);
                    return { data: readings };
                }
                catch (error) {
                    return { error: String(error) };
                }
            },
        }),
    }),
});

export const { useGetDevicesQuery, useGetReadingsQuery } = devicesApi;