import Module from './module.js';

export default class LittleCore {
  constructor() {
    this.container = document.querySelector('#app');

    this.selectorKey = this.constructor.name.replace('App', 'selector');
    this.selectorId = this.selectorKey.replace(/([A-Z])/g, '-$1').toLowerCase();
    this.selector = this.#createSelectorOnDocument();

    this.contentId = this.selectorId.replace('selector', 'content');
    this.content = this.#createContentOnDocument();
  }

  setModules(modules) {
    const checkedModules = modules
      .map((module) => [module.name, new module(this.content)])
      .filter((module) => module[1] instanceof Module);
    this.modules = new Map(checkedModules);
  }

  init() {
    if (this.modules.size === 0) {
      return;
    }

    this.#addOptionsToSelector();
    this.#addEventListenerToSelector();
  }

  #createContentOnDocument() {
    const content = document.createElement('div');
    content.id = this.contentId;
    this.container.insertAdjacentElement('beforeend', content);
    return content;
  }

  #createSelectorOnDocument() {
    const selector = document.createElement('select');
    selector.id = this.selectorId;
    this.container.insertAdjacentElement('afterbegin', selector);
    return selector;
  }

  #addOptionsToSelector() {
    const defaultSelector = this.#getDefaultSelector();
    this.modules.forEach((_, index) => {
      const option = document.createElement('option');
      option.id = option.innerText = index;
      option.selected = index === defaultSelector ? 'selected' : '';
      this.selector.insertAdjacentElement('beforeend', option);
    });
    this.modules.get(defaultSelector).execute();
  }

  #addEventListenerToSelector() {
    this.selector.addEventListener('change', (e) => {
      console.clear();
      this.content.innerHTML = '';
      this.#setDefaultSelector(e.target.value);
      this.modules.get(e.target.value).prepare().execute();
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
