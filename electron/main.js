import { app, BrowserWindow, screen } from 'electron';
function createWindow() {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize; // 👈 Lấy kích thước màn hình trừ taskbar
  const win = new BrowserWindow({
    width: width,
    height: height,
    title:"RFilm",
    icon:"public/filmlogov3_round.ico",
    autoHideMenuBar: true,
    menuBarVisible: false, 
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  });  // Sử dụng URL chính xác cho ứng dụng web (React app) khi đang chạy server (http-server)
  win.loadURL("http://localhost:2004");
}

app.whenReady().then(() => {
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
