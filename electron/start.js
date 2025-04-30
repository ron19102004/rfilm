import { exec } from "child_process";
import http from "http";

function waitForPort(port, host = "localhost", timeout = 10000) {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();
    const check = () => {
      const req = http.get({ host, port }, () => {
        resolve();
      });
      req.on("error", () => {
        if (Date.now() - startTime > timeout) {
          reject(new Error(`Port ${port} not open after ${timeout}ms`));
        } else {
          setTimeout(check, 200); // Retry after 200ms
        }
      });
    };
    check();
  });
}

const httpServer = exec("npx http-server ./dist -p 2004");

waitForPort(2004)
  .then(() => {
    console.log("http-server is ready. Launching Electron...");
    const electronApp = exec("electron .");

    electronApp.on("exit", () => {
      httpServer.kill();
      process.exit();
    });

    httpServer.on("exit", () => {
      process.exit();
    });
  })
  .catch((err) => {
    console.error("Failed to start http-server:", err);
    httpServer.kill();
    process.exit(1);
  });
