app = {
        Models: {},
        Collections: {},
        Views: {},
        Router: {},
        User: {},
        triggered: false
    } ||
    app;

app.Models.User = Backbone.Model.extend({
    defaults: {
        email: "default",
        roles: ["admin"],
        authorized: false
    },
    initialize:function() {
        this.on('change', this.change, this);
    },
    change:function() {
        alert('change');
    },
    urlRoot: 'account/userinformation'
});
app.Views.User = Backbone.View.extend({
    tagName: "p",
    template: _.template("email: <%=email%> roles: <% for(var role in roles) { %> <%= roles[role] %> <% } %>"),
    initialize: function () {
        //var it = this;
        this.model.fetch({success: function () {/*it.render();*/},error: function() {alert("Error");}});
        this.model.on('change', this.render, this);// TODO: -> |
        //this.model.on('change', somefunc, this);
    },
    render: function () {
        alert("Render User");
        this.$el.html(this.template(this.model.toJSON()));
        return this;
    },
    events: {
        'change': "tag" // on view elements like <tags>
    },
    showAlert: function() {
      alert("re");  
    }
});
app.Router = Backbone.Router.extend({
    routes: {
        '': "login",
        "preMain": "preMain",
        "main/:disk/*path": "main",
        "search/:name": "search",
        'registration': "registration",
        'login': "login",
        //'*': "preMain"
    },
    initialize: function () {
        alert("Init + auth");
        $.get({
            url: "/account/IsAuthorized",
            it: this,
            success: function (userName) {
                app.name = userName;

                if (userName === false){
                    app.user.set("authorized",false);
                }
                else{
                    app.user.set("authorized",true);
                    app.triggered = false;// we can create full super view

                    if (Backbone.history.fragment === "login") // TODO: ridirect crutch
                        Backbone.history.navigate("#preMain", true);

                    $("#logout").show();

                    $("#logout").click(function (e) {
                        e.preventDefault();
                        $.get({
                            url: "/account/LogOut",
                            success: function (e) {
                                app.user.set("authorized", false);
                                $("#logout").hide();
                                app.triggered = false;// Bad practise
                                Backbone.history.navigate("#login",true);
                            }
                        });
                    });
                }
            }
        });

        this.on('superView', this.superView, this); // SuperView rendering EVENT
    },
    superView: function () {
        if (!app.triggered) {
            alert("Trigger SuperView");
            $("#appEnterPoint").html("").append($("#appSuperTemplate").html()); //TODO: event

            if (app.user.get("authorized") === true) {//TODO:here
                
                app.userView = new app.Views.User({ model: app.user });

                $("#account").append(app.userView.render().el);
            }
            else {
                $("#account").append($("#appUnauthorizedTemplate").html());
            }
            app.triggered = true; // mark
        }
        else {
            $("#subView").html("");
        }
    },
    preMain: function () {
        if (app.user.get("authorized") === false) {
            Backbone.history.navigate("#login", true);
        } else {

            this.trigger("superView");
            $("#subView").append($("#appPreMainTemplate").html());
        }
    },
    main: function (disk, path) {
        if (app.user.get("authorized") === false) {
            Backbone.history.navigate("#login");
        }
        this.trigger("superView");
        $("#subView").append($("#appMainTemplate").html());
    },
    registration: function () {
        this.trigger("superView");
        $("#subView").append($("#appRegistrationTemplate").html());
    },
    login: function () {
        this.trigger("superView");
        this.x = 12;
        function makeCounter() {
            var it = this;

            return function () { // (**)
                return it;
            };
        }

        var z = makeCounter();

        if (!Backbone.history.fragment) {
            Backbone.history.navigate("#login", false);
        }

        if (app.user.get("authorized") === true) {
            Backbone.history.navigate("#preMain", true);
        }
        else {
            $("#subView").append($("#appLoginTemplate").html());
            
            $("#submitButton").click(function (e) {
                e.preventDefault();
                console.log(z);
                var xx = z();
                alert("inCLick", xx.x);
                alert("Form");
                function xxx() {
                    alert("xxx" + z().x);
                }
                xxx();
                //TODO: change
                var data = { model: { Email: $("#Email").val(), Password: $("#Password:password").val(), RememberMe: $("#RememberMe")}, returnUrl : "ret"};

                $.post({
                    url: "/Account/Login3",
                    data: JSON.stringify(data),
                    success: function () {
                        xxx();
                        var x = xx;
                        alert(x.x);
                    },
                    contentType: "application/json"

                }).then(function() {
                    alert(xx.x);
                },function() {
                    alert("Error");
                });
            },this);
        }
    }
});

app.user = new app.Models.User();
new app.Router();
Backbone.history.start();