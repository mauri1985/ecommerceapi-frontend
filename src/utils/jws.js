export function decodificarToken(token) {
  try {
    const payload = token.split(".")[1];
    const json = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export function tokenExpirado(token) {
  const payload = decodificarToken(token);
  if (!payload?.exp) return true;
  return Date.now() >= payload.exp * 1000;
}

export function msHastaExpirar(token) {
  const payload = decodificarToken(token);
  if (!payload?.exp) return 0;
  return payload.exp * 1000 - Date.now();
}
