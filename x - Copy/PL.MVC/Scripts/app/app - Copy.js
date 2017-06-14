define(['require', 'jquery'], function (require) {
    'use strict';
    //alert("App start");
    $(document).ready(function () {
        $("h1").hide();
        //$("html").css("background-color","white");
    });
});

// EXamples

//                $.post('/Account/Login3', $('#loginForm').serialize()).then(function () {
//                    alert(it.x);
//                    Backbone.history.navigate("#preMain", true);
//                    //it.trigger("superView");
//
//                });


//                var x2 = x;
//                alert(x);
//                //TODO: change
//                var data = { model: { Email: $("#Email").val(), Password: $("#Password:password").val(), RememberMe: $("#RememberMe")}, returnUrl : "ret"};
//
//                $.post({
//                    url: "/Account/Login3",
//                    data: JSON.stringify(data),
//                    success: function () {
//                        alert(x);
//                        alert(x2);
//                    },
//                    contentType: "application/json"
//
//                }).then(function() {
//                    alert(x + "then");
//                    alert(x2);
//                },function() {
//                    alert("Error");
//                });


//EVENTS for VIEW
//
//,
//events: {
//    'change': "tag" // on view elements like <tags>
//},
//showAlert: function() {
//    alert("re");  
//}

//MODEL events
//
//initialize:function() {
//    this.on('change', this.change, this);
//},
//change:function() {
//    alert('change');
//},