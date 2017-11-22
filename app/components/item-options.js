import Component from '@ember/component';

export default Component.extend({
  hidden: true,

  actions: {
    toggle(value) {
      this.set("hidden", value);
    }
  }
});
