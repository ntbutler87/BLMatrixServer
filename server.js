import { readFile, writeFile } from 'fs/promises';
import { resolve } from 'path';
import Database from 'better-sqlite3';
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

// ── Controller settings DB ────────────────────────────────────────────────────
const controllerDb = new Database('./controller.db');
controllerDb.exec(`
    CREATE TABLE IF NOT EXISTS settings (key TEXT PRIMARY KEY, value TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS labels   (type TEXT NOT NULL, idx INTEGER NOT NULL, name TEXT NOT NULL, PRIMARY KEY (type, idx));
`);
const _seed = controllerDb.prepare('INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)');
_seed.run('matrix_ip',   '');
_seed.run('matrix_port', '80');

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


// EDID source modes, as used by the E: block and the `edid_d` command:
//   0 = Default (built-in preset table, ded1-8)
//   1 = User    (user-defined table, ued1-8)
//   2 = HDMI    (copy the EDID read from HDMI output N,  oed_hdim1-8)
//   3 = HDBT    (copy the EDID read from HDBT output N,  oed_hdbt1-8)
const EDID_MODE = { DEFAULT: 0, USER: 1, HDMI: 2, HDBT: 3 };

class HDMIInput {
    constructor (index, name, edidMode, edidData, pw5v, signal, rat, col, hdcp, bit, audio) {
        this.index     = index;
        this.name      = name;
        this.edidMode  = edidMode; // 0-3, see EDID_MODE
        this.edidData  = edidData; // 1-8: slot within the table selected by edidMode
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
            new HDMIInput(1, "HDMI_IN1", EDID_MODE.DEFAULT, 1, 1, 0, 0, 0, 0, 0, 1),
            new HDMIInput(2, "HDMI_IN2", EDID_MODE.DEFAULT, 1, 1, 0, 0, 0, 0, 0, 1),
            new HDMIInput(3, "HDMI_IN3", EDID_MODE.DEFAULT, 1, 1, 0, 0, 0, 0, 0, 1),
            new HDMIInput(4, "HDMI_IN4", EDID_MODE.DEFAULT, 1, 1, 0, 0, 0, 0, 0, 1),
            new HDMIInput(5, "HDMI_IN5", EDID_MODE.DEFAULT, 1, 1, 0, 0, 0, 0, 0, 1),
            new HDMIInput(6, "HDMI_IN6", EDID_MODE.DEFAULT, 1, 1, 0, 0, 0, 0, 0, 1),
            new HDMIInput(7, "HDMI_IN7", EDID_MODE.DEFAULT, 1, 1, 0, 0, 0, 0, 0, 1),
            new HDMIInput(8, "HDMI_IN8", EDID_MODE.DEFAULT, 1, 1, 0, 0, 0, 0, 0, 1),
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
    migrateSaveState(intnernalState);
} catch {
    await storeSaveState(intnernalState);
}

// Older saveState.json files stored input EDID as {edidType: "default"|"user", edidIndex: 0-based}.
// The device reports mode (0-3) and a 1-based slot, so normalise on load.
function migrateSaveState(state) {
    for (const input of state.Inputs ?? []) {
        if (input.edidMode !== undefined) continue;
        input.edidMode = input.edidType === "user" ? EDID_MODE.USER : EDID_MODE.DEFAULT;
        input.edidData = (input.edidIndex ?? 0) + 1;
        delete input.edidType;
        delete input.edidIndex;
    }
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


// Resolves the EDID string an input is currently presenting to its source,
// i.e. the value reported in the ied<n> block.
const resolveInputEDID = (input) => {
    const slot = (input.edidData ?? 1) - 1;
    switch (input.edidMode) {
        case EDID_MODE.USER: return intnernalState.edidConfig.user[slot]?.value    ?? "";
        case EDID_MODE.HDMI: return intnernalState.HDMIOutputs[slot]?.edid         ?? "Unplug";
        case EDID_MODE.HDBT: return intnernalState.HDBTOutputs[slot]?.edid         ?? "Unplug";
        default:             return intnernalState.edidConfig.default[slot]?.value ?? "";
    }
}

// edid_d in<N>   mode=<0-3> data=<1-8>   assign an EDID to input N
// edid_d user<N> mode=<2|3> data=<1-8>   copy an output's EDID into user slot N
const handleEdidCommand = async (commandArray) => {
    const operation = commandArray[0].charAt(commandArray[0].length - 1);
    if (operation !== "d") return false; // "l" (lock) / "s" (save) not emulated

    const target = commandArray[1];
    const mode   = parseInt(commandArray[2]?.split("=")[1], 10);
    const data   = parseInt(commandArray[3]?.split("=")[1], 10);
    const port   = parseInt(target.replace(/^(in|user)/, ""), 10);
    if (!(port >= 1 && port <= 8) || !(mode >= 0 && mode <= 3) || !(data >= 1 && data <= 8)) {
        return false;
    }

    if (target.startsWith("in")) {
        intnernalState.Inputs[port - 1].edidMode = mode;
        intnernalState.Inputs[port - 1].edidData = data;
    } else if (target.startsWith("user")) {
        // Only the copy-from-output modes are valid here
        if (mode === EDID_MODE.HDMI)      intnernalState.edidConfig.user[port - 1].value = intnernalState.HDMIOutputs[data - 1].edid;
        else if (mode === EDID_MODE.HDBT) intnernalState.edidConfig.user[port - 1].value = intnernalState.HDBTOutputs[data - 1].edid;
        else return false;
    } else {
        return false;
    }
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

// Port and scene names live inside a ';'-delimited response, and each field is
// introduced by ':', so those characters (and '#', the command separator) can
// never appear in a stored name. Non-ASCII is dropped: the device is ASCII-only.
// The stock web UI caps entry at 12 characters, but real units are seen holding
// longer names (e.g. "Presentation PC 1"), so cap generously rather than at 12.
const sanitiseName = (name) =>
    name.replace(/[^\u0020-\u007E]/g, "").replace(/[;:#]/g, "").substring(0, 20);

const renameScene = async (scene, name) => {
    intnernalState.Scenes[scene - 1] = sanitiseName(name);
    await storeSaveState(intnernalState);
    return true;
}

const handlePortRename = async (commandArray) => {
    // commandArray[1] is the target type and number (e.g. in1 or hdmi4).
   var targetType = commandArray[1].slice(0, -1);
   var targetPort = commandArray[1].charAt(commandArray[1].length-1);
   if (targetPort < 1 || targetPort > 8){ return false;}
   if(!["in","hdmi","hdbt"].includes(targetType)) {
    return false;
   }
   // Names may contain spaces ("Side Stage TV"), so rejoin every token after the
   // target instead of reading commandArray[2] alone.
   const nameArg = commandArray.slice(2).join(" ");
   if (!nameArg.startsWith("name=")) { return false; }
   let newName = sanitiseName(nameArg.substring("name=".length));
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
    if ( userIndex < 0 || userIndex >= 5 || !regex.test(userName) || !regex.test(password)) {
        return false;
    }
    intnernalState.Users[userIndex].username = userName;
    intnernalState.Users[userIndex].password = password;
    await storeSaveState(intnernalState);
    return true;
}

// register<N> id=<username> psd=<password>  — N is 0-based (slots 0-4)
const handleRegisterCommand = async (commandArray) => {
    const userIndex = parseInt(commandArray[0].substring("register".length), 10);
    const id  = commandArray[1]?.split("=")[1];
    const psd = commandArray[2]?.split("=")[1];
    if (Number.isNaN(userIndex) || id === undefined || psd === undefined) return false;
    return await changeUserLogin(userIndex, id, psd);
}

const generateStateStatusString = () => {
    var outputString = "";
    for(var i=1; i<=8; i++){ // Generate the Video Output status block
        outputString += "VO:" + i + "IN:" + intnernalState.HDMIOutputs[i-1].input + ";"
            // E:<input>M:<edid mode 0-3>D:<slot 1-8> — the EDID assigned to input i
            + "E:" + i + "M:" + intnernalState.Inputs[i-1].edidMode + "D:" + intnernalState.Inputs[i-1].edidData + ";"
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
    for(var i=1; i<=8; i++){ // Generate the EDID Input status block (resolved value each input presents)
        outputString += "ied" + i + ":" + resolveInputEDID(intnernalState.Inputs[i-1]) + ";";
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
    // Generate the HDBT Output info block
    outputString += "OUTHDBTPORT:"
    for(var i=1; i<=8; i++){
        outputString += "hpd="  + intnernalState.HDBTOutputs[i-1].hpd + ",";
        outputString += "sig="  + intnernalState.HDBTOutputs[i-1].signal + ",";
        outputString += "rat="  + intnernalState.HDBTOutputs[i-1].rat + ","; 
        outputString += "col="  + intnernalState.HDBTOutputs[i-1].col + ","; 
        outputString += "hdcp=" + intnernalState.HDBTOutputs[i-1].hdcp + ","; 
        outputString += "bit="  + intnernalState.HDBTOutputs[i-1].bit + ";";
    }
    // The real device does not terminate the response with a separator, so the
    // string splits into exactly 160 segments. Drop the trailing ';'.
    return outputString.slice(0, -1);
}

// const express = require('express');
// const internal = require('stream');
import express from 'express';
import stream from 'stream';
import bodyParser from 'body-parser';
import internal from 'stream';
import cors from 'cors';
const app = express();
const port = 3000;

// ── MIDDLEWARE ────────────────────────────────────────────────────────────────
// Registration order is the matching order: the first handler that matches a
// request answers it, so anything registered here runs before the routes below.
app.use(cors());
// JSON first (the /controller/* API), then treat every other content type as
// plain text: the device ignores Content-Type on /video.set and /ip.set.
app.use(express.json());
app.use(bodyParser.text({ type: () => true }));

// ── PAGE ROUTES ───────────────────────────────────────────────────────────────
//   /  and  /index.html   → the visualiser/controller
//   /simple.html          → the tile UI matching the Laravel and React Native builds
//   /original.html        → the real device's own web UI, captured from a live unit
//
// These are declared explicitly, and before express.static, so the URL each page
// answers on is stated here rather than left to static-file defaults.
const page = (file) => (req, res) => res.sendFile(resolve('public', file));

app.get(['/', '/index.html'], page('index.html'));
app.get('/simple.html',       page('simple.html'));
app.get('/original.html',     page('original.html'));

// Everything else in public/ — tile icons and any other asset — is served as-is.
app.use(express.static('public'));

// app.get('/all_dat.get*', cors(), (req, res) => {
app.get('/all_dat.get*', (req, res) => {
    let status = generateStateStatusString();
    // let status = 'OK';
    res.send(status);
    // console.log('sent status');
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
                handleEdidCommand(body);
                break;
            case body[0] === "lcd":
                break;
            case body[0].startsWith("group"):
                handleSceneCommand(body);
                break;
            case body[0].startsWith("register"): // register<N> — N is part of the token
                handleRegisterCommand(body);
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

// ── HARDWARE PROXY ────────────────────────────────────────────────────────────
// Forwards requests to a real hardware unit, avoiding browser CORS restrictions.
// The target base URL is passed as the `target` query parameter, e.g.:
//   GET /hw-proxy/all_dat.get?target=http%3A%2F%2F192.168.1.100
//   POST /hw-proxy/video.set?target=http%3A%2F%2F192.168.1.100

// Logging: /video.set is logged in full — it is the only channel that changes the
// device, it is fire-and-forget (the unit answers 200 even for a command it ignored,
// see API_SPEC.md §1.3), and it is low-volume. /all_dat.get is polled once a second
// per client, so it is logged only when it fails.
const hwLog = (...args) => console.log(`[hw-proxy ${new Date().toISOString()}]`, ...args);

app.get('/hw-proxy/all_dat.get', async (req, res) => {
    const target = req.query.target;
    if (!target) return res.status(400).send('Missing target parameter');
    try {
        const r = await fetch(`${target}/all_dat.get`);
        const text = await r.text();
        if (!r.ok) hwLog(`GET ${target}/all_dat.get -> ${r.status} ${r.statusText}`);
        res.status(r.status).send(text);
    } catch (e) {
        hwLog(`GET ${target}/all_dat.get -> FAILED: ${e.message}`);
        res.status(502).send(`Proxy error: ${e.message}`);
    }
});

app.post('/hw-proxy/video.set', async (req, res) => {
    const target = req.query.target;
    if (!target) return res.status(400).send('Missing target parameter');
    // req.body is a string (bodyParser.text), but an empty or JSON-typed body can
    // leave it as '' or an object — send the raw text either way.
    const body = typeof req.body === 'string' ? req.body : String(req.body ?? '');
    hwLog(`POST ${target}/video.set  body=${JSON.stringify(body)}`);
    if (!body.startsWith('#')) {
        hwLog('  WARNING: body has no leading "#". Hardware answers 200 and ignores it.');
    }
    try {
        const r = await fetch(`${target}/video.set`, {
            method: 'POST',
            headers: { 'Content-Type': 'text/plain' },
            body,
        });
        const text = await r.text();
        hwLog(`  -> ${r.status} ${r.statusText}${text ? ` body=${JSON.stringify(text)}` : ' (empty body)'}`);
        res.status(r.status).send(text);
    } catch (e) {
        hwLog(`  -> FAILED: ${e.message}`);
        res.status(502).send(`Proxy error: ${e.message}`);
    }
});

// ── Controller settings API ───────────────────────────────────────────────────
app.get('/controller/settings', (req, res) => {
    const settings = Object.fromEntries(
        controllerDb.prepare('SELECT key, value FROM settings').all().map(r => [r.key, r.value])
    );
    const labels = { inputs: {}, outputs: {}, scenes: {} };
    for (const row of controllerDb.prepare('SELECT type, idx, name FROM labels').all()) {
        if (labels[row.type]) labels[row.type][row.idx] = row.name;
    }
    res.json({ settings, labels });
});

app.post('/controller/settings', (req, res) => {
    const { settings, labels } = req.body || {};
    if (settings) {
        const stmt = controllerDb.prepare('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)');
        for (const key of ['matrix_ip', 'matrix_port']) {
            if (key in settings) stmt.run(key, String(settings[key]));
        }
    }
    if (labels) {
        const stmt = controllerDb.prepare('INSERT OR REPLACE INTO labels (type, idx, name) VALUES (?, ?, ?)');
        for (const [type, entries] of Object.entries(labels)) {
            if (!['inputs', 'outputs', 'scenes'].includes(type)) continue;
            for (const [idx, name] of Object.entries(entries)) {
                stmt.run(type, parseInt(idx), String(name).substring(0, 50));
            }
        }
    }
    res.json({ ok: true });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}. Open on http://localhost:${port}`);
})