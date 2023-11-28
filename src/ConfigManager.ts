import path from "path";
const fs = require("fs");

type  l2jButtonMapping =
{
    BAT?: number;
    ALT?: number;
    AVIONICS?: number;
    FUEL?: number;
    DEICE?: number;
    PILOT?: number;
    COWL?: number;
    PANEL?: number;
    // Byte 1
    BEACON?: number;
    NAV?: number;
    STROBE?: number;
    TAXI?: number;
    LANDING?: number;
    MAG_OFF?: number;
    MAG_R?: number;
    MAG_L?: number;
    // Byte 2
    MAG_BOTH?: number;
    MAG_START?: number;
    GEAR_UP?: number;
    GEAR_DOWN?: number;
}

type l2jMappings = 
{
    VJOY_NUMBER?: string;
    BUTTON?: l2jButtonMapping;
}

type l2jMobiflightConf =
{
    EXEPATH?: string;
    CONFIGPATH?: string;
}

type l2jMainConf =
{
    MAPPINGS?: l2jMappings;
    MOBIFLIGHT?: l2jMobiflightConf;
}

type l2jPlaneConf =
{
    MAPPINGS?: l2jMappings;
    MOBIFLIGHT?: l2jMobiflightConf;
}

export class ConfigManager
{

    public confDefault:l2jMainConf = 
    {
        MAPPINGS: {
            VJOY_NUMBER: 1
        },
        MOBIFLIGHT: {
            EXEPATH: "",
            CONFIGPATH: "./"
        }
    }
    
    public planesDefault:l2jPlaneConf = 
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
        },
        MOBIFLIGHT: {
            CONFIGTOLOAD: ""
        }
    }

    public mainConfig:object = {};
    public planeConfig:object = {};

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
        
        var newConf:object = JSON.parse(fs.readdirSync(this.confDefault));
        this.mainConfig ={ ...this.mainConfig, ...newConf};

        fs.readdirSync( this.planesConfigFolder ).forEach( (configFile:string) =>
        {
            const keyName = path.parse(configFile).name; 
            var newPlaneConfig:object = JSON.parse(fs.readdirSync(this.planesConfigFolder+configFile));
            this.planesConfig[keyName] = {...this.planesDefault, ...newPlaneConfig};
        });
    }
    
    public loadConfig( planeName:string ):void
    {
        if( this.planesConfig[planeName] != null )
            this.planeConfig = this.planesConfig[planeName];
        else
            this.planeConfig = this.planesConfig["default"];
        
        if( this.planeConfig.MOBIFLIGHT.CONFIGTOLOAD.trim() != "" )
            this.loadMobiflightConfig(  this.mainConfig.MOBIFLIGHT.CONFIGPATH+this.planeConfig.MOBIFLIGHT.CONFIGTOLOAD)
    }
    
    public loadMobiflightConfig( configname:string )
    {
        
    }
}