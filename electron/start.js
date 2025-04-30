import { exec } from "child_process";
// Chạy http-server
const httpServer = exec("npx http-server ./dist -p 2004");

// Chạy Electron
const electronApp = exec("electron .");

// Khi Electron bị đóng, tắt http-server
electronApp.on("exit", () => {
  httpServer.kill();
  process.exit();      // Dừng luôn terminal
});
httpServer.on("exit", () => {
  process.exit(); // Dừng luôn terminal khi http-server bị tắt
});
