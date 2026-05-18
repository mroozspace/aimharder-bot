# Changelog

## Project Overview (2026-05-17)

### ✅ Implemented

| File                | Status  | Description                                                                                                   |
| ------------------- | ------- | ------------------------------------------------------------------------------------------------------------- |
| `scripts/auth.ts`   | ✅ Done | Login function — POSTs credentials to `login.aimharder.com`, extracts cookies for session auth                |
| `scripts/book.ts`   | ✅ Done | CLI script that: logs in → fetches available classes via API → finds matching class by time & name → books it |
| `scripts/cancel.ts` | ✅ Done | CLI script that: logs in → cancels a booking by its booking ID                                                |
| `Dockerfile`        | ✅ Done | Docker image based on `oven/bun` with Windscribe VPN installed                                                |
| `start.sh`          | ✅ Done | Entrypoint script that starts Windscribe VPN, then runs `book.ts`                                             |
| `.env`              | ✅ Done | Configuration file with credentials, box settings, and Windscribe VPN credentials                             |

### ❌ Not Yet Implemented

The following features were planned (see `plan.md`) but have not been built:

| Feature                               | Details                                                                                                   |
| ------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| **`aimharder.ts`** — Shared API layer | Extract `findClassId`, `bookClass`, `cancelClass` into a shared module so both CLI and bot can reuse them |
| **`db.ts`** — SQLite persistence      | Store bookings and cron schedules using `bun:sqlite`                                                      |
| **`bot.ts`** — Telegram bot           | Telegram bot using `grammy` with commands: `/book`, `/cancel`, `/schedule`, `/unschedule`, `/list`        |
| **Cron scheduler**                    | Auto-book classes on a schedule using `croner`                                                            |
| **Nuxt.js server** (from `plan2.md`)  | A simple Nuxt.js server was mentioned but never started                                                   |

### Current Architecture

The project currently works as **standalone CLI scripts** run inside a Docker container with Windscribe VPN. The flow is:

1. Docker container starts → Windscribe VPN connects to Spain
2. `bun run scripts/book.ts` executes — logs in, finds a class, books it
3. Container exits

There is **no persistent storage**, **no server**, **no Telegram bot**, and **no scheduling** — just one-shot CLI execution.

### Dependencies

Only `@types/node` is in `devDependencies`. The runtime is **Bun**, which has built-in `fetch`, `URLSearchParams`, etc. — no extra runtime deps needed for the current scripts.

---

## Telegram Bot Phase (planning, 2026-05-18)

See `plan.md` for full details.

### New files to create

| File             | Purpose                                              |
| ---------------- | ---------------------------------------------------- |
| `aimharder.ts`   | Shared API layer (imports `login` from `scripts/auth.ts`) |
| `db.ts`          | SQLite persistence (bookings + schedules)             |
| `bot.ts`         | Telegram bot entry point (grammy + croner)            |

### New dependencies to install

| Package  | Purpose                |
| -------- | ---------------------- |
| `grammy` | Telegram bot framework |
| `croner` | Cron scheduler         |

### Existing files — untouched

`scripts/auth.ts`, `scripts/book.ts`, `scripts/cancel.ts` remain as-is.
