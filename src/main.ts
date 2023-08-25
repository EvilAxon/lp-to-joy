import {SwitchPanel} from "./SwitchPanel";
import {ButtonDef} from "./SwitchPanel";

const panel:SwitchPanel = new SwitchPanel();
panel.on('buttonPressed', (button:string) =>
{
    console.log("%s pressed", button);
})

panel.on('buttonReleased', (button:string) =>
{
    console.log("%s released", button);
})

panel.setNewStatus(new Buffer([1,1,1]));
panel.setNewStatus(new Buffer([0,0,0]));