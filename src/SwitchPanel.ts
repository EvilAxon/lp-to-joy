import EventEmitter from "events";
import {Device, InEndpoint, Interface} from "usb";
var usb = require("usb");

export class ButtonDef
{
    public byte:number = 0;
    public bit:number = 0;
    
    public constructor(byte:number, bit:number)
    {
        this.byte = byte;
        this.bit = bit;
    }
}

export class SwitchPanel extends EventEmitter
{
    private vendorId:number          = 0x06a3;
    private productId:number         = 0x0d67;
    private readPayloadSize:number   = 3;
    private pollingSize:number       = 3;

    public buttons:Record<string, ButtonDef> =
    { // Byte 0
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
    }
    
    // Stores current buttons status
    private currentStatus:Uint8Array = new Uint8Array([0,0,0]);
    private device:Device|undefined;
    private devInterface:Interface|undefined;
    private devEndpoint:InEndpoint|undefined;
    
    

    public constructor() 
    {
        super();
    }
    
    public open() : void
    {
        this.device = usb.findByIds(this.vendorId, this.productId);
        if(this.device == null ) throw new Error("Could not open the Switch Panel. Check USB connection and assure the device is working properly!");
        this.device.open();
        this.devInterface = this.device.interface(0);
        if(this.devInterface == null ) throw new Error("Could not open device Interface.");
        this.devEndpoint = this.devInterface.endpoints[0] as InEndpoint;
        if(this.devEndpoint == null ) throw new Error("Could not open device Endpoint.");
        this.devEndpoint.on("data", (data:Buffer) =>
        {
            SwitchPanel.dataReceiver(this, data);
        });
    }
    
    public close() : void
    {
        this.device?.close();
    }
    private static dataReceiver(mainObject:SwitchPanel, data:Buffer):void
    {
        mainObject.setNewStatus(data);
    }
    
    public startPolling() : void
    {
        try 
        {
            this.devInterface?.claim();    
        }
        catch(error:any)
        {
            throw new Error("Could not claim the interface!");
        }
        this.devEndpoint?.startPoll(this.pollingSize, this.readPayloadSize);
    }
    
    public stopPolling() : void
    {
        this.devEndpoint?.stopPoll();
        this.devInterface?.release();
    }
    
    public setNewStatus( newStatus:Buffer ):void
    {
        const tmpSt:Uint8Array = new Uint8Array(newStatus);
        Object.keys(this.buttons).forEach( (key:string) =>
        {
            const btdef:ButtonDef = this.buttons[key];
            const newSt:boolean = this.checkPressed(btdef, tmpSt );
            const oldSt:boolean = this.checkPressed(btdef, this.currentStatus );
            if (newSt && !oldSt) this.emit('buttonPressed', key);
            if (oldSt && !newSt) this.emit('buttonReleased', key);
        });
        this.currentStatus = tmpSt;
    }
    
    public checkPressed(button:ButtonDef, buffer?:Uint8Array ):boolean
    {
        if(buffer == undefined ) 
            buffer = this.currentStatus;
        return (buffer[button.byte] & button.bit) >0;
    }
    
}