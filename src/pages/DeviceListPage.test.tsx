import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router';
import { makeStore } from '../store/store';
import { settings } from '../api/MockApi';
import DeviceListPage from './DeviceListPage';

function renderPage() {
    render(
        <Provider store={makeStore()}>
            <MemoryRouter>
                <DeviceListPage />
            </MemoryRouter>
        </Provider>,
    );
}

describe('DeviceListPage', () => {
    beforeEach(() => {
        settings.minDelay = 0;
        settings.maxDelay = 0;
    });

    it('shows an error with a Retry button, and shows the devices after Retry', async () => {
        settings.failureRate = 1; 
        renderPage();

        expect(await screen.findByText(/Something went wrong/)).toBeInTheDocument();

        settings.failureRate = 0; 
        await userEvent.click(screen.getByRole('button', { name: 'Retry' }));

        expect(await screen.findByText('Inverter Roof North')).toBeInTheDocument();
        expect(screen.queryByText(/Something went wrong/)).not.toBeInTheDocument();
    });

    it('shows a loading state while waiting', async () => {
        settings.failureRate = 0;
        settings.minDelay = 50;
        settings.maxDelay = 50;
        renderPage();

        expect(screen.getByText('Loading...')).toBeInTheDocument();
        expect(await screen.findByText('Inverter Roof North')).toBeInTheDocument();
    });
});