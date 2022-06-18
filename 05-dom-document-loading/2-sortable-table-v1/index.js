export default class SortableTable {
  constructor(headerConfig = [], data = []) {
    this.headerConfig = headerConfig,
    this.data = data,
    this.render();
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
    this.headerConfig.forEach((item) => {
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
    if (sortable) {
      resultBlock = `
      <div class="sortable-table__cell" data-id="${id}" data-sortable="${sortable}" data-order="asc">
        <span>${title}</span>
        <span data-element="arrow" class="sortable-table__sort-arrow">
          <span class="sort-arrow"></span>
        </span>
      </div>`
    }
    else {
      resultBlock = `
      <div class="sortable-table__cell" data-id="${id}" data-sortable="${sortable}" data-order="asc">
        <span>${title}</span>
      </div>`
    }
    return resultBlock;
  }

  getBody() {
    const arr = [];
    this.data.forEach((item) => {
      arr.push(this.getOneRow(item));
    });
    return `
      <div data-element="body" class="sortable-table__body">
         ${arr.join('')}
      </div>
    `
  }

  getOneRow({images, title, quantity, price, sales} = {}) {
    return `
      <a href="#" class="sortable-table__row">
        <div class="sortable-table__cell">
          <img class="sortable-table-image" alt="Image" src="${images[0].url}">
        </div>
        <div class="sortable-table__cell">${title}</div>
        <div class="sortable-table__cell">${quantity}</div>
        <div class="sortable-table__cell">${price}</div>
        <div class="sortable-table__cell">${sales}</div>
      </a>
    `
  }

  render() {
    const element = document.createElement("div"); //(*)
    element.innerHTML = this.getTemplate();
    
    //NOTE: в этой строке мы избавимся от обертки-пустышки в виде div
    // которой мы создали на строке (*)
    this.element = element.firstElementChild;
  }

  remove() {
    if (this.element) {
      this.element.remove();
      // delete this.element;
    }
  }

  destroy() {
    document.querySelector("#root").remove(this.element);
    this.remove();
    this.element = null;
  }

  sort(fieldValue, orderValue = 'asc') {

    function compareNumbers(a, b, fieldValue) {
      a = a[fieldValue];
      b = b[fieldValue];
      return a - b;
    }

    function compare(a, b, fieldValue) {
      a = a[fieldValue];
      b = b[fieldValue];
      return a.localeCompare(b, ['ru', 'en'], { caseFirst: 'upper' });
    }

    let newArr = [...this.data];
    let sortType;

    this.headerConfig.forEach((header)=> {
      if (header.id === fieldValue) {
        sortType = header.sortType;
      }
    });
    console.log(sortType);
    if (orderValue === 'asc') {
      if (sortType === 'number') newArr.sort((a, b) => compareNumbers(a, b, fieldValue));
      else newArr.sort((a, b) => compare(a, b, fieldValue));
    }
    else if (orderValue === 'desc') {
      if (sortType === 'number') newArr.sort((a, b) => compareNumbers(b, a, fieldValue));
      else newArr.sort((a, b) => compare(b, a, fieldValue));
    }
    console.log(newArr);
    const allData = document.querySelector('.sortable-table');
    allData.remove();
    this.data = newArr;
    this.render();

    document.querySelector("#root").append(this.element);
  }


}

