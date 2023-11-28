"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MSFSConnector = exports.EVENT_ID = void 0;
const node_simconnect_1 = require("node-simconnect");
const events_1 = __importDefault(require("events"));
var EVENT_ID;
(function (EVENT_ID) {
    EVENT_ID[EVENT_ID["AIRCRAFT_LOADED"] = 1] = "AIRCRAFT_LOADED";
})(EVENT_ID || (exports.EVENT_ID = EVENT_ID = {}));
class MSFSConnector extends events_1.default {
    constructor() {
        super();
        this.clientName = "MSFSConnector";
        this.connected = false;
    }
    connect(opts) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            (_a = opts.retries) !== null && _a !== void 0 ? _a : (opts.retries = 0);
            (_b = opts.retryInterval) !== null && _b !== void 0 ? _b : (opts.retryInterval = 0);
            (_c = opts.onConnect) !== null && _c !== void 0 ? _c : (opts.onConnect = () => { });
            try {
                const { handle } = yield (0, node_simconnect_1.open)(this.clientName, node_simconnect_1.Protocol.KittyHawk);
                if (!handle)
                    throw new Error(`No connection handle to MSFS`);
                this.handle = handle;
                this.connected = true;
                opts.onConnect(handle);
                handle.subscribeToSystemEvent(EVENT_ID.AIRCRAFT_LOADED, 'AircraftLoaded');
                handle.on("event", (recvEvent) => this.handleSystemEvent(recvEvent));
                handle.on("exception", (recvException) => console.error(recvException));
                handle.on('eventFilename', (recvEventFilename) => this.handleFilenameEvent(recvEventFilename));
            }
            catch (err) {
                if (opts.retries) {
                    opts.retries--;
                    setTimeout(() => this.connect(opts), 1000 * opts.retryInterval);
                }
                else
                    throw new Error(`No connection to MSFS`);
            }
        });
    }
    handleFilenameEvent(event) {
        switch (event.clientEventId) {
            case EVENT_ID.AIRCRAFT_LOADED:
                const tokens = event.fileName.split("\\");
                const planeName = tokens[tokens.length - 2];
                console.log(event.fileName);
                console.log("Loading plane: " + planeName);
                this.emit('planeLoaded', planeName);
                break;
        }
    }
    handleSystemEvent(event) {
    }
}
exports.MSFSConnector = MSFSConnector;
