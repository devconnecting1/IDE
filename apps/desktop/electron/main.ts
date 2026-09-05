import { app, BrowserWindow, shell, ipcMain } from "electron";
import * as path from "node:path";
import * as fs from "node:fs";
import { exec, spawn } from "node:child_process";

const isDev = !app.isPackaged;

let mainWindow: BrowserWindow | null = null;

function createWindow(): void {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    title: "Workspaacing",
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

  if (isDev) {
    mainWindow.loadURL("http://localhost:3000");
    mainWindow.webContents.openDevTools({ mode: "detach" });
  } else {
    mainWindow.loadURL("http://localhost:3000");
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

function registerIPC(): void {
  ipcMain.handle("get-version", () => app.getVersion());

  ipcMain.on("set-title", (_event, title: string) => {
    if (mainWindow) {
      mainWindow.setTitle(title);
    }
  });

  ipcMain.handle("read-file", async (_event, filePath: string) => {
    return fs.promises.readFile(filePath, "utf-8");
  });

  ipcMain.handle("write-file", async (_event, filePath: string, content: string) => {
    await fs.promises.writeFile(filePath, content, "utf-8");
  });

  ipcMain.handle("list-directory", async (_event, dirPath: string) => {
    const entries = await fs.promises.readdir(dirPath, { withFileTypes: true });
    return entries.map((entry) => ({
      name: entry.name,
      path: path.join(dirPath, entry.name),
      isDir: entry.isDirectory(),
    }));
  });

  ipcMain.handle("create-directory", async (_event, dirPath: string) => {
    await fs.promises.mkdir(dirPath, { recursive: true });
  });

  ipcMain.handle("delete-file", async (_event, filePath: string) => {
    const stat = await fs.promises.stat(filePath);
    if (stat.isDirectory()) {
      await fs.promises.rm(filePath, { recursive: true });
    } else {
      await fs.promises.unlink(filePath);
    }
  });

  ipcMain.handle("file-exists", async (_event, filePath: string) => {
    try {
      await fs.promises.access(filePath);
      return true;
    } catch {
      return false;
    }
  });

  ipcMain.handle("execute-command", async (_event, command: string, cwd?: string) => {
    return new Promise((resolve, reject) => {
      exec(command, { cwd: cwd || process.cwd() }, (error, stdout, stderr) => {
        resolve({
          stdout,
          stderr,
          code: error?.code ?? 0,
          error: error?.message,
        });
      });
    });
  });

  ipcMain.handle("execute-command-streaming", async (event, command: string, cwd?: string) => {
    return new Promise((resolve, reject) => {
      const child = spawn("sh", ["-c", command], {
        cwd: cwd || process.cwd(),
        stdio: ["ignore", "pipe", "pipe"],
      });

      let stdout = "";
      let stderr = "";

      child.stdout?.on("data", (data: Buffer) => {
        const line = data.toString();
        stdout += line;
        event.sender.send("terminal:stdout", line);
      });

      child.stderr?.on("data", (data: Buffer) => {
        const line = data.toString();
        stderr += line;
        event.sender.send("terminal:stderr", line);
      });

      child.on("close", (code) => {
        resolve({ stdout, stderr, code });
      });

      child.on("error", (error) => {
        reject(error.message);
      });
    });
  });
}

app.whenReady().then(() => {
  registerIPC();
  createWindow();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
