requirejs.config({
    //By default load any module IDs from js/lib
    baseUrl: 'scripts/lib',
    //except, if the module ID starts with "app",
    //load it from the js/app directory. paths
    //config is relative to the baseUrl, and
    //never includes a ".js" extension since
    //the paths config could be for a directory.

    // The shim config allows us to configure dependencies for
    // scripts that do not call define() to register a module
//    shim: {
//        underscore: {
//            exports: '_'
//        },
//        backbone: {
//            deps: [
//                'lib/underscore',
//                'lib/jquery'
//            ],
//            exports: 'lib/Backbone'
//        }
//    },
    paths: {
        //app: '../app'
     }
});
//requirejs(["app/bb","jquery","underscore","backbone"]);
//requirejs(["../app/application","jquery","underscore","backbone"]);

require(['jquery','underscore','backbone','../routers/router'], function ($,_,x,  Router) {
    /*jshint nonew:false*/
    // Initialize routing and start Backbone.history()
    new Router();
    Backbone.history.start();

    // Initialize the application view
    //new AppView();
});