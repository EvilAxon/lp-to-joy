import psList from 'ps-list';

// Replace 'process_name' with the actual name of the process you want to find
const processNameToFind = 'MFConnector.exe';


psList().then((processes) => {
    const targetProcess = processes.find((process) => process.name === processNameToFind);

    if (targetProcess) {
        console.log('Process found:');
        console.log('PID:', targetProcess.pid);
        console.log('Command:', targetProcess.cmd);

        // Kill the process
        killProcess(targetProcess.pid);
    } else {
        console.log(`Process with name '${processNameToFind}' not found.`);
    }
});


const killProcess = (pid) => {
    // Replace 'SIGTERM' with 'SIGKILL' for a forceful termination
    process.kill(pid, 'SIGTERM', (err) => {
        if (err) {
            throw new Error(err);
        }

        console.log(`Process with PID ${pid} killed`);
    });
};