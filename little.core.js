import Module from './module.js';

export default class LittleCore {
  constructor() {
    this.container = document.querySelector('#app');
    this.selectorKey = this.constructor.name.replace('App', 'selector');
    this.selectorId = this.selectorKey.replace(/([A-Z])/g, '-$1').toLowerCase();
  }

  setModules(modules) {
    const checkedModules = modules
      .map((module) => [module.name, new module()])
      .filter((module) => module[1] instanceof Module);
    this.modules = new Map(checkedModules);
  }

  init() {
    if (this.modules.size === 0) {
      return;
    }

    const selector = this.#addSelectorToDocument();
    this.#addOptionsToSelector(selector);
    this.#addEventListenerToSelector(selector);
  }

  #addSelectorToDocument() {
    const selector = document.createElement('select');
    selector.id = this.selectorId;
    this.container.insertAdjacentElement('beforeend', selector);
    return selector;
  }

  #addOptionsToSelector(selector) {
    const defaultSelector = this.#getDefaultSelector();
    this.modules.forEach((_, index) => {
      const option = document.createElement('option');
      option.id = option.innerText = index;
      option.selected = index === defaultSelector ? 'selected' : '';
      selector.insertAdjacentElement('beforeend', option);
    });

    this.modules.get(defaultSelector).execute();
  }

  #addEventListenerToSelector(selector) {
    selector.addEventListener('change', (e) => {
      console.clear();
      this.#setDefaultSelector(e.target.value);
      this.modules.get(e.target.value).execute();
    });
  }

  #setDefaultSelector(selectorValue) {
    localStorage.setItem(this.selectorKey, selectorValue);
  }

  #getDefaultSelector() {
    const selectorStorage = localStorage.getItem(this.selectorKey);
    const firstModule = this.modules.keys().next().value;
    return selectorStorage && this.modules.get(selectorStorage)
      ? selectorStorage
      : firstModule;
  }
}
