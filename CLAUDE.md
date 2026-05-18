# aimharder-bot

Scripts to auto-book/cancel sport classes at aimharder.com. Bun + TypeScript.

## Stack
- Runtime: Bun
- Language: TypeScript
- Containerized with Docker + Windscribe VPN (Spain endpoint)

## Project structure
- `scripts/auth.ts` — login helper, returns cookies
- `scripts/book.ts` — book a class by day + time + className
- `scripts/cancel.ts` — cancel a booking by bookingId
- `start.sh` — container entrypoint (VPN connect → run script)

## Gym config
- Box: CrossFit Ruzafa (subdomain: `crossfitruzafa`, boxId: `9046`)
- Set via env vars: `email`, `password`, `boxSubdomain`, `boxId`, `day`, `time`, `className`, `bookingId`

## API endpoints
- Login: POST `https://login.aimharder.com/` (form: `mail`, `pw`, `login`, `loginiframe`)
- List classes: GET `https://{boxSubdomain}.aimharder.com/api/bookings?day=YYYYMMDD&familyId=&box={boxId}&_={timestamp}`
- Book: POST `https://{boxSubdomain}.aimharder.com/api/book` (form: `id`, `day`, `insist`, `familyId`)
- Cancel: POST `https://{boxSubdomain}.aimharder.com/api/cancelBook` (form: `id`, `late`, `familyId`)

## Auth
- Login uses `redirect: manual` to intercept Set-Cookie before redirect
- Cookies from `login.aimharder.com` are forwarded to `{boxSubdomain}.aimharder.com`

## Process
- Keep `CHANGELOG.md` updated whenever implementation status changes (new files created, features done, phases completed)

## Time format
- `timeid` field format: `"HHMM_DURATION"` (e.g. `"2000_60"`)
- User input accepts `"20:00"` or `"20.00"`, parsed to `"2000"` for matching
