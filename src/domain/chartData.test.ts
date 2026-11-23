import { describe, it, expect } from 'vitest';
import { buildChartPoints } from './chartData';
import { makeFullDay } from '../test/helpers';

describe('buildChartPoints', () => {
    it('has one point per expected interval, with null where a reading is missing', () => {
        const readings = makeFullDay('2026-11-03', 500).filter((_, index) => index !== 10);
        const points = buildChartPoints(readings, '2026-11-03', 300);

        expect(points).toHaveLength(288);
        expect(points[10]?.powerW).toBeNull(); 
        expect(points[9]?.powerW).toBe(500);
        expect(points[11]?.powerW).toBe(500);
    });

    it('keeps 0 W as 0, not as a gap', () => {
        const readings = makeFullDay('2026-11-03', 0);
        const points = buildChartPoints(readings, '2026-11-03', 300);
        expect(points.every((point) => point.powerW === 0)).toBe(true);
    });
});