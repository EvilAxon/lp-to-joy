# lp-to-joy

Lp-to-joy is a small utility to remap the Logitech switch panel (radio panel will be supported in the near future, as well as the multi panel) 
to a virtual joystick or directly to Simconnect Events and Variables.

### Why?
Logitech panels are handled by their own totally unconfigurable drivers, and that's not acceptable when you fly multiple planes. 
Sometimes you want to map special features of your plane or use the panel with some third party software like the excellent Mobiflight. 
So I decided to build up a simple mapper tool that allows me to configure the panel as I need it.

I know there is a great solution out there. SPAD.neXt does it's job perfectly. But I was looking for a easier and free solution 
and I decided to code it my own. Also... coding is fun!

### Project status
As for now the software is still in it's early stage, and it's not suitable to be used. It maps all the buttons to a 
vJoy, and can be used both inside MSFS (or DCS, or any other flight sim, probably) and with Mobiflight, since it supports vJoy.

Hopefully it will reach a stable and usable stage soon.

### Project roadmap

| Feature                                                           | Status |
|-------------------------------------------------------------------|---|
| Switch panel button handling                                      | done|
| Basic vJoy interaction                                            | done |
| Landing gear lights                                               | done|
| Simconnect interaction for landing gear lights                    | |
| Load a different config depending on MSFS loaded plane            ||
| Load a different Mobiflight config depending on MSFS loaded plane ||
| Windows tray area interaction/windows UI                          ||
| Build system/windiows executable||
