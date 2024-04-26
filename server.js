import { readFile, writeFile } from 'fs/promises';
class StoredScenesDefaults {
    constructor () {
        this.scenes = [
            {out1: 1, out2: 2, out3: 3, out4: 4, out5: 5, out6: 6, out7: 7, out8: 8},
            {out1: 1, out2: 2, out3: 3, out4: 4, out5: 5, out6: 6, out7: 7, out8: 8},
            {out1: 1, out2: 2, out3: 3, out4: 4, out5: 5, out6: 6, out7: 7, out8: 8},
            {out1: 1, out2: 2, out3: 3, out4: 4, out5: 5, out6: 6, out7: 7, out8: 8},
            {out1: 1, out2: 2, out3: 3, out4: 4, out5: 5, out6: 6, out7: 7, out8: 8},
            {out1: 1, out2: 2, out3: 3, out4: 4, out5: 5, out6: 6, out7: 7, out8: 8},
            {out1: 1, out2: 2, out3: 3, out4: 4, out5: 5, out6: 6, out7: 7, out8: 8},
            {out1: 1, out2: 2, out3: 3, out4: 4, out5: 5, out6: 6, out7: 7, out8: 8},
        ]
    }
}

const scenesFilePath = './scenes.json';
const saveStateFilePath = './saveState.json';

const storeSceneConfig = async (scenes) => {
    try {
       await writeFile(scenesFilePath, JSON.stringify(scenes));
    } catch {
        return false;
    }
    return true;
}

const storeSaveState = async (state) => {
    try {
       await writeFile(saveStateFilePath, JSON.stringify(state));
    } catch {
        return false;
    }
    return true;
}

// Get the stored scene information from a local JSON file. Re-create the file if there's an issue (e.g. doesn't exist yet)
let savedScenes = new StoredScenesDefaults();
try {
    savedScenes = JSON.parse(
        await readFile(scenesFilePath)
      );
} catch {
    await storeSceneConfig(savedScenes);
}


class HDMIInput {
    constructor (index, name, EDIDType, EDIDIndex, pw5v, signal, rat, col, hdcp, bit, audio) {
        this.index     = index;
        this.name      = name;
        this.edidType  = EDIDType;
        this.edidIndex = EDIDIndex;
        this.pw5v      = pw5v;
        this.signal    = signal;
        this.rat       = rat;
        this.col       = col;
        this.hdcp      = hdcp;
        this.bit       = bit;
        this.audio     = audio;
    }
}

class OutputPort {
    constructor (index, name, inputPort, edid, hpd, signal, rat, col, hdcp, bit, audioIn, audioOutHDMI, audioOutIIS, audioOutSPDIF) {
        this.index         = index;
        this.name          = name;
        this.input         = inputPort;
        this.edid          = edid;
        this.hpd           = hpd;
        this.signal        = signal;
        this.rat           = rat;
        this.col           = col;
        this.hdcp          = hdcp;
        this.bit           = bit;
        this.audioIn       = audioIn;
        this.hdmi          = audioOutHDMI;
        this.iis           = audioOutIIS;
        this.spdif         = audioOutSPDIF;
    }
}


class VideoOutput {
    constructor(output, input) {
        this.port = output;
        this.source = input;
        this.EDID = {
            M: 0, // Mode ???
            D: 1, // ???
        };
        this.AudioInput = 1, // Mode?? 
        this.AudioOutput = {
            HDMI: 1,
            iis: 1,
            spdif: 1,
        };
    }
}

class User {
    constructor (username, password) {
        this.username = username;
        this.password = password;
    }
}

class EDIDInfo {
    constructor (port, value) {
        this.port = port;
        this.value = value;
    }
}

class EDIDConfig {
    constructor () {
        this.default = [
            new EDIDInfo(1, '3840x2160P60 444 DbV DTS5.1'),
            new EDIDInfo(2, '3840x2160P60 444 DbV MAT7.1'),
            new EDIDInfo(3, '3840x2160P60 444 DbV LPCM2.0'),
            new EDIDInfo(4, '3840x2160P60 444 LPCM2.0'),
            new EDIDInfo(5, '3840x2160P29 444 LPCM2.0'),
            new EDIDInfo(6, '3840x2160P60 420 DbV DTS5.1'),
            new EDIDInfo(7, '3840x2160P60 420 LPCM2.0'),
            new EDIDInfo(8, '1920x1080P60 444 LPCM2.0'),
        ];
        this.user = [
            new EDIDInfo(1, '3840x2160P60 444 DbV DTS5.1'),
            new EDIDInfo(2, '3840x2160P60 444 DbV MAT7.1'),
            new EDIDInfo(3, '3840x2160P60 444 DbV LPCM2.0'),
            new EDIDInfo(4, '3840x2160P60 444 LPCM2.0'),
            new EDIDInfo(5, '3840x2160P29 444 LPCM2.0'),
            new EDIDInfo(6, '3840x2160P60 420 DbV DTS5.1'),
            new EDIDInfo(7, '3840x2160P60 420 LPCM2.0'),
            new EDIDInfo(8, '1920x1080P60 444 LPCM2.0'),
        ];
    }
}

