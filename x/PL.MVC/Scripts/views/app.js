/*global define*/
define(['jquery', 'underscore', 'backbone'],
    function ($,_) {
	'use strict';

	// Our overall **AppView** is the top-level piece of UI.
	var AppView = Backbone.View.extend({
        el: '#appEnterPoint',
        
		template: _.template($("#appTemplate").html()),
        
		events: {
		},
        
		initialize: function () {
		    this.render();
		},
        
		render: function () {
            this.$el.html(this.template());//this.model.toJSON()
		    return this;
		}

	});

	return AppView;
});
