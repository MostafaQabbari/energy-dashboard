import type {Device } from '../types/devices.ts';


function getDeviceStatus(device: Device ) {

const lastseen = device.lastseen;
const msAgo = new Date().getTime() - Date.parse(lastseen);
const offlineTimeLimit = 60000 * 15;

if (device.fault === true) {
    return 'fault'
}
else if(msAgo > offlineTimeLimit) {
    return 'offline'    
}
else {
    return 'online'
} 

    
}

export { getDeviceStatus };