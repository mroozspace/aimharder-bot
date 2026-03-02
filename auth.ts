export async function login(email: string, password: string): Promise<string> {
  const body = new URLSearchParams({
    mail: email,
    pw: password,
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
