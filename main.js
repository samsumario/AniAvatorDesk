const {app, BrowserWindow, screen, ipcMain} = require('electron');
const os = require('os');
const fs = require('fs');
let config = undefined;

function getCpuProcess() {
    // CPU information
    const cpus = os.cpus();
    console.log(cpus);

    // Memory information
    const totalMemory = os.totalmem();
    const freeMemory = os.freemem();
    console.log(`Total Memory: ${totalMemory}, Free Memory: ${freeMemory}`);

    // process Memory Info
    const processMemoryInfo = process.getProcessMemoryInfo();
    processMemoryInfo.then(memoryInfo => {
        console.log(memoryInfo);
    });
    
    return true;
}

function getDirname() {
    return __dirname;
}

async function readConfigFile(path) {
    return new Promise((resolve, reject) => {
        fs.readFile(path, 'utf8', (err, jsonString) => {
            if (err) {
                console.error('failed to read file:', err);
                resolve(err);
            }
            try {
                const data = JSON.parse(jsonString);
                config = data;
                resolve();
            } catch (err) {
                console.error('failed to parse JSON:', err);
                resolve(err);
            }
          });
    })
}

async function getConfig() {
    if(config) {
        return config["Renderer"];
    } else {
        await readConfigFile(__dirname + '/config.json');
        return config["Renderer"];
    }
}


app.on('ready', () => {
    var size = screen.getPrimaryDisplay().size;
    var preloadPath = __dirname +'/src/preload.js';
    
    mainWindow = new BrowserWindow({
                                    width: size.width-2,
                                    height: size.height-2,
                                    frame: false, 
                                    show: true,
                                    transparent: true,
                                    resizable: false,
                                    'always-on-top': true,
                                    webPreferences: {// for api
                                                        contextIsolation: true,
                                                        preload: preloadPath
                                                    }
                                    });
                                        
    mainWindow.setAlwaysOnTop(true, "screen-saver");
    mainWindow.setVisibleOnAllWorkspaces(true);
    mainWindow.setIgnoreMouseEvents(true);

    // set index.html path
    mainWindow.loadURL('file://' + __dirname + '/index.html');
    
    // read config.json file
    readConfigFile(__dirname + '/config.json');

    // debug
    const debug = true;

    if(debug) {
        // set mouse events
        mainWindow.setIgnoreMouseEvents(false);
        // open Chromium Devtool ignore transparent false
        mainWindow.webContents.openDevTools();
    }

    mainWindow.on('closed', function() {
        mainWindow = null;
    });

    // set channel handler
    ipcMain.handle('read:config', getConfig);
    ipcMain.handle('cpu:process', getCpuProcess);
    ipcMain.handle('util', getDirname);
});