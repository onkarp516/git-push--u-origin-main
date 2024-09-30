import logo from "@/assets/images/logo.png";

export function ShowNotification(title, body, icon = logo, sound = null) {
  const notification = {
    title,
    body,
    icon,
    urgency: "critical",
    sound,
    timeoutType: "never",
    silent: false,
    closeButtonText: "Close Button",
  };
  const myNotification = new window.Notification(
    notification.title,
    notification
  );

  myNotification.onclick = () => {
    console.log("Notification clicked");
  };
}
