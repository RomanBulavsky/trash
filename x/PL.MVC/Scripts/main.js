requirejs.config({
    baseUrl: 'scripts/lib'
});

require(['jquery', 'underscore', 'backbone', '../routers/router', '../views/app'], function ($, _, x, Router, AppView) {
    new Router();
    Backbone.history.start();

    //MainAppView
    new AppView();
});