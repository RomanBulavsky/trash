app = {
        Models: {},
        Collections: {},
        Views: {},
        Router: {},
        User: {},
        triggered: false
    } ||
    app;

app.Models.Account = Backbone.Model.extend({
    defaults: {
        Email: "default",
        Roles: [],
        authorized: false
    },
    urlRoot: 'account/userinformation'
});
app.Collections.Account = Backbone.Collection.extend({
    model:app.Models.Account,
    url: 'account/GetUsers'
});
app.Views.Account = Backbone.View.extend({
    tagName: "li",
    model:app.Models.Account,
    template: _.template($("#appManageTableTemplate").html()),// _.template("Email: <%=Email%> roles: <% for(var role in Roles) { %> <%= Roles[role] %> <% } %>"),
    initialize: function () {
        //var it = this;
        //this.collection.fetch({ success: function () {/*it.render();*/ }, error: function () { alert("Error Users data"); } });
        //this.model.on('change', this.render, this);// TODO: -> |
        //this.model.on('sync', this.renderBySync, this);
        //this.model.on('change', this.render, this);
    },
    render: function () {
        alert("Render User");
        this.$el.html(this.template(this.model.toJSON()));
        return this;
    }
});
app.Views.AccountCollection = Backbone.View.extend({
    tagName: "ul",
    collection:app.Collections.Account,
    //template: _.template("Email: <%=Email%> roles: <% for(var role in Roles) { %> <%= Roles[role] %> <% } %>"),
    initialize: function () {
        this.collection.fetch();
        this.collection.on('sync', this.renderBySync, this);
        this.collection.on('change', this.render, this);
    },
    render: function () {
        alert("Render Userxxx");
        console.log(this.collection);
        this.collection.each(function (user) {
            var view = new app.Views.Account({ model: user });
            this.$el.append(view.render().el);
        }, this);
        return this;
    },
    renderBySync: function () {
        alert("Render  by sync User");
        console.log(this.collection);
        this.collection.each(function (user) {
            alert(user.get("Email"));
            var view = new app.Views.Account({ model: user });
            this.$el.append(view.render().el);//render
        }, this);
        //this.$el.html(this.template(this.model.toJSON()));
        return this;
    }
});

app.Models.Drive = Backbone.Model.extend({
    defaults: {
        drive: "default"
    },
    //urlRoot: 'home/disk'
});
app.Collections.Drive = Backbone.Collection.extend({
    model: app.Models.Drive,
    url: "home/getdrives"
});
app.Views.Drive = Backbone.View.extend({
    tagName: "div",
    template: _.template("<a href='#main/<%=drive[0]%>/'><%=drive%></a>"),//TODO: hard code
    render: function () {
        this.$el.html(this.template(this.model.toJSON()));
        return this;
    }
});
app.Views.DriveCollection = Backbone.View.extend({
    tagName: "div",
    initialize: function () {
        this.render();
    },
    render: function () {
        var it = this;
        this.collection.fetch({
            success: function() {
                it.collection.each(function(drive) {
                        var driveV = new app.Views.Drive({ model: drive });
                        this.$el.append(driveV.render().el);
                        //this.$el.append(it.collection.el
                    }, it);
                return it;
            }
        });
        return this;
    },
    events: {
        'change': "showAlert"
    },
    showAlert() {

        var select = $("select :selected");
        //var select2 = $("#xxx");
        console.log(select.text());
        app.path = select.text();


        app.f = new app.Collection.File();
        app.f.url += app.path.trim();
        app.fv = new app.Views.FileCollection({ collection: app.f });

        app.ff = new app.Collection.Folder();
        app.ff.url += app.path.trim();
        app.ffv = new app.Views.FolderCollection({ collection: app.ff });

        $("#pathInput").val(app.path);

    }

});

