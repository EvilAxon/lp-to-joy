"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigManager = void 0;
const path_1 = __importDefault(require("path"));
const fs = require("fs");
class ConfigManager {
    constructor() {
        // read configuration
        // TO-DO: Error handling
        this.confDefault = {
            MAPPINGS: {
                VJOY_NUMBER: 1
            },
            MOBIFLIGHT: {
                EXEPATH: "",
                CONFIGPATH: "./"
            }
        };
        this.planesDefault = {
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
            },
            MOBIFLIGHT: {
                CONFIGTOLOAD: ""
            }
        };
        this.mainConfig = {};
        this.planeConfig = {};
        this.configFolder = process.cwd() + "/config/";
        this.planesConfigFolder = process.cwd() + "/config/planes/";
        this.mainConfigFile = this.configFolder + "conf.ini";
        this.planesConfig = {
            "default": this.planesDefault
        };
        var newConf = JSON.parse(fs.readdirSync(this.confDefault));
        this.mainConfig = Object.assign(Object.assign({}, this.mainConfig), newConf);
        fs.readdirSync(this.planesConfigFolder).forEach((configFile) => {
            const keyName = path_1.default.parse(configFile).name;
            var newPlaneConfig = JSON.parse(fs.readdirSync(this.planesConfigFolder + configFile));
            this.planesConfig[keyName] = Object.assign(Object.assign({}, this.planesDefault), newPlaneConfig);
        });
    }
    loadConfig(planeName) {
        if (this.planesConfig[planeName] != null)
            this.planeConfig = this.planesConfig[planeName];
        else
            this.planeConfig = this.planesConfig["default"];
        if (this.planeConfig.MOBIFLIGHT.CONFIGTOLOAD.trim() != "")
            this.loadMobiflightConfig(this.mainConfig.MOBIFLIGHT.CONFIGPATH + this.planeConfig.MOBIFLIGHT.CONFIGTOLOAD);
    }
    loadMobiflightConfig(configname) {
    }
}
exports.ConfigManager = ConfigManager;
