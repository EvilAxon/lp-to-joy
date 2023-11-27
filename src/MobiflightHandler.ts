import EventEmitter from "events";
import psList from 'ps-list';
const { spawn } = require('child_process');

export class MobiflightHandler extends EventEmitter 
{
    protected mobiflightProcessName:string = "MFConnector.exe";

    public constructor()
    {
        super();
    }

    public startMobiflightWithConfiguration(mobiflightExe:string, configfile:string)
    {
        this.seekAndDestroy( () =>
        {
            spawn(mobiflightExe, ["/autoRun",  "/cfg "+configfile]);
        });
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