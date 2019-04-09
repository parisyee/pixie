import {
  app,
  BrowserWindow,
  ipcMain,
  Tray,
  nativeImage
} from 'electron';
import installExtension, { REACT_DEVELOPER_TOOLS } from 'electron-devtools-installer';
import { enableLiveReload } from 'electron-compile';

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;
let tray;

const isDevMode = process.execPath.match(/[\\/]electron/);

if (isDevMode) enableLiveReload({strategy: 'react-hmr'});

const createTray = async () => {
  let icon = nativeImage.createFromDataURL(base64Icon);
  tray = new Tray(icon);
  
  tray.on('click', (event) => {
    toggleWindow();

    // might not need this
    if (mainWindow.isVisible() && process.defaultApp && event.metaKey) {
      mainWindow.openDevTools({mode: 'detach'});
    }
  })
}

const createWindow = async () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    show: false,
    frame: false,
    // resizable: false,
  });

  // and load the index.html of the app.
  mainWindow.loadURL(`file://${__dirname}/index.html`);

  // Open the DevTools.
  if (isDevMode) {
    await installExtension(REACT_DEVELOPER_TOOLS);
    mainWindow.webContents.openDevTools();
  }

    // Only close the window on blur if dev tools isn't opened
  mainWindow.on('blur', () => {
    if(!mainWindow.webContents.isDevToolsOpened()) {
      mainWindow.hide();
    }
  });
};

const toggleWindow = () => {
  if (mainWindow.isVisible()) {
    mainWindow.hide();
  } else {
    showWindow();
  }
}

const showWindow = () => {
  const trayPos = tray.getBounds();
  const windowPos = mainWindow.getBounds();
  let x, y = 0;
  if (process.platform == 'darwin') {
    x = Math.round(trayPos.x + (trayPos.width / 2) - (windowPos.width / 2));
    y = Math.round(trayPos.y + trayPos.height);
  } else {
    x = Math.round(trayPos.x + (trayPos.width / 2) - (windowPos.width / 2));
    y = Math.round(trayPos.y + trayPos.height * 10);
  }


  mainWindow.setPosition(x, y, false);
  mainWindow.show();
  mainWindow.focus();
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  createTray();
  createWindow();
});

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

let base64Icon = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAFn0lEQVRYhe2Xy28jWRXGf7eqbpXL5UcSO2nHCZ3OozWk01LTDSyYBQ8JEBILZoMQaNazYIPUrBGw5g9gzyIbGPGQeoNYjBCzaCE6JA4LUHfjmHHasWPHqbFd77osOi6SzJDOYtAsmCNd3aqrW+d89zvnnnNKKKX4OEX7WK1/AuATAB8FACHEO5ffhRCcH/8TAEKIohDiZ0BRCNEXQighxF+BIvAjwLqWHqXUBZTXyQtCiCLwl/v379+uVqukaYpSijAMsW2bbrfL7u7ub4E3XqXTuMLIN4HPX1r+s1LqEfDzu3fv3l5ZWSEIAlZXV0nTFE3TaDabrK2tcXJy8q1Wq/Vt4JdXHuYyA8A7wJeBn2xvb/+40+nQ6XSo1Wo8fPhwG1iq1Wpfmp+fZzKZEEURSZIw1WMYBlJK0jTl+fPnA+At4O3LhqesnGdArKysfLfb7a5LKUee5zn7+/s8ffqUZ8+esb6+jmVZ31teXqZYLDIYDCgUCmxtbdHv91laWsL3farVKnt7e/R6PR48eDDXbrd/dXR0BLAHfB94978xkCuXy56u6+TzeZIkIY5jDMMgl8shpaRarWKaJu12G03T0HWdYrGI7/uZQsMwiOMY3/dxHIdSqYRpmrx48YJGo+EDXwXenTJwHsBspVIZbG1tEYYhSZKg6zqO4zAcDhmPx4xGI5IkQdM0DMPAtm0sy0LTNDRNI01T0jQlCAI8zwPg3r17JEkCQKvVotFoNIHVD3MBp6enQT6ft2ZnZ7O4mEwmdLtdZmZmUEqhlELXdRYXFymVSszPz+M4Tnby8XhMr9fDdV06nQ6PHz/Gtm0qlQr1ep1Go3HrvM3zAPw4jq2ZmRkajQZhGBJFEVEUAbC5ucnOzg6u61Kv11lcXERKycHBAUdHRwRBgGVZ3Lhxg3q9juM4KKU4ODjA8zwODw85Pj6+HIsXAAQAhUIBwzBIkgQhBFEUEQRBBiqXyzE3N4fneew1GsSFZcqf/jqVeMAkiPhXv8eLJzvc3linUqnQ6/WIoihz1VUAUnh5PYrFIrZtMxgMUEqhaRq+76PrOuVymclkwkGrRWH1c0gixKRHdPpPpFmgUlsmsh7w9/3fsXLzUywuLhIEAYPBANM0rwSQied5xHEMQJIk2b02TRNd1xkOhyinhvRPUNGIUZASv9/HcBROXmDlSngrX2R4soNhGDiOQ6/Xy+LqfGbUpgvTRcuyMsO6rgNcmMMwxHVd5mpLiOh9xsM+o/4ho9GIkRcTazaz9Tq3vvANXNclDEN6vV4G/rJ8wCm6riOlREqZIdZ1/cJVC4IAaRVA2sTCIE5Sum9uo+VKpGlE5PmoWCMIAtI0JYoibNtGSnk9F1wWIUR2+ukpIr2EVlrD0m6QX5EU/vBT0skL0lOTUdtBuaOX+6IIz/MIw/CVQXglAClllvullJwOByy99jo3b9ZxO4cMhYYYBFgFjSgZctxsI6XE9302NjYyXc1m84Lua/UD08xnmmaWnsPmn7Dry5gzNcoLr1Hf+AzVpVWMXAEMC/+9JxiGQblcZmFhgc3NTdbW1j5Qmq/FwFQsyyJNUyaTCbZt849f/ICZz36HhfXXceZuMTo5oNPexes9IWdKxuMxxWKRfr9Pv9//UJ3GlGJAAM2Tk5NbU+qmNX7qOykllmURBAGu6+I4Dl7j17T2f5PtVWmKAFzXxTRNJpMJ/X4/qwdn9gSglFIXGHCAtx89evTDO3fukKYpruuiaRqe5xFFUdbjmaZJEAQcHx8jpUTXdYQQKKWI45g4jsnn8+RyOaIoIo5jhBCkaQrwtzNbI/hPNdSAm7zsgL4CfA3Y4KOT94AhsAv8Hvgj0FJKpefLcQFYBkxeBqd+NqdAAqizZ86eXyXTNuvy3ghoAyOl1IV+QJwb15Hziq/7zfS7rO6I//u/438Ddfu0RniiJVoAAAAASUVORK5CYII=`;
