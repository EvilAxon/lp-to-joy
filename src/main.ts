import {ButtonDef, SwitchPanel, LedStatus} from "./SwitchPanel";

const flatconfig = require("flatconfig");
const { vJoy, vJoyDevice } = require('vjoy');

var defaults = {
    MAPPINGS: {
        VJOY_NUMBER: 1,
        BUTTON: {
            BAT: 1,
            ALT: 2,
            AVIONICS: 3,
            FUEL: 4,
            DEICE: 5,
            PILOT: 6,
            COWL: 7,
            PANEL: 8,
            // Byte 1
            BEACON: 9,
            NAV: 10,
            STROBE: 11,
            TAXI: 12,
            LANDING: 13,
            MAG_OFF: 14,
            MAG_R: 15,
            MAG_L: 16,
            // Byte 2
            MAG_BOTH: 17,
            MAG_START: 18,
            GEAR_UP: 19,
            GEAR_DOWN: 20       
        }
    }
}
    
// read configuration
// TO-DO: Error handling
var config = flatconfig.load(defaults,process.cwd()+"/conf.ini");

// panel setup
const panel:SwitchPanel = new SwitchPanel();
// MSFS Simconnect
//const msfs = new MSFS_API();


// VJOY setup
if (!vJoy.isEnabled()) {
    console.log("vJoy is not enabled.");
    process.exit();
}

let device = vJoyDevice.create(config.MAPPINGS.VJOY_NUMBER);

// TO-DO: Error handling if joy button does not exists
panel.on('buttonPressed', (button:string) =>
{
    device.buttons[config.MAPPINGS.BUTTON[button]].set(true);
    console.log("%s pressed", button);
})

panel.on('buttonReleased', (button:string) =>
{
    device.buttons[config.MAPPINGS.BUTTON[button]].set(false);
    console.log("%s released", button);
})

panel.open();
panel.clearGearLedStatus();
panel.setGearLedStatus( LedStatus.A_Yellow, false );
panel.startPolling();