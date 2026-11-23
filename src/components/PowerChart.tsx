import ReactECharts from 'echarts-for-react';
import type { ChartPoint } from '../domain/chartData';
import { formatBerlinTime } from '../domain/time';

type Props = {
    points: ChartPoint[];
};

export default function PowerChart({ points }: Props) {

    const labels = points.map((point) => formatBerlinTime(point.time));   
    const values = points.map((point) => point.powerW);                   

    const option = {
        tooltip: { trigger: 'axis' },
        grid: { left: 60, right: 20, top: 20, bottom: 40 },
        xAxis: {
            type: 'category',
            data: labels,
        },
        yAxis: {
            type: 'value',
            name: 'W',
        },
        series: [
            {
                type: 'line',
                data: values,
                showSymbol: false,
                connectNulls: false, 
            },
        ],
    };

    return <ReactECharts option={option} style={{ height: 320 }} />;
}