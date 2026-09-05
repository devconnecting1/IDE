import { contextBridge, ipcRenderer } from "electron";

const electronAPI = {
  setTitle: (title: string): void => {
    ipcRenderer.send("set-title", title);
  },
  getVersion: (): Promise<string> => {
    return ipcRenderer.invoke("get-version");
  },
  onMenuClick: (callback: (action: string) => void): (() => void) => {
    const handler = (_event: unknown, action: string): void => {
      callback(action);
    };
    ipcRenderer.on("menu-click", handler as (...args: unknown[]) => void);
    return () => {
      ipcRenderer.removeListener("menu-click", handler as (...args: unknown[]) => void);
    };
  },
  readFile: (path: string): Promise<string> => {
    return ipcRenderer.invoke("read-file", path);
  },
  writeFile: (path: string, content: string): Promise<void> => {
    return ipcRenderer.invoke("write-file", path, content);
  },
  listDirectory: (path: string): Promise<{ name: string; path: string; isDir: boolean }[]> => {
    return ipcRenderer.invoke("list-directory", path);
  },
  createDirectory: (path: string): Promise<void> => {
    return ipcRenderer.invoke("create-directory", path);
  },
  deleteFile: (path: string): Promise<void> => {
    return ipcRenderer.invoke("delete-file", path);
  },
  fileExists: (path: string): Promise<boolean> => {
    return ipcRenderer.invoke("file-exists", path);
  },
  executeCommand: (
    command: string,
    cwd?: string,
  ): Promise<{ stdout: string; stderr: string; code: number; error?: string }> => {
    return ipcRenderer.invoke("execute-command", command, cwd);
  },
  executeCommandStreaming: (
    command: string,
    cwd?: string,
  ): Promise<{ stdout: string; stderr: string; code: number }> => {
    return ipcRenderer.invoke("execute-command-streaming", command, cwd);
  },
  onTerminalStdout: (callback: (data: string) => void): (() => void) => {
    const handler = (_event: unknown, data: string): void => {
      callback(data);
    };
    ipcRenderer.on("terminal:stdout", handler as (...args: unknown[]) => void);
    return () => {
      ipcRenderer.removeListener("terminal:stdout", handler as (...args: unknown[]) => void);
    };
  },
  onTerminalStderr: (callback: (data: string) => void): (() => void) => {
    const handler = (_event: unknown, data: string): void => {
      callback(data);
    };
    ipcRenderer.on("terminal:stderr", handler as (...args: unknown[]) => void);
    return () => {
      ipcRenderer.removeListener("terminal:stderr", handler as (...args: unknown[]) => void);
    };
  },
};

contextBridge.exposeInMainWorld("electronAPI", electronAPI);

export type ElectronAPI = typeof electronAPI;
