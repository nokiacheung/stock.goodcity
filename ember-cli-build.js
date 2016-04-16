/*jshint node:true*/
/* global require, module */
var EmberApp = require('ember-cli/lib/broccoli/ember-app');
var webRelease = process.env.EMBER_CLI_CORDOVA === '0' && ['production', 'staging'].indexOf(process.env.EMBER_ENV) !== -1;

module.exports = function(defaults) {
  var app = new EmberApp(defaults, {
    sourcemaps: ['js', 'css'],
    fingerprint: {
      extensions: ['js', 'css', 'png', 'jpg', 'gif', 'map'],
      enabled: webRelease
    },
    gzip: {
      keepUncompressed: true,
      extensions: ['js', 'css', 'map', 'ttf', 'ott', 'eot', 'svg'],
      enabled: webRelease
    },
    sassOptions: {
      extension: 'scss'
    }
  });

  app.import('bower_components/foundation/js/foundation/foundation.js');
  app.import("bower_components/font-awesome/css/font-awesome.css");
  app.import("bower_components/font-awesome/fonts/fontawesome-webfont.eot", { destDir: "fonts" });
  app.import("bower_components/font-awesome/fonts/fontawesome-webfont.svg", { destDir: "fonts" });
  app.import("bower_components/font-awesome/fonts/fontawesome-webfont.ttf", { destDir: "fonts" });
  app.import("bower_components/font-awesome/fonts/fontawesome-webfont.woff", { destDir: "fonts" });
  app.import("bower_components/font-awesome/fonts/fontawesome-webfont.woff2", { destDir: "fonts" });
  app.import("bower_components/font-awesome/fonts/FontAwesome.otf", { destDir: "fonts" });

  app.import('bower_components/airbrake-js/dist/client.js');

  return app.toTree();
};
