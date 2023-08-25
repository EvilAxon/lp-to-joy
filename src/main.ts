import {SwitchPanel} from "./SwitchPanel";

const panel:SwitchPanel = new SwitchPanel();
panel.on('buttonPressed', (button:string) =>
{
    console.log("%s pressed", button);
})

panel.on('buttonReleased', (button:string) =>
{
    console.log("%s released", button);
})

panel.open();
panel.startPolling();

