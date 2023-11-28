"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SwitchPanel_1 = require("./SwitchPanel");
const ConfigManager_1 = require("./ConfigManager");
const MSFSConnector_1 = require("./MSFSConnector");
const { vJoy, vJoyDevice } = require('vjoy');
// panel setup
const panel = new SwitchPanel_1.SwitchPanel();
// Configuration
const configManager = new ConfigManager_1.ConfigManager();
configManager.loadConfig("testPlane");
console.log(configManager.mainConfig);
console.log(configManager.planeConfig);
// Connection to MSFS
const msfs = new MSFSConnector_1.MSFSConnector();
//const mfh = new MobiflightHandler();
//mfh.startMobiflightWithConfiguration("C:\\Users\\aXon\\AppData\\Local\\MobiFlight\\MobiFlight Connector", "C:\\Users\\aXon\\Documents\\a.mcc");
msfs.connect({
    retries: Infinity,
    retryInterval: 5,
    onConnect: () => {
        console.log("Connected to MSFS");
        msfs.on("planeLoaded", (plane) => {
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
panel.on('buttonPressed', (button) => {
    device.buttons[configManager.mainConfig.MAPPINGS.BUTTON[button]].set(true);
    console.log("%s pressed", button);
});
panel.on('buttonReleased', (button) => {
    device.buttons[configManager.mainConfig.MAPPINGS.BUTTON[button]].set(false);
    console.log("%s released", button);
});
panel.open();
panel.clearGearLedStatus();
panel.setGearLedStatus(SwitchPanel_1.LedStatus.A_Yellow, false);
panel.startPolling();
