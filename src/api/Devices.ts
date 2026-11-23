import type {Device} from "../types/devices"

function minutesAgo(now: Date, minutes: number): string {
  const ms = now.getTime() - minutes * 60 * 1000;  
  const iso = new Date(ms).toISOString();          
  return iso.slice(0, 19) + 'Z';                    
}
export function getDevices(now: Date): Device[] {
  return [
    {
      id: 'inv-01',
      name: 'Inverter Roof North',
      type: 'inverter',
      currentPowerW: 8420,
      lastSeen: minutesAgo(now, 1),
      fault: false,
    },
    {
      id: 'bat-01',
      name: 'Battery Roof North',
      type: 'battery',
      currentPowerW: -2300, 
      lastSeen: minutesAgo(now, 2), 
      fault: false,
    },
    {
      id: 'inv-02',
      name: 'Inverter Roof South',
      type: 'inverter',
      currentPowerW: 0,
      lastSeen: minutesAgo(now, 3),
      fault: true, 
    },
    {
      id: 'bat-02',
      name: 'Battery Roof South',
      type: 'battery',
      currentPowerW: 0,
      lastSeen: minutesAgo(now, 95), 
      fault: true, 
    },
    {
      id: 'inv-03',
      name: 'Inverter Roof East',
      type: 'inverter',
      currentPowerW: 6150,
      lastSeen: minutesAgo(now, 5),
      fault: false,
    },
    {
      id: 'bat-03',
      name: 'Battery Roof East',
      type: 'battery',
      currentPowerW: 1850, 
      lastSeen: minutesAgo(now, 9), 
      fault: false,
    },
    {
      id: 'inv-04',
      name: 'Inverter Roof West',
      type: 'inverter',
      currentPowerW: 0,
      lastSeen: minutesAgo(now, 44), 
      fault: false,
    },
    {
      id: 'bat-04',
      name: 'Battery Roof West',
      type: 'battery',
      currentPowerW: 0,
      lastSeen: minutesAgo(now, 180), 
      fault: false,
    },
  ];
}