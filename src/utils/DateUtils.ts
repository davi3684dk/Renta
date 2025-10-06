export function formatTime(date: Date) {
  return date.toLocaleTimeString("en-GB", { hour: "numeric", minute: "2-digit" });
}

export function formatDate(date: Date) {
  return date.toLocaleDateString("en-GB", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}