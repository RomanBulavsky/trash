/*global define*/
define(['jquery', 'underscore', 'backbone'], function () {
    'use strict';
    alert("ROUTER");
    var Router = Backbone.Router.extend({
        routes: {
            '': 'main',
            'main': 'main',
            'registration': 'registration',
            'login': 'login'
        },

        main: function () {
            alert("Main Route");
            Backbone.history.navigate("#main", { trigger: false });
        },
        registration: function() {
            alert("Registration");
        },
        login: function() {
            alert("Login");
        }
    });
    return Router;
});
