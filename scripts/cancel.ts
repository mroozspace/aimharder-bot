const CONFIG = {
  email: process.env.email!,
  password: process.env.password!,
  boxSubdomain: process.env.boxSubdomain!,
  bookingId: process.env.bookingId!, // the booking instance ID (not the class ID)
};

import { login } from "./auth";

// --- cancel ---
async function cancelClass(cookieHeader: string): Promise<void> {
  const body = new URLSearchParams({
    id: CONFIG.bookingId,
    late: "0",
    familyId: "",
  });

  const res = await fetch(
    `https://${CONFIG.boxSubdomain}.aimharder.com/api/cancelBook`,
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
  console.log("Cancel response:", data);
}

// --- main ---
async function main() {
  console.log("Logging in...");
  const cookies = await login(CONFIG.email, CONFIG.password);
  console.log("Logged in, cookies:", cookies);

  console.log(`Cancelling booking ${CONFIG.bookingId}...`);
  await cancelClass(cookies);
}

main().catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});
