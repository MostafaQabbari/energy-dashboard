import { describe, it, expect, vi } from 'vitest';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter, Route, Routes } from 'react-router';
import { makeStore } from '../store/store';
import { getDeviceReadings } from '../api/MockApi';
import type { DeviceReading } from '../types/devices';
import { makeFullDay } from '../test/helpers';
import DeviceDetailPage from './DeviceDetailPage';


vi.mock('../api/MockApi', () => ({
    getAllDevices: vi.fn(),
    getDeviceReadings: vi.fn(),
}));


vi.mock('../components/PowerChart', () => ({
    default: () => <div>chart</div>,
}));

describe('DeviceDetailPage', () => {
    it('shows the last selected date, even if an older response arrives later', async () => {

        
        const answer: Record<string, (response: DeviceReading) => void> = {};
        vi.mocked(getDeviceReadings).mockImplementation((_id, date) =>
            new Promise((resolve) => {
                answer[date] = resolve;
            }),
        );

        render(
            <Provider store={makeStore()}>
                <MemoryRouter initialEntries={['/devices/inv-01']}>
                    <Routes>
                        <Route path="/devices/:id" element={<DeviceDetailPage />} />
                    </Routes>
                </MemoryRouter>
            </Provider>,
        );

        const dateInput = screen.getByLabelText(/Date/);

        
        fireEvent.change(dateInput, { target: { value: '2026-11-03' } });
        fireEvent.change(dateInput, { target: { value: '2026-11-04' } });

        
        await act(async () => {
            answer['2026-11-04']!({ deviceId: 'inv-01', intervalSeconds: 300, readings: makeFullDay('2026-11-04', 2000) });
        });
        expect(await screen.findByText('48.00 kWh')).toBeInTheDocument();

        
        await act(async () => {
            answer['2026-11-03']!({ deviceId: 'inv-01', intervalSeconds: 300, readings: makeFullDay('2026-11-03', 1000) });
        });

        
        expect(screen.getByText('48.00 kWh')).toBeInTheDocument();
        expect(screen.queryByText('24.00 kWh')).not.toBeInTheDocument();
        expect(dateInput).toHaveValue('2026-11-04');
    });
});