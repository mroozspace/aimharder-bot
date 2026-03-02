const CONFIG = {
  email: process.env.email!,
  password: process.env.password!,
  boxSubdomain: process.env.boxSubdomain!,
  classId: process.env.classId!,
  day: process.env.day!,
};

import { login } from "./auth";

// --- book ---
async function bookClass(cookieHeader: string): Promise<void> {
  const body = new URLSearchParams({
    id: CONFIG.classId,
    day: CONFIG.day,
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
  console.log("Booking response:", data);
}

// --- main ---
async function main() {
  console.log("Logging in...");
  const cookies = await login(CONFIG.email, CONFIG.password);
  console.log("Logged in, cookies:", cookies);

  console.log(`Booking class ${CONFIG.classId} on ${CONFIG.day}...`);
  await bookClass(cookies);
}

main().catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});
