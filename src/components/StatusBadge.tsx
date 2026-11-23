import type { DeviceStatus } from '../types/devices';

const colors = {
    online: 'bg-green-100 text-green-800',
    offline: 'bg-gray-200 text-gray-700',
    fault: 'bg-red-100 text-red-800',
};

export default function StatusBadge({ status }: { status: DeviceStatus }) {
    return <span className={'rounded px-2 py-0.5 text-sm ' + colors[status]}>{status}</span>;
}