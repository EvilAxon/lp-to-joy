import {open, Protocol, RecvEvent, RecvEventFilename, RecvException} from 'node-simconnect';
import EventEmitter from "events";

export enum EVENT_ID
{
    AIRCRAFT_LOADED = 1
}

export class MSFSConnector extends EventEmitter
{
    protected clientName:string = "MSFSConnector";
    protected handle:any;
    public connected:boolean = false;
    
    public constructor()
    {
        super();
    }
    
    public async connect( opts:any )
    {
        opts.retries ??= 0;
        opts.retryInterval ??= 0;
        opts.onConnect ??= () => {};
        try {
            const { handle } = await open(this.clientName, Protocol.KittyHawk);
            if (!handle) throw new Error(`No connection handle to MSFS`);
            this.handle = handle;
            this.connected = true;
            opts.onConnect(handle);
            handle.subscribeToSystemEvent(
                EVENT_ID.AIRCRAFT_LOADED,
                'AircraftLoaded'
            );
            handle.on("event", (recvEvent:RecvEvent) => this.handleSystemEvent(recvEvent));
            handle.on("exception", (recvException:RecvException) => console.error(recvException));
            handle.on('eventFilename', (recvEventFilename:RecvEventFilename) => this.handleFilenameEvent(recvEventFilename) );
        } catch (err) {
            if (opts.retries) {
                opts.retries--;
                setTimeout(() => this.connect(opts), 1000 * opts.retryInterval);
            } else throw new Error(`No connection to MSFS`);
        }
        
    }

    private handleFilenameEvent(event:RecvEventFilename)
    {
        switch (event.clientEventId)
        {
            case EVENT_ID.AIRCRAFT_LOADED:
                const tokens:string[] = event.fileName.split("\\");
                const planeName = tokens[tokens.length-2];
                console.log(event.fileName );
                console.log("Loading plane: "+planeName);
                this.emit('planeLoaded', planeName );
                break;
        }
    }
    
    private handleSystemEvent(event:any) 
    {
       
    }
}    