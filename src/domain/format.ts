
export function formatKw(powerW: number): string {
    return (powerW / 1000).toFixed(1) + ' kW';
}