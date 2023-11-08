export default class Module {
  constructor(content) {
    this.content = content;
  }

  execute() {}

  prepare() {
    return this;
  }
}