class InternalStateConfig {
    constructor () {
        this.edidConfig = new EDIDConfig();
        this.Inputs = [
            new HDMIInput(1, "HDMI_IN1", "default", 0, 1, 0, 0, 0, 0, 0, 1),
            new HDMIInput(2, "HDMI_IN2", "default", 0, 1, 0, 0, 0, 0, 0, 1),
            new HDMIInput(3, "HDMI_IN3", "default", 0, 1, 0, 0, 0, 0, 0, 1),
            new HDMIInput(4, "HDMI_IN4", "default", 0, 1, 0, 0, 0, 0, 0, 1),
            new HDMIInput(5, "HDMI_IN5", "default", 0, 1, 0, 0, 0, 0, 0, 1),
            new HDMIInput(6, "HDMI_IN6", "default", 0, 1, 0, 0, 0, 0, 0, 1),
            new HDMIInput(7, "HDMI_IN7", "default", 0, 1, 0, 0, 0, 0, 0, 1),
            new HDMIInput(8, "HDMI_IN8", "default", 0, 1, 0, 0, 0, 0, 0, 1),
        ];
        this.HDMIOutputs = [
            new OutputPort(1, "HDMI_OUT1", 1, "Unplug", 0, 0, 0, 0, 0, 0, 1, 1, 1, 1),
            new OutputPort(2, "HDMI_OUT2", 2, "Unplug", 0, 0, 0, 0, 0, 0, 1, 1, 1, 1),
            new OutputPort(3, "HDMI_OUT3", 3, "Unplug", 0, 0, 0, 0, 0, 0, 1, 1, 1, 1),
            new OutputPort(4, "HDMI_OUT4", 4, "Unplug", 0, 0, 0, 0, 0, 0, 1, 1, 1, 1),
            new OutputPort(5, "HDMI_OUT5", 5, "Unplug", 0, 0, 0, 0, 0, 0, 1, 1, 1, 1),
            new OutputPort(6, "HDMI_OUT6", 6, "Unplug", 0, 0, 0, 0, 0, 0, 1, 1, 1, 1),
            new OutputPort(7, "HDMI_OUT7", 7, "Unplug", 0, 0, 0, 0, 0, 0, 1, 1, 1, 1),
            new OutputPort(8, "HDMI_OUT8", 8, "Unplug", 0, 0, 0, 0, 0, 0, 1, 1, 1, 1),
        ];
        this.HDBTOutputs = [
            new OutputPort(1, "HDBT_OUT1", 1, "Unplug", 0, 0, 0, 0, 0, 0, 1, 1, 1, 1),
            new OutputPort(2, "HDBT_OUT2", 2, "Unplug", 0, 0, 0, 0, 0, 0, 1, 1, 1, 1),
            new OutputPort(3, "HDBT_OUT3", 3, "Unplug", 0, 0, 0, 0, 0, 0, 1, 1, 1, 1),
            new OutputPort(4, "HDBT_OUT4", 4, "Unplug", 0, 0, 0, 0, 0, 0, 1, 1, 1, 1),
            new OutputPort(5, "HDBT_OUT5", 5, "Unplug", 0, 0, 0, 0, 0, 0, 1, 1, 1, 1),
            new OutputPort(6, "HDBT_OUT6", 6, "Unplug", 0, 0, 0, 0, 0, 0, 1, 1, 1, 1),
            new OutputPort(7, "HDBT_OUT7", 7, "Unplug", 0, 0, 0, 0, 0, 0, 1, 1, 1, 1),
            new OutputPort(8, "HDBT_OUT8", 8, "Unplug", 0, 0, 0, 0, 0, 0, 1, 1, 1, 1),
        ];
        this.Scenes = [
            "scene01",
            "scene02",
            "scene03",
            "scene04",
            "scene05",
            "scene06",
            "scene07",
            "scene08",
        ];
        this.Users = [ // Still completely horrified that this is a thing...!
            new User("admin", "123456"),
            new User("admin1", "123456"),
            new User("admin2", "123456"),
            new User("admin3", "123456"),
            new User("admin4", "123456"),
            new User("", ""),
            new User("", ""),
            new User("", ""),
        ];
    }
}

