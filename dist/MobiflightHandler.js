"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MobiflightHandler = void 0;
const events_1 = __importDefault(require("events"));
const ps_list_1 = __importDefault(require("ps-list"));
const { spawn } = require('child_process');
class MobiflightHandler extends events_1.default {
    constructor() {
        super();
        this.mobiflightProcessName = "MFConnector.exe";
    }
    startMobiflightWithConfiguration(mobiflightExe, configfile) {
        this.seekAndDestroy(() => {
            spawn(mobiflightExe, ["/autoRun", "/cfg " + configfile]);
        });
    }
    seekAndDestroy(onProcessKilled) {
        (0, ps_list_1.default)().then((processes) => {
            const targetProcess = processes.find((process) => process.name === this.mobiflightProcessName);
            if (targetProcess) {
                console.log('Mobiflight found running, PID:', targetProcess.pid);
                if (process.kill(targetProcess.pid, 'SIGTERM'))
                    console.log(`Mobiflight Killed`);
            }
            onProcessKilled();
        });
    }
}
exports.MobiflightHandler = MobiflightHandler;
