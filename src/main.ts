import {ButtonDef, SwitchPanel, LedStatus} from "./SwitchPanel";
import {ConfigManager} from "./ConfigManager"
import {MSFSConnector} from "./MSFSConnector";

const { vJoy, vJoyDevice } = require('vjoy');

// panel setup
const panel:SwitchPanel = new SwitchPanel();
// Configuration
const configManager = new ConfigManager();
configManager.loadConfig("testPlane");
// Connection to MSFS
const msfs = new MSFSConnector();

msfs.connect({
    retries: Infinity,
    retryInterval: 5,
    onConnect: () =>
    {
        console.log("Connected to MSFS");
        msfs.on("planeLoaded", (plane:string) =>
        {
            configManager.loadConfig(plane);
        });
    }
});

// VJOY setup
if (!vJoy.isEnabled()) {
    console.log("vJoy is not enabled.");
    process.exit();
}

let device = vJoyDevice.create(configManager.mainConfig.MAPPINGS.VJOY_NUMBER);

// TO-DO: Error handling if joy button does not exists
panel.on('buttonPressed', (button:string) =>
{
    device.buttons[configManager.mainConfig.MAPPINGS.BUTTON[button]].set(true);
    console.log("%s pressed", button);
})

panel.on('buttonReleased', (button:string) =>
{
    device.buttons[configManager.mainConfig.MAPPINGS.BUTTON[button]].set(false);
    console.log("%s released", button);
})

panel.open();
panel.clearGearLedStatus();
panel.setGearLedStatus( LedStatus.A_Yellow, false );
panel.startPolling();