let intnernalState = new InternalStateConfig();
try {
    intnernalState = JSON.parse(
        await readFile(saveStateFilePath)
      );
} catch {
    await storeSaveState(intnernalState);
}

const handleVideoCommand = (commandArray) => {
     // operation[0] is the command. The last character will indicate the operation type
    var operation = commandArray[0].charAt(commandArray[0].length-1);
    switch (operation) {
        case "d": //Change video mapping
            if (commandArray[1].startsWith('out') && commandArray[2].startsWith('matrix=')) {
                setVideoOutputSource(commandArray[1].charAt(commandArray[1].length-1), commandArray[2].charAt(commandArray[2].length-1));
            }
            break;
        case "l": //Operating Lock
            break;
        case "s": //Operating Save
            break;
    }

}

const setVideoOutputSource = async (output, input) => {
    if (output < 1 || output > 8 || input < 1 || input > 8) {
        return false;
    }
    intnernalState.HDMIOutputs[output - 1].input = input;
    intnernalState.HDBTOutputs[output - 1].input = input;
    console.log("Changed: Input:" + input + " >> Output:" + output);
    await storeSaveState(intnernalState);
    return true;
}

const handleAudioCommand = (commandArray) => {
    // operation[0] is the command. The last character will indicate the operation type
   var operation = commandArray[0].charAt(commandArray[0].length-1);
   var target = commandArray[1].charAt(commandArray[1].length-1);
   switch (operation) {
        case "d": //Change Audio state
            // Set input audio source > enc=0 to mute, 1 to select HDMI, 2 to select spdif. No idea about the analog audio inputs?!?
            if (commandArray[1].startsWith('in') && commandArray[2].startsWith('enc')) {
                var audioSource = commandArray[2].charAt(commandArray[2].length-1);
                setAudioInputSetting(target, audioSource);
            }
            if (commandArray[1].startsWith('out')) {
                var iis = commandArray[2].split("=")[1];
                var spdif = commandArray[3].split("=")[1];
                setAudioOutputSetting(target, iis, spdif);
            }
            break;
        case "l": //Operating Lock
            break;
        case "s": //Operating Save
            break;
   }
}

const setAudioInputSetting = async (input, source) => {
    if (input < 1 || input > 8 || input < 1 || input > 8 || source < 0 || source > 2) {
        return false;
    }
    intnernalState.Inputs[input-1].audio = source;
    await storeSaveState(intnernalState);
    return true;
}
const setAudioOutputSetting = async (output, iisOnOff, spdifOnOff) => {
    if (output < 1 || output > 8 || output < 1 || output > 8 || iisOnOff < 0 || iisOnOff > 1 || spdifOnOff < 0 || spdifOnOff > 1) {
        return false;
    }
    intnernalState.HDMIOutputs[output-1].iis = iisOnOff;
    intnernalState.HDMIOutputs[output-1].spdif = spdifOnOff;
    await storeSaveState(intnernalState);
    return true;
}


const handleSceneCommand = (commandArray) => {
    // operation[0] is the command. The last character will indicate the operation type
   var operationTarget = commandArray[0].charAt(commandArray[0].length-1);
   switch (commandArray[1]) {
       case "exe=0": //Clear scene
           break;
       case "exe=1": //Save scene
       saveScene(operationTarget);
           break;
       case "exe=2": //Recall scene
       recallScene(operationTarget);
           break;
   }

}

const recallScene = async (scene) => {
    if (scene < 1 || scene > 8) {
        return false;
    }
    // Probably need to do some more here???
    console.log("Recalling Scene: " + scene);
    for (var i=1; i<=8; i++){
        console.log("Changed: Input:" + savedScenes.scenes[scene - 1]["out"+i] + " >> Output:" + i);
        intnernalState.HDMIOutputs[i -1].input = savedScenes.scenes[scene - 1]["out"+i];
        intnernalState.HDBTOutputs[i -1].input = savedScenes.scenes[scene - 1]["out"+i];
    }
    await storeSaveState(intnernalState);
    return true;
}

