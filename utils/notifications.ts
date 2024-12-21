export function requestNotificationPermission() {
  if (Notification.permission !== "granted")
    Notification.requestPermission()
}

export function showNotification(title: string, body?: string, icon?: string) {
  if (Notification.permission === "granted") {
    new Notification(title, { body, icon })
  }
}

export function isSystemNofiticationsAllowed(): boolean {
  return Notification.permission === "granted";
}
