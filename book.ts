const CONFIG = {
  email: process.env.email!,
  password: process.env.password!,
  boxSubdomain: process.env.boxSubdomain!,
  classId: process.env.classId!,
  day: process.env.day!,
};

// --- login ---
async function login(): Promise<string> {
  const body = new URLSearchParams({
    mail: CONFIG.email,
    pw: CONFIG.password,
    login: "Iniciar sesión",
    loginiframe: "0",
  });

  const res = await fetch("https://login.aimharder.com/", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
    redirect: "manual",
  });

  const cookies = res.headers.getSetCookie();
  if (cookies.length === 0) {
    throw new Error(
      `Login failed — no cookies received (status ${res.status})`,
    );
  }

  return cookies.map((c) => c.split(";")[0]).join("; ");
}

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
  const cookies = await login();
  console.log("Logged in, cookies:", cookies);

  console.log(`Booking class ${CONFIG.classId} on ${CONFIG.day}...`);
  await bookClass(cookies);
}

main().catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});