const saveScene = async (scene) => {
    if (scene < 1 || scene > 8) {
        return false;
    }
    console.log("Saving Scene: " + scene);
    const newSceneConfig = {
        out1: intnernalState.HDMIOutputs[0].input,
        out2: intnernalState.HDMIOutputs[1].input,
        out3: intnernalState.HDMIOutputs[2].input,
        out4: intnernalState.HDMIOutputs[3].input,
        out5: intnernalState.HDMIOutputs[4].input,
        out6: intnernalState.HDMIOutputs[5].input,
        out7: intnernalState.HDMIOutputs[6].input,
        out8: intnernalState.HDMIOutputs[7].input,
    };
    console.log(JSON.stringify(newSceneConfig));
    savedScenes.scenes[scene-1] = newSceneConfig;
    return await storeSceneConfig(savedScenes);
}

const renameScene = async (scene, name) => {
    // BL Matrix only supports names up to 15 characters of visible characters, so sanitise and set:
    let newName = name.replace(/[^\u0000-\u007E]/g, "").substring(0,15);
    intnernalState.Scenes[scene - 1] = newName;
    await storeSaveState(intnernalState);
    return true;
}

const handlePortRename = async (commandArray) => {
    // commandArray[1] is the target type and numer (e.g. in1 or hdmi4).
   var targetType = commandArray[1].substring(0,commandArray[0].length-2);
   var targetPort = commandArray[1].charAt(commandArray[1].length-1);
   if (targetPort < 1 || targetPort > 8){ return false;}
   if(!["in","hdmi","hdbt"].includes(targetType) || !commandArray[2].startsWith("name")) {
    return false;
   }
   if (commandArray[2].split("=")[0] !== "name") {return false};
   let newName = commandArray[2].split("=")[1].replace(/[^\u0000-\u007E]/g, "").substring(0,15);
   var target = "Inputs";
   switch (targetType){
        case "in":   target = "Inputs";       break;
        case "hdmi": target = "HDMIOutputs"; break;
        case "hdbt": target = "HDBTOutputs"; break;
        default: return false;
   }
   intnernalState[target][targetPort-1].name = newName;
   await storeSaveState(intnernalState);
   return true;
}

const changeUserLogin = async (userIndex, userName, password) => {
    const regex = /^[a-zA-Z0-9_]{0,15}$/;
    if ( userIndex < 0 || userIndex >= 5 || !userName.test(regex) || !password.test(regex)) {
        return false;
    }
    intnernalState.Users[userIndex].username = userName;
    intnernalState.Users[userIndex].password = password;
    await storeSaveState(intnernalState);
    return true;
}

