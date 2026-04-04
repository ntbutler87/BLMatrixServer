# BLMatrixServer

This is intended to simulate the simple web server that runs on the BrightLink BL-8X8-HDBT-HD20 HDMI Matrix. It's intended use is to operate as a simulation of a working HDMI matrix, to test with whilst developing a controller app (the BLMatrix control app https://github.com/ntbutler87/BLMatrix). It has limited functionality implemented - mainly videoinput/output patching and scene save/recall.

To run the server, download/clone the repo, then install the package dependencies with npm install, and finally run npm start:
```bash
npm install;
npm start;

> start
> node server.js

Example app listening on port 3000
```

This should have an express webserver running on port 3000. If developing something to control one of these matrix switchers, you can point your controller at <local_ip>:3000 and you should be able to test basic control functionality.

This project now also includes a visualiser page so you can monitor the current state of the server easily. Open a web browser and head to http://localhost:3000 and you should see the following page:
![Screenshot of the visualisation dashboard.](/resources/visualiser.png)

The input/output buttons on the mock front panel should work and operate like the actual device (tap an input to select it, then an output to route it - or start with the output and then select the appropriate input). Likewise, the scene store/recall buttons should operate as expected. The large routing matrix section should also work, and allow you to queue up multiple input>output routing changes to be sent at once (functionally faster than a full scene recall on an actual hardware unit).
