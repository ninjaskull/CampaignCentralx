
import express, { type Express } from "express";
import fs from "fs";
import path from "path";
import { createServer as createViteServer, createLogger } from "vite";
import { type Server } from "http";
import viteConfig from "../vite.config";

const viteLogger = createLogger();

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

export function serveStatic(app: Express) {
  // In production, serve static files from dist/public
  const publicDir = path.join(process.cwd(), 'dist', 'public');
  const indexPath = path.join(publicDir, 'index.html');
  
  log(`Attempting to serve static files from: ${publicDir}`, "express");
  
  // Check if the public directory exists
  if (!fs.existsSync(publicDir)) {
    log(`Public directory not found: ${publicDir}`, "express");
    
    // Fallback: try to serve from current directory structure
    const fallbackPublicDir = path.join(process.cwd(), 'public');
    const fallbackIndexPath = path.join(process.cwd(), 'index.html');
    
    if (fs.existsSync(fallbackPublicDir)) {
      log(`Using fallback public directory: ${fallbackPublicDir}`, "express");
      app.use(express.static(fallbackPublicDir));
    }
    
    // Catch-all handler
    app.get('*', (req, res) => {
      if (fs.existsSync(fallbackIndexPath)) {
        res.sendFile(fallbackIndexPath);
      } else if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
      } else {
        res.status(404).send('Application not found - no index.html file found');
      }
    });
    
    return;
  }
  
  // Serve static files from the public directory
  app.use(express.static(publicDir));
  
  // Catch-all handler for SPA routing
  app.get('*', (req, res) => {
    if (fs.existsSync(indexPath)) {
      res.sendFile(indexPath);
    } else {
      res.status(404).send('Application not found - index.html missing');
    }
  });
}

export async function setupVite(app: Express, server: Server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true,
  };

  const vite = await createViteServer({
    ...viteConfig,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      },
    },
    server: serverOptions,
    appType: "custom",
  });

  app.use(vite.middlewares);
  
  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;

    try {
      // Use process.cwd() instead of import.meta.dirname
      const clientTemplate = path.join(process.cwd(), "client", "index.html");

      if (!fs.existsSync(clientTemplate)) {
        throw new Error(`Template file not found: ${clientTemplate}`);
      }

      let template = fs.readFileSync(clientTemplate, "utf-8");
      template = await vite.transformIndexHtml(url, template);

      res.status(200).set({ "Content-Type": "text/html" }).end(template);
    } catch (e) {
      const err = e as Error;
      vite.ssrFixStacktrace(err);
      log(`Error serving ${url}: ${err.message}`, "vite");
      next(err);
    }
  });
}