const generateStateStatusString = () => {
    var outputString = "";
    for(var i=1; i<=8; i++){ // Generate the Video Output status block
        outputString += "VO:" + i + "IN:" + intnernalState.HDMIOutputs[i-1].input + ";"
            + "E:" + i + "M:0D:1"  + ";" // Need to figure out what on earth goes here for M and D
            + "AI:" + i + "M:" + intnernalState.Inputs[i-1].audio + ";"
            + "AO:" + i + "HDMI:" + intnernalState.HDMIOutputs[i-1].hdmi + ";"
            + "AO:" + i + "iis:" + intnernalState.HDMIOutputs[i-1].iis + ";"
            + "AO:" + i + "spdif:" + intnernalState.HDMIOutputs[i-1].spdif + ";";
    }

    for(var i=1; i<=8; i++){ // Generate the EDID Defaults block
        outputString += "ded" + i + ":" + intnernalState.edidConfig.default[i-1].value + ";";
    }
    for(var i=1; i<=8; i++){ // Generate the EDID User config block
        outputString += "ued" + i + ":" + intnernalState.edidConfig.user[i-1].value + ";";
    }
    for(var i=1; i<=8; i++){ // Generate the EDID Input status block
        outputString += "ied" + i + ":" + intnernalState.edidConfig[intnernalState.Inputs[i-1].edidType][intnernalState.Inputs[i-1].edidIndex].value + ";";
    }
    for(var i=1; i<=8; i++){ // Generate the EDID HDMI Output status block - triggered by misspelled "oed_hdim"...
        outputString += "oed_hdim" + i + ":" + intnernalState.HDMIOutputs[i-1].edid + ";";
    }
    for(var i=1; i<=8; i++){ // Generate the EDID HDMI Output status block - triggered by misspelled "oed_hdim"...
        outputString += "oed_hdbt" + i + ":" + intnernalState.HDBTOutputs[i-1].edid + ";";
    }
    for(var i=1; i<=8; i++){ // Generate the HDMI Input port names block
        outputString += "port_i" + i + ":" + intnernalState.Inputs[i-1].name + ";";
    }
    for(var i=1; i<=8; i++){ // Generate the HDMI HDMI Output port names block
        outputString += "port_ohdmi" + i + ":" + intnernalState.HDMIOutputs[i-1].name + ";";
    }
    for(var i=1; i<=8; i++){ // Generate the HDMI HDBT Output names block
        outputString += "port_ohdbt" + i + ":" + intnernalState.HDBTOutputs[i-1].name + ";";
    }
    for(var i=1; i<=8; i++){ // Generate the Scene names block
        outputString += "grp" + i + ":" + intnernalState.Scenes[i-1] + ";";
    }
    for(var i=1; i<=8; i++){ // Generate the absolutely horrifying Users block
        outputString += "lod" + i + ":" + intnernalState.Users[i-1].username + ";";
        outputString += "lod" + i + ":" + intnernalState.Users[i-1].password + ";";
    }

    // Generate the Input info block
    outputString += "INPORT:"
    for(var i=1; i<=8; i++){
        outputString += "pw5v=" + intnernalState.Inputs[i-1].pw5v + ",";
        outputString += "sig="  + intnernalState.Inputs[i-1].signal + ",";
        outputString += "rat="  + intnernalState.Inputs[i-1].rat + ","; 
        outputString += "col="  + intnernalState.Inputs[i-1].col + ","; 
        outputString += "hdcp=" + intnernalState.Inputs[i-1].hdcp + ","; 
        outputString += "bit="  + intnernalState.Inputs[i-1].bit + ";"; 
    }
    // Generate the HDMI Output info block
    outputString += "OUTHDMIPORT:"
    for(var i=1; i<=8; i++){
        outputString += "hpd="  + intnernalState.HDMIOutputs[i-1].hpd + ",";
        outputString += "sig="  + intnernalState.HDMIOutputs[i-1].signal + ",";
        outputString += "rat="  + intnernalState.HDMIOutputs[i-1].rat + ","; 
        outputString += "col="  + intnernalState.HDMIOutputs[i-1].col + ","; 
        outputString += "hdcp=" + intnernalState.HDMIOutputs[i-1].hdcp + ","; 
        outputString += "bit="  + intnernalState.HDMIOutputs[i-1].bit + ";"; 
    }
    // Generate the HDCP Output info block
    outputString += "OUTHDMIPORT:"
    for(var i=1; i<=8; i++){
        outputString += "hpd="  + intnernalState.HDBTOutputs[i-1].hpd + ",";
        outputString += "sig="  + intnernalState.HDBTOutputs[i-1].signal + ",";
        outputString += "rat="  + intnernalState.HDBTOutputs[i-1].rat + ","; 
        outputString += "col="  + intnernalState.HDBTOutputs[i-1].col + ","; 
        outputString += "hdcp=" + intnernalState.HDBTOutputs[i-1].hdcp + ","; 
        outputString += "bit="  + intnernalState.HDBTOutputs[i-1].bit + ";"; 
    }
    return outputString;
}

// const express = require('express');
// const internal = require('stream');
import express from 'express';
import stream from 'stream';
import bodyParser from 'body-parser';
import internal from 'stream';
const app = express();
const port = 3000;
app.use(bodyParser.text());

app.get('/', async (req, res) => {
    res.writeHeader(200, {"Content-Type": 'text/html'});
    res.write(await readFile('./original.html'));
    res.end();
})

app.get('/all_dat.get*', (req, res) => {
    let status = generateStateStatusString();
    // let status = 'OK';
    res.send(status);
})

app.post('/video.set', (req, res) => {
    console.log(req.body);
    // Multiple commands can be sent in at once. Each command starts with a #, so split the body by #
    let commands = req.body.split("#");
    for (var i=0; i<commands.length; i++){
        let body = commands[i].split(" ");
        console.log(JSON.stringify(body));

        switch (true) {
            case body[0].startsWith("video_"): // Set video port mapping
                handleVideoCommand(body);
                break;
            case body[0].startsWith("audio_"): 
                handleAudioCommand(body);
                break;
            case body[0].startsWith("edid_"):
                break;
            case body[0] === "lcd":
                break;
            case body[0].startsWith("group"):
                handleSceneCommand(body);
                break;
            case body[0] === "register":
                break;
            case body[0] === "login":
                break;
            case body[0] === "port": // Rename port
                handlePortRename(body);
                break;
            case body[0] === "power":
                break;
            case body[0] === "ip":
                break;
            case body[0] === "system":
                break;
            case body[0] === "factory":
                break;
            // case body[0] === "cmd":
            //     break;
        }
    }
    res.end();
})

app.get('/ip.get', (req, res) => {
    res.send("");
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
})