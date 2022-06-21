export default class SortableTable {
  constructor(headersConfig = [], {
    data = [],
    sorted = {
      id: headersConfig.find(item, index => item.sortable),
      order: 'asc'
    }
  } = {}) {
    this.headersConfig = headersConfig,
    this.data = data,
    this.sorted = sorted,
    this.isSortLocally = true,
    this.render(this.sorted.id, this.sorted.order)
  }

  getTemplate() {
    return `
      <div data-element="productsContainer" class="products-list__container">
        <div class="sortable-table">
          ${this.getHeaders()}
          ${this.getBody()}
        </div>
      </div>
    `;
  }

  getHeaders() {
    const arr = [];
    this.headersConfig.forEach((item) => {
      arr.push(this.getOneHeader(item));
    });
    return `
    <div data-element="header" class="sortable-table__header sortable-table__row">
      ${arr.join('')}
    </div>
    `;
  }

  getOneHeader({id, title, sortable, sortType} = {}) {
    let resultBlock;
    if (sortable && id === this.sorted.id) {
      resultBlock = `
      <div class="sortable-table__cell" data-id="${this.sorted.id}" data-sortable="${sortable}" data-order="${this.sorted.order}">
        <span>${title}</span>
        <span data-element="arrow" class="sortable-table__sort-arrow">
          <span class="sort-arrow"></span>
        </span>
      </div>`
    }
    else {
      resultBlock = `
      <div class="sortable-table__cell" data-id="${id}" data-sortable="${sortable}">
        <span>${title}</span>
      </div>`
    }
    return resultBlock;
  }

  getBody() {
    const arr = [];
    this.data.forEach((item) => {
      arr.push(`<a href="#" class="sortable-table__row">${this.getOneRow(item)}</a>`);
    });
    return `
      <div data-element="body" class="sortable-table__body">
         ${arr.join('')}
      </div>
    `
  }

  getOneRow(item = {}) {

    const arr = [];
    this.headersConfig.forEach((header) => {
      const headersItem = {
        id: header.id,
        template: header.template
      }
      arr.push(headersItem);
    });

    let row = [];
    arr.forEach((header) => {
      if (header.template) {
        const r = header.template(item[header.id]);
        row.push(r);
      }
      else row.push(`<div class="sortable-table__cell">${item[header.id]}</div>`);
    });
    
    return row.join('');
  }

  render(id, order) {
    this.sort(id, order);
    const element = document.createElement("div"); //(*)
    element.innerHTML = this.getTemplate();
    
    //NOTE: в этой строке мы избавимся от обертки-пустышки в виде div
    // которой мы создали на строке (*)
    this.element = element.firstElementChild;
    this.subElements = this.getSubElements(element);
    this.initEventListeners() ;

  }

  getSubElements(element) {
    const result = {};
    const elements = element.querySelectorAll('[data-element]');

    for (const subElement of elements) {
      const name = subElement.dataset.element;

      result[name] = subElement;
    }

    return result;
  }

  remove() {
    if (this.element) {
      this.element.remove();
    }
  }

  destroy() {
    this.remove();
    this.element = null;
    this.subElements = {};
  }

  sort(id, orderValue = 'asc') {

    function compareNumbers(a, b, field) {
      a = a[field];
      b = b[field];
      return a - b;
    }

    function compare(a, b, field) {
      a = a[field];
      b = b[field];
      return a.localeCompare(b, ['ru', 'en'], { caseFirst: 'upper' });
      
    }

    let newArr = [...this.data];
    let sortType;
    let field; 
    let customSorting;

    this.headersConfig.forEach((header)=> {
      if (id === header.id) {
        sortType = header.sortType;
        field = header.id;
        customSorting = header.customSorting;
      }
    });

    if (sortType === 'number') {
      if (orderValue === 'asc') newArr.sort((a, b) => compareNumbers(a, b, field));
      else newArr.sort((a, b) => compareNumbers(b, a, field));
    }
    else if (sortType === 'string') {
      if (orderValue === 'asc') newArr.sort((a, b) => compare(a, b, field));
      else newArr.sort((a, b) => compare(b, a, field));
    }
    else if (sortType === 'custom') {
      if (orderValue === 'asc') customSorting(a, b);
      else customSorting(b, a);
    }

    
    this.data = newArr;

    if (this.subElements) {
      this.subElements.body.innerHTML = this.getBody();
      let column = this.subElements.header.querySelector(`[data-id='${id}']`);
      column.append(this.subElements.arrow);
      // this.subElements.header.innerHTML = this.getHeaders();
    }
  }

  initEventListeners() {
    const header = this.subElements.header;

    header.addEventListener('pointerdown', event => {
      let target = event.target;
      let headerCell = event.target.closest('div');
      if (headerCell && headerCell.dataset.sortable === "true" ) {
        let orderValue = "asc";
        if (headerCell.dataset.order) {
          if (headerCell.dataset.order === "asc") orderValue = "desc";
          else orderValue = "asc";
        }
        headerCell.dataset.order = orderValue;
        this.sorted.id = headerCell.dataset.id;
        this.sorted.order = orderValue;
        this.sort(headerCell.dataset.id, headerCell.dataset.order);
        
      }
    });
  }

}
