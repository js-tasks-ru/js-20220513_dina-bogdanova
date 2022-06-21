class Tooltip {
  element;
  static onlyInstance;

  constructor() {
    if (!Tooltip.onlyInstance) {
      Tooltip.onlyInstance = this;
    } 
    else {
      return Tooltip.onlyInstance;
    }
  }

  pointerOver = (event) => {
    if (event.target.dataset.tooltip != undefined) { // если есть атрибут...
      this.render(event.target.dataset.tooltip);
      console.log(event.target);
      // this.element.hidden = false;
      // this.element.textContent = event.target.dataset.tooltip;
      document.addEventListener('pointerout', this.pointerOut);
    }
  }


  pointerOut = (event) => {
    if (event.target.dataset.tooltip != undefined) { // если есть атрибут...
      // this.element.hidden = true;
      this.remove();
      document.removeEventListener('pointerout', this.pointerOut);
    }
  }

  pointerMove = (event) => {
    if (event.target.dataset.tooltip != undefined) { // если есть атрибут...
      this.element.style.left = event.clientX  + 'px';
      this.element.style.top = event.clientY  + 'px';
    }
  }


  initialize() {
    this.initEventListeners();
  }

  initEventListeners() {
    document.addEventListener('pointerover', this.pointerOver);
    document.addEventListener('pointermove', this.pointerMove);
  }

  removeEventListeners() {
    document.removeEventListener('pointerover', this.pointerOver);
    document.removeEventListener('pointerout', this.pointerOut);
    document.removeEventListener('pointermove', this.pointerMove);
  }

  render(text) {
    this.element = document.createElement('div');
    this.element.className = 'tooltip';
    this.element.innerHTML = text;
    // this.element.hidden = true;
    document.body.append(this.element);
  }

  remove() {
    if (this.element) {
      this.element.remove();
    }
  }

  destroy() {
    this.removeEventListeners();
    this.remove();
    this.element = null;
    
  }

}

export default Tooltip;
