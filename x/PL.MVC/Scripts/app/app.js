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
    urlRoot: 'account/userinformation'
});
app.Views.User = Backbone.View.extend({
    tagName: "p",
    template: _.template("email: <%=email%> roles: <% for(var role in roles) { %> <%= roles[role] %> <% } %>"),
    initialize: function () {
        //var it = this;
        this.model.fetch({success: function () {/*it.render();*/},error: function() {alert("Error");}});
        //this.model.on('change', this.render, this);// TODO: -> |
        //this.model.on('sync', this.renderBySync, this);
        this.model.on('change', this.render, this);
    },
    render: function () {
        //alert("Render User");
        this.$el.html(this.template(this.model.toJSON()));
        return this;
    },
    renderBySync: function () {
        alert("Render  by sync User");
        this.$el.html(this.template(this.model.toJSON()));
        return this;
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
        this.authorizationCheck();
        this.on('superView', this.superView, this); // SuperView rendering EVENT
    },
    authorizationCheck:function() {
        $.get({
            url: "/account/IsAuthorized",
            it: this,
            success: function (isAuthorized) {
                if (isAuthorized === false) {
                    app.user.set("authorized", false);
                }
                else {
                    app.user.set("authorized", true);
                    app.triggered = false;// we can create full super view

                    if (Backbone.history.fragment === "login") // TODO: ridirect crutch
                        Backbone.history.navigate("#preMain", true);
                    //bad practice
                }
            }
        });
    },
    appendLogoutLogic: function (){  
        $("#logout").show();
        $("#logout").click(function (e) {
                e.preventDefault();
                $.get({
                    url: "/account/LogOut",
                    success: function (e) {
                        app.user.set("authorized", false);
                        $("#logout").hide();
                        app.triggered = false;// Bad practise
                        Backbone.history.navigate("#login", true);
                    }
                });
            });
    },
    superView: function () {
        if (!app.triggered) {
            //alert("Trigger SuperView");
            $("#appEnterPoint").html("").append($("#appSuperTemplate").html()); //TODO: event
            if (app.user.get("authorized") === true) {//TODO:here
                this.appendLogoutLogic();
                $("#account").append(app.userView.el);//.render() no need to use it here
                if (app.user.get("roles").includes("Admin")) {
                    alert("Admin");
                }
            }
            else {
                $("#account").append($("#appUnauthorizedTemplate").html());
            }
            app.triggered = true; // mark
        }
        else {
            alert("not super");
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

        if (!Backbone.history.fragment) {
            Backbone.history.navigate("#login", false);
        }

        if (app.user.get("authorized") === true) {
            Backbone.history.navigate("#preMain", true);
        }
        else {
            $("#subView").append($("#appLoginTemplate").html());
            var it = this;
            $("#submitButton").click(function (e) {
                e.preventDefault();
                $.post({
                    url: "/account/Login3",
                    success: function (e) {
                        app.triggered = false;// Bad practise
                        it.authorizationCheck();// jump by itself Backbone.history.navigate("#preMain", true);
                    }
                }, $('#loginForm').serialize());

            });
        }
    }
});

app.user = new app.Models.User();
app.userView = new app.Views.User({ model: app.user });
new app.Router();
Backbone.history.start();