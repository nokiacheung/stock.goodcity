import { on } from '@ember/object/evented';
import Controller, { inject as controller } from '@ember/controller';

export default Controller.extend({

  subscription: controller(),

  initSubscription: on('init', function() {
    this.get('subscription').send('wire');
  })
});
