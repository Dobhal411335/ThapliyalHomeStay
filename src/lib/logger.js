import winston from "winston";
import path from "path";
import fs from "fs";

const LOG_DIR = path.join(process.cwd(), "logs");

/* Ensure logs directory exists */
if (!fs.existsSync(LOG_DIR)) {
  fs.mkdirSync(LOG_DIR, { recursive: true });
}

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    winston.format.json(),
  ),
  transports: [
    /* Rotating auth log file */
    new winston.transports.File({
      filename: path.join(LOG_DIR, "auth.log"),
      maxsize: 5 * 1024 * 1024, // 5 MB
      maxFiles: 5,
      tailable: true,
    }),
    /* Console (dev only) */
    ...(process.env.NODE_ENV !== "production"
      ? [
          new winston.transports.Console({
            format: winston.format.combine(
              winston.format.colorize(),
              winston.format.printf(
                ({ level, message, timestamp, event }) =>
                  `${timestamp} [${level}] ${event || ""}: ${message}`,
              ),
            ),
          }),
        ]
      : []),
  ],
});

/* ── Log helpers ─────────────────────────────────── */

export function logLogin({ email, ip, userAgent, success, reason }) {
  const level = success ? "info" : "warn";
  /* NEVER log the password */
  logger.log(level, success ? "Admin login successful" : "Admin login failed", {
    event: success ? "LOGIN_SUCCESS" : "LOGIN_FAILED",
    email,
    ip,
    userAgent,
    reason: reason ?? null,
  });
}

export function logLogout({ email, ip, userAgent }) {
  logger.info("Admin logout", {
    event: "LOGOUT",
    email,
    ip,
    userAgent,
  });
}

export function logSessionExpired({ email, ip }) {
  logger.warn("Session expired", {
    event: "SESSION_EXPIRED",
    email,
    ip,
  });
}

export default logger;
