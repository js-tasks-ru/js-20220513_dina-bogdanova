export default class NotificationMessage {
  static active;

  element;

  constructor(message = '', { duration = '', type = 'success' } = {}) {
    this.message = message,
    this.duration = duration,
    this.type = type,
    this.render();
  }

  getTemplate() {
    const value = this.duration / 1000;
    return `
      <div class="notification ${this.type}" style="--value:${value}s">
        <div class="timer"></div>
        <div class="inner-wrapper">
          <div class="notification-header">${this.type}</div>
          <div class="notification-body">
            ${this.message}
          </div>
        </div>
      </div>
    `;
  }

  render() {
    const element = document.createElement("div"); //(*)
    element.innerHTML = this.getTemplate();

    //NOTE: в этой строке мы избавимся от обертки-пустышки в виде div
    // которой мы создали на строке (*)
    this.element = element.firstElementChild;
  }

  show(block = document.body) {
    if (NotificationMessage.active) {
      NotificationMessage.active.remove();
    }

    block.append(this.element);

    this.timerId  = setTimeout(() => {
      this.remove();
    }, this.duration);

    NotificationMessage.active = this;

  }

  remove() {
    clearTimeout(this.timerId);
    this.element.remove();
  }

  destroy() {
    NotificationMessage.active = null;
    this.remove();
    //NOTE: удаляем обработчики событий, если они есть
  }


}
