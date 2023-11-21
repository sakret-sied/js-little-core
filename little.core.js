import Module from './module.js';

export default class LittleCore {
  #appContainer;
  #contentContainer;
  #contentId;
  #selectContainer;
  #selectId;
  #selectKey;

  constructor(appSelector = '#app') {
    this.#appContainer = document.querySelector(appSelector);

    this.#selectKey = this.constructor.name;
    this.#selectId = this.#selectKey
      .replace('App', 'select')
      .replace(/([A-Z])/g, '-$1')
      .toLowerCase();
    this.#selectContainer = this.#createSelectContainer();

    this.#contentId = this.#selectId.replace('select', 'content');
    this.#contentContainer = this.#createContentContainer();

    this.#addStyles();
  }

  get content() {
    return this.#contentContainer;
  }

  setModules(modules) {
    const checkedModules = modules
      .map((module) => [module.name, new module(this.#contentContainer)])
      .filter((module) => module[1] instanceof Module);
    this.modules = new Map(checkedModules);
  }

  init() {
    if (this.modules.size === 0) {
      return;
    }

    const select = this.#createSelect();
    this.#addOptionsToSelect(select);
    this.#addEventListenerToSelect(select);
  }

  #addStyles() {
    this.#appContainer.style.display = 'flex';
    this.#appContainer.style.flexDirection = 'column';
    this.#appContainer.style.gap = '1rem';
  }

  #createContentContainer() {
    const content = document.createElement('div');
    content.id = this.#contentId;
    this.#appContainer.append(content);
    return content;
  }

  #createSelectContainer() {
    const select = document.createElement('div');
    select.id = this.#selectId;
    this.#appContainer.append(select);
    return select;
  }

  #createSelect() {
    const selectList = document.createElement('select');
    this.#selectContainer.append(selectList);
    return selectList;
  }

  #addOptionsToSelect(select) {
    const defaultSelectValue = this.#getDefaultSelectValue();
    this.modules.forEach((_, index) => {
      const option = document.createElement('option');
      option.id = option.textContent = index;
      option.selected = index === defaultSelectValue ? 'selected' : '';
      select.append(option);
    });
    this.modules.get(defaultSelectValue).prepare().execute();
  }

  #addEventListenerToSelect(select) {
    select.addEventListener('change', (e) => {
      console.clear();
      this.#contentContainer.innerHTML = '';
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