//app.Model.Folder = Backbone.Model.extend({
//    defaults: {
//        folder: "default",
//        //path: returned by cntroller
//    },
//    //urlRoot: 'home/disk'
//});
//app.Collection.Folder = Backbone.Collection.extend({
//    model: app.Model.Folder,
//    url: "home/getfolder?path="
//});
//app.Views.Folder = Backbone.View.extend({
//    tagName: "li",
//    template: _.template("<a href='#' class='path'>Folder <%= folder %></a>"),
//    events: {
//        'click .path': 'changeFolder'
//    },
//    changeFolder: function (e) {
//        e.preventDefault();
//        $("#backButton").show();
//
//        console.log(this.model.path);
//        var fragment = Backbone.history.fragment;
//        var p = this.model.get("path");
//        var end = p.split("\\");
//        var last = end[end.length - 1];
//        var path = fragment + "/" + last;
//        //alert(path);
//        app.pathx = path;
//        app.previousPath = app.path;
//        app.path = this.model.get('path');
//
//        app.f = new app.Collection.File();
//        app.f.url += app.path.trim();
//        app.fv = new app.Views.FileCollection({ collection: app.f });
//
//        app.ff = new app.Collection.Folder();
//        app.ff.url += app.path.trim();
//        app.ffv = new app.Views.FolderCollection({ collection: app.ff });
//
//        //Backbone.history.navigate(path.toString(), { trigger: false, replace: true });
//        app.x.navigate(path.toString(), { trigger: false });
//        //alert("PATH CHANGED");
//
//    },
//    render: function () {
//        this.$el.html(this.template(this.model.toJSON()));
//        return this;
//    }
//});
//app.Views.FolderCollection = Backbone.View.extend({
//    tagName: "ul",
//    initialize: function () {
//        this.render();
//    },
//    render: function () {
//        var it = this;
//        this.collection.fetch({
//            success: function () {
//                it.collection.each(function (file) {
//                    var driveV = new app.Views.Folder({ model: file });
//                    it.$el.append(driveV.render().el);
//                }, it);
//                return it;
//            }
//        }).then(function () {
//            $("#forFolder").html(app.ffv.el);
//        });
//        return this;
//    }
//
//});
//
//app.Model.File = Backbone.Model.extend({
//    defaults: {
//        file: "default",
//        //path: 'X'
//    },
//    urlRoot: "home/deleteFile"
//});
//app.Collection.File = Backbone.Collection.extend({
//    model: app.Model.File,
//    url: "home/getfile?path="
//});
//app.Views.File = Backbone.View.extend({
//    tagName: "li",
//    initialize: function () {
//        this.model.on("destroy", function () {
//            alert("destroy");
//            this.$el.remove();
//        }, this);
//    },
//    template: _
//        .template('File <%= file %> <input type="button" class="deleteButton" value="delete" /> <input type="button" class="changeButton" value="change" />'),
//    render: function () {
//        this.$el.html(this.template(this.model.toJSON()));
//        return this;
//    },
//    events: {
//        'click .deleteButton': "deleteFile",
//        'click .syncButton': "syncFile",
//        'click .changeButton': "changeFile",
//        'sync': "alertSync",
//        'all': "alertAll",
//        'click .addButton': "addFile",
//    },
//    changeFile: function () {
//        var x = prompt("new name");
//        alert("SET");
//        this.model.url = "/home/ChangeFileName/";
//        this.model.set('id', 12);
//
//        var data = { file: x, path: app.path, oldName: this.model.get("file"), newName: x };
//        this.model.save(data);//data
//        this.el = this.render().el;
//    },
//    alertAll: function (e) {
//        alert(e);
//        console.log(e);
//    },
//    syncFile: function () {
//        alert("SyncButtonVIEWFILE");
//        //this.model.fetch();
//    },
//    alertSync: function () {
//        alert("SYNC");
//    },
//    deleteFile: function () {
//        var fullPath = app.path + "/" + this.model.get("file");
//
//        this.model.url = "/home/DeleteFile/";//without id
//        this.model.set("id", 12);// JSON.stringify("c:/homde/lol"));
//
//        this.model.destroy({
//            data: JSON.stringify({ path: fullPath }),
//            contentType: "application/json"
//        });
//    }
//});
//app.Views.FileCollection = Backbone.View.extend({
//    tagName: "ul",
//    initialize: function () {
//        this.render();
//
//        //this.collection.on('add', function (e) { this.$el.append(e); }, this);
//        this.collection.on("add", function (file) {
//            alert("add_FILECOLLEC");
//            var driveV = new app.Views.File({ model: file });
//            this.$el.append(driveV.render().el);
//        }, this);
//    },
//    events: {
//        'click .addButton': "addFile",
//    },
//    addFile: function () {
//        var x = prompt("filename is");
//        alert(x);
//
//        var model = new app.Model.File({ 'file': x });
//        //var data = model.toJSON();
//        //data.extras = { myParam: "lolo" };
//        var data = { path: app.path, name: x }
//        model.url = "/home/AddFile/";
//        model.save(data);
//        //        Backbone.save({
//        //            url: "/home/AddFile/",
//        //            data: JSON.stringify({ path: app.path, name: x })
//        //        });
//        //        {
//        //            data: JSON.stringify({ path: app.path, name: x}),
//        //            contentType: "application/json"});
//
//        //console.log(model);
//        //var view = new app.Views.File({ model: model });
//
//        this.collection.add(model);
//        //var driveV = new app.Views.File({ model: model });
//        //this.$el.append(driveV.render().el);
//        //this.render();
//        //console.log(this.collection);
//    },
//    render: function () {
//        var it = this;
//        this.$el.append('<input type="button" class="addButton" value="add" />');
//        this.collection.fetch({
//            success: function () {
//                //                it.collection.each(function (file) {
//                ////                    var driveV = new app.Views.File({ model: file });
//                ////                    it.$el.append(driveV.render().el);
//                //                }, it);
//                //                it.$el.append('<input type="button" class="addButton" value="add" />');
//                //                return it;
//            }
//        }).then(function () {
//            $("#forFile").html(app.fv.el);
//        });
//        return this;
//    }
//
//});


