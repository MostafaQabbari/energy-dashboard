import { Routes, Route } from 'react-router';
import DeviceListPage from './pages/DeviceListPage';
import DeviceDetailPage from './pages/DeviceDetailPage';

export default function App() {
    return (
        <div className="mx-auto max-w-5xl p-4">
            <h1 className="mb-4 text-2xl font-bold">Energy Dashboard</h1>
            <Routes>
                <Route path="/" element={<DeviceListPage />} />
                <Route path="/devices/:id" element={<DeviceDetailPage />} />
            </Routes>
        </div>
    );
}