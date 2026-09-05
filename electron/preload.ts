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
};

contextBridge.exposeInMainWorld("electronAPI", electronAPI);

export type ElectronAPI = typeof electronAPI;
