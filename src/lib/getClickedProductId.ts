export function getClickedProductIds(): number[] {
  const cookie = document.cookie
    .split("; ")
    .find((c) => c.startsWith("clickedProductIds="));

  if (!cookie) return [];

  try {
    return JSON.parse(decodeURIComponent(cookie.split("=")[1]));
  } catch {
    return [];
  }
}
