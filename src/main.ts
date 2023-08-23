import {LibUSBException} from "usb";

var usb = require('usb');

usb.useUsbDkBackend();
console.log("Looking for usb controller");
const controller = usb.findByIds(0x09db, 0x2691);
controller.open();

if (controller) {
    console.log(controller); // Legacy device
    console.log(controller.interfaces);
/*
    controller.interfaces[0].startPoll( 0, 2, (error:LibUSBException, buffer:Buffer, len:number, cancelled:boolean) => {
       console.log(buffer.toString()); 
    });
*/
    //controller.open(true);
}