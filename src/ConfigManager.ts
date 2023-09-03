import path from "path";

const flatconfig = require("flatconfig");
const fs = require("fs");

export class ConfigManager
{

    public confDefault =
    {
        MAPPINGS: {
            VJOY_NUMBER: 1
        },
        MOBIFLIGHT: {
            CONFIGPATH: "./"
        }
    }
    
    public planesDefault = 
    {
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

    public mainConfig:any = {};
    public planeConfig:any = {};

    private configFolder:string = process.cwd()+"/config/";
    private planesConfigFolder:string = process.cwd()+"/config/planes/";
    private mainConfigFile:string  = this.configFolder + "conf.ini";
    public planesConfig:Record<string, any> =
    {
        "default": this.planesDefault
    };
    
    public constructor()
    {
        // read configuration
        // TO-DO: Error handling
        this.mainConfig = flatconfig.load(this.confDefault, this.mainConfigFile);
        fs.readdirSync( this.planesConfigFolder ).forEach( (configFile:string) =>
        {
            const keyName = path.parse(configFile).name; 
            this.planesConfig[keyName] = flatconfig.load(this.planesDefault, this.planesConfigFolder+configFile);
        });
    }
    
    public loadConfig( planeName:string ):void
    {
        if( this.planesConfig[planeName] != null )
            this.planeConfig = this.planesConfig[planeName];
        else
            this.planeConfig = this.planesConfig["default"];
    }
}