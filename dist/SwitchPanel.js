"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SwitchPanel = exports.LedStatus = exports.LedStatusDef = exports.ButtonDef = void 0;
const events_1 = __importDefault(require("events"));
var usb = require("usb");
const { bmRequestType, DIRECTION, TYPE, RECIPIENT } = require('bmrequesttype');
class ButtonDef {
    constructor(byte, bit) {
        this.byte = 0;
        this.bit = 0;
        this.byte = byte;
        this.bit = bit;
    }
}
exports.ButtonDef = ButtonDef;
var LedStatusDef;
(function (LedStatusDef) {
    LedStatusDef[LedStatusDef["N_Green"] = 1] = "N_Green";
    LedStatusDef[LedStatusDef["L_Green"] = 2] = "L_Green";
    LedStatusDef[LedStatusDef["R_Green"] = 4] = "R_Green";
    LedStatusDef[LedStatusDef["N_Red"] = 8] = "N_Red";
    LedStatusDef[LedStatusDef["L_Red"] = 16] = "L_Red";
    LedStatusDef[LedStatusDef["R_Red"] = 32] = "R_Red";
})(LedStatusDef || (exports.LedStatusDef = LedStatusDef = {}));
var LedStatus;
(function (LedStatus) {
    LedStatus[LedStatus["N_Green"] = 1] = "N_Green";
    LedStatus[LedStatus["L_Green"] = 2] = "L_Green";
    LedStatus[LedStatus["R_Green"] = 4] = "R_Green";
    LedStatus[LedStatus["N_Red"] = 8] = "N_Red";
    LedStatus[LedStatus["L_Red"] = 16] = "L_Red";
    LedStatus[LedStatus["R_Red"] = 32] = "R_Red";
    LedStatus[LedStatus["N_Yellow"] = 9] = "N_Yellow";
    LedStatus[LedStatus["L_Yellow"] = 18] = "L_Yellow";
    LedStatus[LedStatus["R_Yellow"] = 36] = "R_Yellow";
    LedStatus[LedStatus["A_Green"] = 7] = "A_Green";
    LedStatus[LedStatus["A_Red"] = 56] = "A_Red";
    LedStatus[LedStatus["A_Yellow"] = 63] = "A_Yellow";
})(LedStatus || (exports.LedStatus = LedStatus = {}));
class SwitchPanel extends events_1.default {
    constructor() {
        super();
        this.vendorId = 0x06a3;
        this.productId = 0x0d67;
        this.readPayloadSize = 3;
        this.pollingSize = 3;
        this.buttons = {
            BAT: new ButtonDef(0, 1 << 0),
            ALT: new ButtonDef(0, 1 << 1),
            AVIONICS: new ButtonDef(0, 1 << 2),
            FUEL: new ButtonDef(0, 1 << 3),
            DEICE: new ButtonDef(0, 1 << 4),
            PILOT: new ButtonDef(0, 1 << 5),
            COWL: new ButtonDef(0, 1 << 6),
            PANEL: new ButtonDef(0, 1 << 7),
            // Byte 1
            BEACON: new ButtonDef(1, 1 << 0),
            NAV: new ButtonDef(1, 1 << 1),
            STROBE: new ButtonDef(1, 1 << 2),
            TAXI: new ButtonDef(1, 1 << 3),
            LANDING: new ButtonDef(1, 1 << 4),
            MAG_OFF: new ButtonDef(1, 1 << 5),
            MAG_R: new ButtonDef(1, 1 << 6),
            MAG_L: new ButtonDef(1, 1 << 7),
            // Byte 2
            MAG_BOTH: new ButtonDef(2, 1 << 0),
            MAG_START: new ButtonDef(2, 1 << 1),
            GEAR_UP: new ButtonDef(2, 1 << 2),
            GEAR_DOWN: new ButtonDef(2, 1 << 3),
        };
        // Stores current buttons status
        this.currentStatus = new Uint8Array([0, 0, 0]);
        this.currentLedStatus = new Uint8Array([0]);
    }
    open() {
        this.device = usb.findByIds(this.vendorId, this.productId);
        if (this.device == null)
            throw new Error("Could not open the Switch Panel. Check USB connection and assure the device is working properly!");
        this.device.open();
        this.devInterface = this.device.interface(0);
        if (this.devInterface == null)
            throw new Error("Could not open device Interface.");
        this.devEndpoint = this.devInterface.endpoints[0];
        if (this.devEndpoint == null)
            throw new Error("Could not open device Endpoint.");
        this.devEndpoint.on("data", (data) => {
            SwitchPanel.dataReceiver(this, data);
        });
    }
    close() {
        var _a;
        (_a = this.device) === null || _a === void 0 ? void 0 : _a.close();
    }
    static dataReceiver(mainObject, data) {
        mainObject.setNewStatus(data);
    }
    startPolling() {
        var _a, _b;
        try {
            (_a = this.devInterface) === null || _a === void 0 ? void 0 : _a.claim();
        }
        catch (error) {
            throw new Error("Could not claim the interface!");
        }
        (_b = this.devEndpoint) === null || _b === void 0 ? void 0 : _b.startPoll(this.pollingSize, this.readPayloadSize);
    }
    stopPolling() {
        var _a, _b;
        (_a = this.devEndpoint) === null || _a === void 0 ? void 0 : _a.stopPoll();
        (_b = this.devInterface) === null || _b === void 0 ? void 0 : _b.release();
    }
    setNewStatus(newStatus) {
        const tmpSt = new Uint8Array(newStatus);
        Object.keys(this.buttons).forEach((key) => {
            const btdef = this.buttons[key];
            const newSt = this.checkPressed(btdef, tmpSt);
            const oldSt = this.checkPressed(btdef, this.currentStatus);
            if (newSt && !oldSt)
                this.emit('buttonPressed', key);
            if (oldSt && !newSt)
                this.emit('buttonReleased', key);
        });
        this.currentStatus = tmpSt;
    }
    checkPressed(button, buffer) {
        if (buffer == undefined)
            buffer = this.currentStatus;
        return (buffer[button.byte] & button.bit) > 0;
    }
    setGearLedStatus(led, status) {
        if (status)
            this.currentLedStatus[0] |= led;
        else
            this.currentLedStatus[0] &= ~led;
        this.sendGearLedStatus();
    }
    clearGearLedStatus() {
        this.currentLedStatus[0] = 0;
        this.sendGearLedStatus();
    }
    sendGearLedStatus() {
        var _a;
        // Definisci il messaggio di controllo da inviare
        const bmRType = bmRequestType(DIRECTION.Out, TYPE.Class, RECIPIENT.Interface);
        console.log(bmRType);
        const bRequest = 0x09; // Sostituisci con il valore corretto per il tuo caso
        const wValue = 0x0300; // Valore personalizzato (potrebbe variare)
        const wIndex = 0x0000; // Indice personalizzato (potrebbe variare)
        const data = Buffer.from(this.currentLedStatus); // Dati da inviare (un byte)
        // Invia il messaggio di controllo all'endpoint 0
        (_a = this.device) === null || _a === void 0 ? void 0 : _a.controlTransfer(bmRType, bRequest, wValue, wIndex, data, (error) => {
            if (error) {
                console.error('Errore durante il trasferimento di controllo:', error);
            }
            else {
                console.log('Messaggio di controllo inviato con successo.');
            }
        });
    }
}
exports.SwitchPanel = SwitchPanel;
