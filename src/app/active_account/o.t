import express from "express";
import fs from "fs";
import https from "https";
import http from "http";
import { createProxyMiddleware } from "http-proxy-middleware";

const app = express();

// SSL paths (already on VPS)
const sslPath = "/root/Desktop/ssl/billwinslow.top"; // adjust if not root
const options = {
  key: fs.readFileSync(`${sslPath}/private.key`),
  cert: fs.readFileSync(`${sslPath}/certificate.crt`),
  ca: fs.readFileSync(`${sslPath}/ca_bundle.crt`),
};

// Host-based proxy routing
app.use((req, res, next) => {
  const host = req.headers.host;

  if (host === "billwinslow.top" || host === "www.billwinslow.top") {
    // Frontend (Next.js)
    return createProxyMiddleware({
      target: "http://localhost:3000",
      changeOrigin: true,
      ws: true,
    })(req, res, next);

  } else if (host === "node.billwinslow.top") {
    // Node backend
    return createProxyMiddleware({
      target: "http://14.225.192.76:3069",
      changeOrigin: true,
      ws: true,
    })(req, res, next);

  } else if (host === "nest.billwinslow.top") {
    // NestJS backend
    return createProxyMiddleware({
      target: "http://14.225.192.76:3091",
      changeOrigin: true,
      ws: true,
    })(req, res, next);
  }

  // Unknown domain
  res.writeHead(404);
  res.end("Unknown host");
});

// HTTPS
https.createServer(options, app).listen(443, () => {
  console.log("🔒 HTTPS proxy running for:");
  console.log("→ billwinslow.top → localhost:3000 (Next.js)");
  console.log("→ node.billwinslow.top → 14.225.192.76:3069 (Express)");
  console.log("→ nest.billwinslow.top → 14.225.192.76:3091 (NestJS)");
});

// HTTP → HTTPS redirect
http.createServer((req, res) => {
  res.writeHead(301, { Location: "https://" + req.headers.host + req.url });
  res.end();
}).listen(80, () => {
  console.log("🌐 Redirecting HTTP → HTTPS");
});
