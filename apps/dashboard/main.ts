const { app, BrowserWindow } = require("electron");
const todesktop = require("@todesktop/runtime");

todesktop.init();

function createWindow() {
    // Create the browser window.
    let win = new BrowserWindow({
        width: 800,
        height: 600,
    });

    // and load the index.html of the app.
    win.loadFile("index.html");
}

app.whenReady().then(createWindow);