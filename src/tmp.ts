import {Device, LibUSBException} from "usb";
var usb = require('usb');


const devices = usb.getDeviceList();

/*
for (const device of devices) 
{
    tryOpenDevice(device);
}
*/

const bmRequestType = 0x00; // Control transfer type: OUT, Vendor-specific request, Device-to-host
const bRequest = 0x01; // Vendor-specific request code
const wValue = 0x0000; // Custom value (could be used for specific purposes)
const wIndex = 0x0000; // Custom index (could be used for specific purposes)
const timeout = 5000; // Timeout in milliseconds



const device = usb.findByIds(0x06a3, 0x0d67);
device.open();
console.log(device.interfaces);
const iFace = device.interface(0);
console.log(iFace.endpoints);
//const endpoint = iFace.endpoint(1); // Sostituisci con il numero dell'endpoint corretto
const endpoint = iFace.endpoints[0];

iFace.claim();
// Set up the bulk transfer
const bufferSize = 3; // Number of bytes to read
endpoint.on("data", (data:any) =>
{
    console.log(data);
});

endpoint.on( "end",  () =>
{
    console.log("poling ended");
});
endpoint.startPoll(3, bufferSize);

device.controlTransfer(
    bmRequestType,
    bRequest,
    wValue,
    wIndex,
    Buffer.alloc(1), // No data to send in this example
    (error:LibUSBException, data:any) => {
        if (error) {
            console.error('Error during control transfer:', error);
        } else {
            console.log('Control message sent successfully.');
            // Process the received data if applicable
        }

        // Close the USB device after the control transfer
        //device.close();
    }
);