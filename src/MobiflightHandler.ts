import EventEmitter from "events";
import psList from 'ps-list';

export class MobiflightHandler extends EventEmitter 
{
    protected mobiflightProcessName:string = "MFConnector.exe";

    public constructor()
    {
        super();
    }

    public startMobiflightWithConfiguration(configfile:string)
    {
        process.
    }
    
    public seekAndDestroy( onProcessKilled )
    {
        psList().then((processes) => 
        {
            const targetProcess = processes.find((process) => process.name === this.mobiflightProcessName);
            if (targetProcess) 
            {
                console.log('Mobiflight found running, PID:', targetProcess.pid);
                if (process.kill(targetProcess.pid, 'SIGTERM') )
                    console.log(`Mobiflight Killed`);
            }
            onProcessKilled();
        });
    }
}