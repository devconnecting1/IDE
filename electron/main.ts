import { app, BrowserWindow, shell } from "electron";

import * as child_process from "node:child_process";
import * as path from "node:path";

const isDev = !app.isPackaged;

let mainWindow: BrowserWindow | null = null;
let nextServer: child_process.ChildProcess | null = null;

const DEV_URL = "http://localhost:3000";
const PROD_PORT = 3089;
const PROD_URL = `http://localhost:${PROD_PORT}`;

function startNextServer(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (isDev) {
      resolve();
      return;
    }

    const nextPath = path.join(__dirname, "../node_modules/.bin/next");
    const standalonePath = path.join(__dirname, "../.next/standalone/server.js");

    nextServer = child_process.spawn("node", [standalonePath], {
      env: { ...process.env, PORT: String(PROD_PORT) },
      stdio: "pipe",
    });

    nextServer.on("error", (err) => {
      console.error("Next.js server error:", err);
      reject(err);
    });

    nextServer.stderr?.on("data", (data: Buffer) => {
      const output = data.toString();
      if (output.includes("Ready") || output.includes("started")) {
        resolve();
      }
    });

    setTimeout(resolve, 3000);
  });
}

function createWindow(): void {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    title: "Studio Admin",
    icon: path.join(__dirname, "../public/favicon.ico"),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      spellcheck: false,
      preload: path.join(__dirname, "preload.js"),
    },
    titleBarStyle: "hiddenInset",
    trafficLightPosition: { x: 16, y: 16 },
    show: false,
  });

  const url = isDev ? DEV_URL : PROD_URL;
  mainWindow.loadURL(url);

  if (isDev) {
    mainWindow.webContents.openDevTools({ mode: "detach" });
  }

  mainWindow.once("ready-to-show", () => {
    mainWindow?.show();
  });

  mainWindow.on("closed", () => {
    mainWindow = null;
  });

  mainWindow.webContents.setWindowOpenHandler(({ url }: { url: string }) => {
    shell.openExternal(url);
    return { action: "deny" as const };
  });
}

app.whenReady().then(async () => {
  await startNextServer();
  createWindow();
});

app.on("window-all-closed", () => {
  if (nextServer) {
    nextServer.kill();
  }
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
