export default class ColumnChart {
  
  chartHeight = 50;

  constructor({ data = [], label = '', link = '', value = 0, formatHeading = data => data } = {}) {
    this.data = data,
    this.label = label,
    this.link = link,
    this.value = value,
    this.formatHeading = formatHeading(value),
    this.render();
  }

  getTemplate() {
    let blockClass = 'column-chart';
    if (!this.data.length) {
      blockClass += ' column-chart_loading';
    }
    return `
      <div class="${blockClass}" style="--chart-height: ${this.chartHeight}">
        <div class="column-chart__title">
          ${this.label}
          ${this.getLink()}
        </div>
        <div class="column-chart__container">
          <div data-element="header" class="column-chart__header">${this.formatHeading}</div>
          ${this.getColumns()}
        </div>
      </div>
    `;
  }

  getColumns() {
    const maxValue = Math.max(...this.data);
    const scale = this.chartHeight / maxValue;

    const element = document.createElement("div");
    element.classList.add('column-chart__chart');
    element.dataset.element ="body";
    this.data.forEach((column) => {
      const tooltip = (column / maxValue * 100).toFixed(0);
      const val = Math.floor(column * scale);
      element.innerHTML +=`<div style="--value: ${Math.round(val)}" data-tooltip="${Math.round(tooltip)}%"></div>`;
    });
    return element.outerHTML;
  }

  getLink() {
    if (this.link.length) {
      const link = document.createElement("a");
      link.classList.add('column-chart__link');
      link.href = this.link;
      link.textContent = 'View all';
      return link.outerHTML;
    }
    return '';
  }

  render() {
    const element = document.createElement("div"); //(*)

    element.innerHTML = this.getTemplate();

    //NOTE: в этой строке мы избавимся от обертки-пустышки в виде div
    // которой мы создали на строке (*)
    this.element = element.firstElementChild;
  }

  update(newData) {
    this.data = newData;
    this.render();
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
    //NOTE: удаляем обработчики событий, если они есть
  }
}

