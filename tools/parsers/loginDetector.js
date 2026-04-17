function detectLogin(content) {
  const lower = content.toLowerCase();

  const signals = [];

  if (lower.includes("username") && lower.includes("password")) {
    signals.push("LOGIN FORM DETECTED");
  }

  if (lower.includes("forgot password")) {
    signals.push("PASSWORD RESET FEATURE");
  }

  if (lower.includes("login")) {
    signals.push("AUTH ENDPOINT LIKELY");
  }

  if (lower.includes("sign in")) {
    signals.push("SIGN-IN PAGE DETECTED");
  }

  return signals.length ? signals : ["NO LOGIN INDICATORS"];
}

module.exports = { detectLogin };