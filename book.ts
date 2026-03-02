import { login } from "./auth";

const CONFIG = {
  email: process.env.email!,
  password: process.env.password!,
  boxSubdomain: process.env.boxSubdomain!,
  boxId: process.env.boxId!,
  day: process.env.day!, // YYYYMMDD
  time: process.env.time!, // e.g. "20:00" or "20.00"
  className: process.env.className!,
};

function parseTime(time: string): string {
  const [h, m] = time.split(/[:.]/);
  return h.padStart(2, "0") + (m ?? "00");
}

async function findClassId(
  cookieHeader: string,
  day: string,
  time: string,
): Promise<string> {
  const url = `https://${CONFIG.boxSubdomain}.aimharder.com/api/bookings?day=${day}&familyId=&box=${CONFIG.boxId}&_=${Date.now()}`;
  const res = await fetch(url, { headers: { Cookie: cookieHeader } });
  const data = await res.json();

  const bookings: any[] = data.bookings ?? [];
  const match = bookings.find(
    (b) =>
      b.timeid?.startsWith(time) &&
      b.className.toLowerCase().includes(CONFIG.className.toLowerCase()),
  );
  if (!match) {
    throw new Error(
      `No class found at ${time} on ${day} at ${CONFIG.className}`,
    );
  }
  return String(match.id);
}

async function bookClass(
  cookieHeader: string,
  classId: string,
  day: string,
): Promise<void> {
  const body = new URLSearchParams({
    id: classId,
    day,
    insist: "0",
    familyId: "",
  });

  const res = await fetch(
    `https://${CONFIG.boxSubdomain}.aimharder.com/api/book`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Cookie: cookieHeader,
      },
      body: body.toString(),
    },
  );

  const data = await res.json();
  console.log("Booking response succeed:", Boolean(data?.bookState));
}

async function main() {
  const time = parseTime(CONFIG.time);

  console.log("Logging in...");
  const cookies = await login(CONFIG.email, CONFIG.password);

  console.log(`Finding class at ${time} on ${CONFIG.day}...`);
  const classId = await findClassId(cookies, CONFIG.day, time);
  console.log(`Found class ${classId}, booking...`);

  await bookClass(cookies, classId, CONFIG.day);
}

main().catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});
