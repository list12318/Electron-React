export function elMessage(data) {
  const { title, subTitle } = data;

  new Notification(title, { body: subTitle, silent: false });
}
