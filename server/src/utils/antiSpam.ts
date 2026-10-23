import type { Request } from "express";

type AttemptState = {
    count: number;
    firstSeen: number;
    blockedUntil?: number;
};

const WINDOW_MS = 15 * 60 * 1000;
const MAX_FAILED_ATTEMPTS = 5;
const BLOCK_DURATION_MS = 15 * 60 * 1000;

const failedAttempts = new Map<string, AttemptState>();

function normalizeEmail(email?: string): string {
    return typeof email === "string" ? email.trim().toLowerCase() : "";
}

function getClientIp(req: Request): string {
    const forwarded = req.headers["x-forwarded-for"];
    const ip = Array.isArray(forwarded)
        ? forwarded[0]
        : typeof forwarded === "string"
            ? forwarded.split(",")[0].trim()
            : req.socket.remoteAddress ?? "unknown";

    return String(ip || "unknown");
}

function pruneExpired(key: string): void {
    const state = failedAttempts.get(key);
    if (!state) {
        return;
    }

    if (state.blockedUntil && state.blockedUntil <= Date.now()) {
        failedAttempts.delete(key);
        return;
    }

    if (state.firstSeen + WINDOW_MS <= Date.now()) {
        failedAttempts.delete(key);
    }
}

function getState(key: string): AttemptState | undefined {
    pruneExpired(key);
    return failedAttempts.get(key);
}

function setState(key: string, state: AttemptState): void {
    failedAttempts.set(key, state);
}

function clearState(key: string): void {
    failedAttempts.delete(key);
}

export function checkAntiSpam(req: Request, email?: string): { allowed: boolean; message?: string } {
    const emailKey = normalizeEmail(email);
    const keys = [`ip:${getClientIp(req)}`];

    if (emailKey) {
        keys.push(`email:${emailKey}`);
    }

    for (const key of keys) {
        const state = getState(key);

        if (!state) {
            continue;
        }

        if (state.blockedUntil && state.blockedUntil > Date.now()) {
            return {
                allowed: false,
                message: "Vui lòng thử lại sau 15 phút",
            };
        }

        if (state.firstSeen + WINDOW_MS <= Date.now()) {
            clearState(key);
        }
    }

    return { allowed: true };
}

export function recordFailedAttempt(req: Request, email?: string): void {
    const emailKey = normalizeEmail(email);
    const keys = [`ip:${getClientIp(req)}`];

    if (emailKey) {
        keys.push(`email:${emailKey}`);
    }

    for (const key of keys) {
        const current = getState(key) ?? {
            count: 0,
            firstSeen: Date.now(),
        };

        current.count += 1;
        current.firstSeen = current.firstSeen || Date.now();

        if (current.count >= MAX_FAILED_ATTEMPTS) {
            current.blockedUntil = Date.now() + BLOCK_DURATION_MS;
            console.warn(`Anti-spam: khóa tạm thời key=${key} trong ${BLOCK_DURATION_MS / 1000} giây`);
        }

        setState(key, current);
    }
}

export function clearSuccessfulAttempt(req: Request, email?: string): void {
    const emailKey = normalizeEmail(email);
    const keys = [`ip:${getClientIp(req)}`];

    if (emailKey) {
        keys.push(`email:${emailKey}`);
    }

    for (const key of keys) {
        clearState(key);
    }
}
