import {Device, LibUSBException} from "usb";

var usb = require('usb');


const devices = usb.getDeviceList();

/*
for (const device of devices) 
{
    tryOpenDevice(device);
}
*/

const device = usb.findByIds(0x048d, 0x5702);
device.open();
console.log(device.interfaces);
const iFace = device.interface(0);
console.log(iFace.endpoints);
const endpoint = iFace.endpoint(129); // Sostituisci con il numero dell'endpoint corretto

// Dati da inviare (in formato byte)
const dataToSend = Buffer.from([0x01, 0x02, 0x03]);

// Invia i dati all'endpoint
endpoint.transfer( 1, (error:LibUSBException, data:any) => {
    if (error) {
        console.error('Errore durante il trasferimento:', error);
    } else {
        console.log(data);
    }
    device.close();
});

function tryOpenDevice( device: Device ):void 
{
    try 
    {
        device.open();
        console.log("Succesfully opened 0x%s-0x%s", device.deviceDescriptor.idVendor.toString(16), device.deviceDescriptor.idProduct.toString(16));
        device.close();
    }
    catch( exc:any )
    {
        console.log( "could not open device: %s ", exc.message );
    }
}