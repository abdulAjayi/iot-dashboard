const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

function authHeaders(token) {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

// Verify PIN before shutting well
export async function verifyPin(pin, token) {
  const res = await fetch(`${API_URL}/auth/verify-pin`, {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify({ pin }),
  });
  const data = await res.json();
  console.log(data);

  if (!res.ok) throw new Error(data.error);
  return data;
}

// Request OTP for PIN reset
export async function requestOTP(token) {
  const res = await fetch(`${API_URL}/auth/request-otp`, {
    method: "POST",
    headers: authHeaders(token),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error);
  return data;
}

// Verify OTP entered by admin
export async function verifyOTP(otp, token) {
  const res = await fetch(`${API_URL}/auth/verify-otp`, {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify({ otp }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error);
  return data;
}

// Set new PIN after OTP verified
export async function setNewPin(pin, token) {
  const res = await fetch(`${API_URL}/auth/set-pin`, {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify({ pin }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error);
  return data;
}
