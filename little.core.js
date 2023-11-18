import Module from './module.js';

export default class LittleCore {
  #container;
  #content;
  #contentId;
  #select;
  #selectId;
  #selectKey;

  constructor(appSelector = '#app') {
    this.#container = document.querySelector(appSelector);

    this.#selectKey = this.constructor.name;
    this.#selectId = this.#selectKey
      .replace('App', 'select')
      .replace(/([A-Z])/g, '-$1')
      .toLowerCase();
    this.#select = this.#createSelectOnDocument();

    this.#contentId = this.#selectId.replace('select', 'content');
    this.#content = this.#createContentOnDocument();

    this.#addStyles();
  }

  get content() {
    return this.#content;
  }

  setModules(modules) {
    const checkedModules = modules
      .map((module) => [module.name, new module(this.#content)])
      .filter((module) => module[1] instanceof Module);
    this.modules = new Map(checkedModules);
  }

  init() {
    if (this.modules.size === 0) {
      return;
    }

    this.#addOptionsToSelect();
    this.#addEventListenerToSelect();
  }

  #addStyles() {
    this.#container.style.display = 'flex';
    this.#container.style.flexDirection = 'column';
    this.#container.style.gap = '1rem';
  }

  #createContentOnDocument() {
    const content = document.createElement('div');
    content.id = this.#contentId;
    this.#container.append(content);
    return content;
  }

  #createSelectOnDocument() {
    const div = document.createElement('div');
    div.id = this.#selectId;
    this.#container.append(div);

    const select = document.createElement('select');
    div.append(select);
    return select;
  }

  #addOptionsToSelect() {
    const defaultSelectValue = this.#getDefaultSelectValue();
    this.modules.forEach((_, index) => {
      const option = document.createElement('option');
      option.id = option.textContent = index;
      option.selected = index === defaultSelectValue ? 'selected' : '';
      this.#select.append(option);
    });
    this.modules.get(defaultSelectValue).prepare().execute();
  }

  #addEventListenerToSelect() {
    this.#select.addEventListener('change', (e) => {
      console.clear();
      this.#content.innerHTML = '';
      this.#setDefaultSelectValue(e.target.value);
      this.modules.get(e.target.value).prepare().execute();
    });
  }

  #setDefaultSelectValue(selectValue) {
    localStorage.setItem(this.#selectKey, selectValue);
  }

  #getDefaultSelectValue() {
    const storageModule = localStorage.getItem(this.#selectKey);
    const firstModule = this.modules.keys().next().value;
    return storageModule && this.modules.get(storageModule)
      ? storageModule
      : firstModule;
  }
}
