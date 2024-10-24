import vuetify from './vuetify.mjs';
import pinia from './pinia.mjs';

export function registerPlugins(app) {
  app
    .use(pinia)
    .use(vuetify);
}
