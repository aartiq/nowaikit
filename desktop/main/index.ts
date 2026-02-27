import { app, BrowserWindow, ipcMain, shell, dialog } from 'electron';
import { join } from 'path';
import { existsSync } from 'fs';
import { ServerManager } from './server-manager';
import { ConfigStore } from './config-store';

const isDev = process.argv.includes('--dev');
let mainWindow: BrowserWindow | null = null;
const serverManager = new ServerManager();
const configStore = new ConfigStore();

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 900,
    minHeight: 600,
    title: 'NowAIKit',
    icon: join(__dirname, '..', '..', 'resources', 'icon.png'),
    webPreferences: {
      preload: join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
    },
    titleBarStyle: process.platform === 'darwin' ? 'hiddenInset' : 'default',
    show: false,
  });

  mainWindow.once('ready-to-show', () => {
    mainWindow?.show();
  });

  if (isDev) {
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools({ mode: 'detach' });
  } else {
    mainWindow.loadFile(join(__dirname, '..', '..', 'renderer', 'dist', 'index.html'));
  }

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// ─── App lifecycle ───────────────────────────────────────────────────────────

app.whenReady().then(() => {
  createWindow();
  registerIpcHandlers();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  serverManager.stopAll();
  if (process.platform !== 'darwin') app.quit();
});

// ─── IPC Handlers ────────────────────────────────────────────────────────────

function registerIpcHandlers() {
  // ── Config ──
  ipcMain.handle('config:get', (_event, key: string) => {
    return configStore.get(key);
  });

  ipcMain.handle('config:set', (_event, key: string, value: unknown) => {
    configStore.set(key, value);
  });

  ipcMain.handle('config:getAll', () => {
    return configStore.getAll();
  });

  // ── Instances ──
  ipcMain.handle('instances:list', () => {
    return configStore.getInstances();
  });

  ipcMain.handle('instances:add', (_event, instance: InstanceConfig) => {
    return configStore.addInstance(instance);
  });

  ipcMain.handle('instances:remove', (_event, name: string) => {
    return configStore.removeInstance(name);
  });

  ipcMain.handle('instances:test', async (_event, instance: InstanceConfig) => {
    return serverManager.testConnection(instance);
  });

  // ── Server ──
  ipcMain.handle('server:start', async (_event, instanceName?: string) => {
    const instances = configStore.getInstances();
    const instance = instanceName
      ? instances.find(i => i.name === instanceName)
      : instances[0];

    if (!instance) return { success: false, error: 'No instance configured' };
    return serverManager.start(instance);
  });

  ipcMain.handle('server:stop', async () => {
    serverManager.stopAll();
    return { success: true };
  });

  ipcMain.handle('server:status', () => {
    return serverManager.getStatus();
  });

  // ── Tools ──
  ipcMain.handle('tools:list', async () => {
    return serverManager.listTools();
  });

  ipcMain.handle('tools:execute', async (_event, toolName: string, args: Record<string, unknown>) => {
    return serverManager.executeTool(toolName, args);
  });

  // ── Audit Log ──
  ipcMain.handle('audit:getLogs', async (_event, limit?: number) => {
    return configStore.getAuditLogs(limit || 100);
  });

  // ── System ──
  ipcMain.handle('system:getVersion', () => {
    return { app: app.getVersion(), electron: process.versions.electron, node: process.versions.node };
  });

  ipcMain.handle('system:openExternal', (_event, url: string) => {
    shell.openExternal(url);
  });

  ipcMain.handle('system:selectDirectory', async () => {
    if (!mainWindow) return null;
    const result = await dialog.showOpenDialog(mainWindow, { properties: ['openDirectory'] });
    return result.canceled ? null : result.filePaths[0];
  });

  ipcMain.handle('system:getServerPath', () => {
    // In packaged app, server is in resources/server/
    const packagedPath = join(process.resourcesPath, 'server', 'server.js');
    const devPath = join(__dirname, '..', '..', 'dist', 'server.js');
    return existsSync(packagedPath) ? packagedPath : devPath;
  });
}

// ─── Types ───────────────────────────────────────────────────────────────────

export interface InstanceConfig {
  name: string;
  instanceUrl: string;
  authMethod: 'basic' | 'oauth';
  username?: string;
  password?: string;
  clientId?: string;
  clientSecret?: string;
  toolPackage?: string;
  writeEnabled?: boolean;
  nowAssistEnabled?: boolean;
}
