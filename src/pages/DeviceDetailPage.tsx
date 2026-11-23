import { useState } from 'react';
import { Link, useParams } from 'react-router';
import { useGetReadingsQuery } from '../store/devicesApi';
import { calculateNetEnergyKwh, getCompleteness } from '../domain/energy';
import { buildChartPoints } from '../domain/chartData';
import { getBerlinToday } from '../domain/time';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import PowerChart from '../components/PowerChart';

export default function DeviceDetailPage() {

    const { id = '' } = useParams();
    const [date, setDate] = useState(() => getBerlinToday(new Date())); 


    const { currentData, error, isFetching, refetch } = useGetReadingsQuery({ id: id, date: date });

    let content;

    if (isFetching) {
        content = <Loading />;
    }
    else if (error) {
        content = <ErrorMessage message={String(error)} onRetry={refetch} />;
    }
    else if (currentData) {
        const interval = currentData.intervalSeconds;
        const energyKwh = calculateNetEnergyKwh(currentData.readings, date, interval);
        const completeness = getCompleteness(currentData.readings, date, interval);
        const points = buildChartPoints(currentData.readings, date, interval);

        content = (
            <div>
                <div className="mb-4 flex flex-wrap gap-6">
                    <p>Net energy: <strong>{energyKwh.toFixed(2)} kWh</strong></p>
                    <p>{completeness.received} of {completeness.expected} intervals received</p>
                </div>
                <PowerChart points={points} />
            </div>
        );
    }

    return (
        <div>
            <Link to="/" className="text-blue-600">← All devices</Link>
            <h2 className="my-3 text-xl font-semibold">Device {id}</h2>

            <label className="mb-4 block">
                Date{' '}
                <input
                    type="date"
                    className="rounded border p-1"
                    value={date}
                    onChange={(e) => {
                        if (e.target.value) {
                            setDate(e.target.value);
                        }
                    }}
                />
            </label>

            {content}
        </div>
    );
}