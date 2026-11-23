import { configureStore } from '@reduxjs/toolkit';
import { devicesApi } from './devicesApi';


export function makeStore() {
    return configureStore({
        reducer: {
            [devicesApi.reducerPath]: devicesApi.reducer,
        },
        middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(devicesApi.middleware),
    });
}

export const store = makeStore();