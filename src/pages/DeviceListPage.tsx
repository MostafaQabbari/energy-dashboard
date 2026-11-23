import { useState } from 'react';
import { Link } from 'react-router';
import { useGetDevicesQuery } from '../store/devicesApi';
import { filterAndSortDevices, type SortBy, type StatusFilter } from '../domain/deviceList';
import { getDeviceStatus } from '../domain/status';
import { formatKw } from '../domain/format';
import { formatBerlinTime } from '../domain/time';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import StatusBadge from '../components/StatusBadge';

export default function DeviceListPage() {

    const { data, error, isLoading, refetch  , fulfilledTimeStamp} = useGetDevicesQuery();
    const [filter, setFilter] = useState<StatusFilter>('all');
    const [sortBy, setSortBy] = useState<SortBy>('name');

    if (isLoading) {
        return <Loading />;
    }
    if (error) {
        return <ErrorMessage message={String(error)} onRetry={refetch} />;
    }
    if (!data) {
        return null;
    }

   
    const now = new Date(fulfilledTimeStamp ?? 0);
    const devices = filterAndSortDevices(data, filter, sortBy, now);

    return (
        <div>
            <div className="mb-4 flex flex-wrap gap-4">
                <label>
                    Status{' '}
                    <select className="rounded border p-1" value={filter} onChange={(e) => setFilter(e.target.value as StatusFilter)}>
                        <option value="all">All</option>
                        <option value="online">Online</option>
                        <option value="offline">Offline</option>
                        <option value="fault">Fault</option>
                    </select>
                </label>
                <label>
                    Sort by{' '}
                    <select className="rounded border p-1" value={sortBy} onChange={(e) => setSortBy(e.target.value as SortBy)}>
                        <option value="name">Name</option>
                        <option value="power">Current power</option>
                    </select>
                </label>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {devices.map((device) => (
                    <Link key={device.id} to={'/devices/' + device.id} className="block rounded border p-3 hover:bg-gray-50">
                        <div className="flex items-center justify-between">
                            <span className="font-semibold">{device.name}</span>
                            <StatusBadge status={getDeviceStatus(device, now)} />
                        </div>
                        <p className="text-sm text-gray-600">{device.type}</p>
                        <p className="mt-2 text-lg">{formatKw(device.currentPowerW)}</p>
                        <p className="text-sm text-gray-500">Last seen {formatBerlinTime(device.lastSeen, 'dd.MM. HH:mm')}</p>
                    </Link>
                ))}
            </div>

            {devices.length === 0 && <p className="text-gray-500">No devices match this filter.</p>}
        </div>
    );
}