app.Models.User = Backbone.Model.extend({
    defaults: {
        email: "default",
        roles: [],
        authorized: false
    },
    urlRoot: 'account/userinformation'
});
app.Views.User = Backbone.View.extend({
    tagName: "p",
    template: _.template("email: <%=email%> roles: <% for(var role in roles) { %> <%= roles[role] %> <% } %>"),
    initialize: function () {
        //var it = this;
        this.model.fetch({success: function () {/*it.render();*/},error: function() {console.log("Unauthorized");}});
        //this.model.on('change', this.render, this);// TODO: -> |
        //this.model.on('sync', this.renderBySync, this);
        this.model.on('change:authorized', this.render, this);
    },
    render: function () {
        var it = this;
        //alert("Render User");
        this.model.fetch({
            success: function () {
                alert("change auth");
                it.$el.html(it.template(it.model.toJSON()));

                if (app.user.get("roles").includes("Admin")) {//TODO: bad place
                    alert("Admin");
                    $("#manage").show();//TODO: manage show
                }
            },
            error:function() {
                alert("CHANGE ERROR");
            }
        });
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
        "main/:drive/*path": "main",
        "search/:name": "search",
        'registration': "registration",
        'login': "login",
        'manage' : 'manage'
        //'*': "preMain"
    },
    initialize: function () {
        this.authorizationCheck();
        alert("initialAuthcheck");
        this.on('superView', this.superView, this); // SuperView rendering EVENT
    },
    authorizationCheck:function() {
        return $.get({
            url: "/account/IsAuthorized",
            it: this,
            success: function (isAuthorized) {
                if (isAuthorized === true) {
                    alert("Auth complite");
                    app.user.set("authorized", true);
                    //app.userView.model.fetch();//TODO: bad
                    app.triggered = false;// we can create full super view

                    if (Backbone.history.fragment === "login") // TODO: ridirect crutch
                        Backbone.history.navigate("#preMain", true);
                }
                else {
                    //app.user.set("authorized", false);
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
                        $("#manage").hide(); // TODO: manage hiding
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
                $("#account").append(app.userView.el);//.render() no need to use it here
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
        if(app.user.get("authorized") === true)
            this.appendLogoutLogic();
    },
    preMain: function () {
        if (app.user.get("authorized") === false) {
            Backbone.history.navigate("#login", true);
        } else {
            this.trigger("superView");
            $("#subView").append($("#appPreMainTemplate").html());
            app.drive = new app.Views.DriveCollection({ collection: new app.Collections.Drive() });
            $("#drives").append(app.drive.el);
        }
    },
    main: function (drive, path) {
        //this.trigger("superView");
        //alert("main");
        it = this;
        this.authorizationCheck().then(function () {
            it.trigger("superView");
            if (app.user.get("authorized") === false) {
                Backbone.history.navigate("#login");
            }
            //alert("sadas");
            $("#subView").append($("#appMainTemplate").html());

            app.path = drive + "/" + (path === null ? '' : path); // TODO: mapper

            $("#pathInput").val(app.path);
        });


    },
    registration: function () {
        this.trigger("superView");
        $("#subView").append($("#appRegistrationTemplate").html());
        var it = this;
        $("#submitRegistrationButton").click(function (e) {
            e.preventDefault();
            $.post({
                url: "/account/Register2",
                success: function (e) {
                    app.triggered = false;// Bad practise
                    it.authorizationCheck();// jump by itself Backbone.history.navigate("#preMain", true);
                    Backbone.history.navigate("#preMain", true);
                }
            }, $('#registrationForm').serialize());

        });
    },
    login: function () {
        this.trigger("superView");
        if (Backbone.history.fragment === "") {
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
    },
    manage: function() {
        this.trigger("superView");
        if (app.user.get("roles").includes("Admin")) {
            alert("Admin");
            $("#subView").append($("#appManageTemplate").html());
            app.usersCollection = new app.Collections.Account();
            app.usersView = new app.Views.AccountCollection({ collection: app.usersCollection });
            //app.userView.collection.fetch();
            $("#managingTable").append(app.usersView.el);
        } else {
            Backbone.history.navigate("#preMain", true);
        }
    }
});

app.user = new app.Models.User();
app.userView = new app.Views.User({ model: app.user });
new app.Router();
Backbone.history.start();