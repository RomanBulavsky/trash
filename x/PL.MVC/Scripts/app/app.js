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
        Id: '',
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
    },
    render: function () {
        this.$el.html(this.template(this.model.toJSON()));
        //alert(this.model.get("Roles").includes("Admin"));
        if (this.model.get("Roles").includes("User")) {
            //alert("#" + this.model.get("Id") + "0");
            $("#" + this.model.get("Id") + "0").prop("checked", true);
        }
        else
            $("#" + this.model.get("Id") + "1").prop("checked", true);
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
        this.collection.each(function (user) {
            var view = new app.Views.Account({ model: user });
            this.$el.append(view.render().el);
        }, this);
        return this;
    },
    renderBySync: function () {
        this.collection.each(function (user) {
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
//    events: {
//        'change': "showAlert"
//    },
//    showAlert() {
//
//        var select = $("select :selected");
//        //var select2 = $("#xxx");
//        console.log(select.text());
//        app.path = select.text();
//
//
//        app.f = new app.Collection.File();
//        app.f.url += app.path.trim();
//        app.fv = new app.Views.FileCollection({ collection: app.f });
//
//        app.ff = new app.Collection.Folder();
//        app.ff.url += app.path.trim();
//        app.ffv = new app.Views.FolderCollection({ collection: app.ff });
//
//        $("#pathInput").val(app.path);
//
//    }

});

app.Models.Folder = Backbone.Model.extend({
    defaults: {
        folder: "default",
    },
    //urlRoot: 'home/disk'
});
app.Collections.Folder = Backbone.Collection.extend({
    model: app.Models.Folder,
    url: "home/getfolder?path="
});
app.Views.Folder = Backbone.View.extend({
    tagName: "li",
    initialize: function () {
        this.model.on("destroy", function () {
            //alert("destroy folder");
            this.$el.remove();
        }, this);
    },
    template: _.template($("#folderTemplate").html()),
    events: {
        'click .path': 'changeMainFolder',
        'click .deleteButton': "deleteFolder",
        'click .syncButton': "syncFolder",
        'click .changeButton': "changeFolder",
        'click .addButton': "addFolder",
    },
    changeFolder: function () {
        var x = prompt("new name");
        if (x != null) {
            this.model.url = "/home/ChangeFolderName/";
            this.model.set('id', 12);
            var data = { folder: x, path: app.pathForUrls, oldName: this.model.get("folder"), newName: x };
            var it = this;
            this.model.save(data).then(function(e) {
                console.log(e);
                if (e === true) {
                    it.el = it.render().el;
                } else {
                    it.model.set('folder', it.model._previousAttributes.folder);
                    it.el = it.render().el;
                    console.log("Folder Name Error");
                }
            });
            this.el = this.render().el;
        }
    },
    deleteFolder: function() {
        var fullPath = app.pathForUrls + "/" + this.model.get("folder");
        this.model.url = "/home/DeleteFolder/"; //without id
        this.model.set("id", 12); // JSON.stringify("c:/homde/lol"));
        this.model.destroy({
            data: JSON.stringify({ path: fullPath }),
            contentType: "application/json"
        });
    },
    changeMainFolder: function (e) {
        e.preventDefault();

        console.log(this.model.path);

        var fragment = Backbone.history.fragment;
        var folderName = this.model.get("folder");
        var path = "";
        if(fragment[fragment.length - 1].includes("/"))
            path = fragment;
        else
            path = fragment + "/";

        path += folderName;
        //alert(path);
        Backbone.history.navigate("#"+path, true);
    },
    render: function () {
        this.$el.html(this.template(this.model.toJSON()));
        return this;
    }
});
app.Views.FolderCollection = Backbone.View.extend({
    tagName: "ul",
    initialize: function () {
        this.render();
        this.collection.on("add", function (folder) {
            var folderV = new app.Views.Folder({ model: folder });
            this.$el.append(folderV.render().el);
        }, this);
    },
    events: {
        'click .addButton': "addFolder",
    },
    addFolder: function () {
        var x = prompt("Folder Name is");
        var model = new app.Models.Folder({ 'folder': x });
        var data = { path: app.pathForUrls, name: x }
        model.url = "/home/AddFolder/";
        model.save(data);
        this.collection.add(model);
    },
    render: function () {
        this.$el.append('<input type="button" class="addButton" value="add" />');
        var it = this;
        this.collection.fetch();
//            {
//            success: function() {
//                it.collection.each(function(file) {
//                        var driveV = new app.Views.Folder({ model: file });
//                        it.$el.append(driveV.render().el);
//                    },
//                    it);
//                return it;
//            }
//            }
        
        return this;
    }

});

app.Models.File = Backbone.Model.extend({
    defaults: {
        file: "default",
        //path: 'X'
    },
    urlRoot: "home/deleteFile"
});
app.Collections.File = Backbone.Collection.extend({
    model: app.Models.File,
    url: "home/getfile?path="
});
app.Views.File = Backbone.View.extend({
    tagName: "li",
    initialize: function () {
        this.model.on("destroy", function () {
            //alert("destroy file");
            this.$el.remove();
        }, this);
    },
    template: _.template($("#fileTemplate").html()),
    render: function () {
        this.$el.html(this.template(this.model.toJSON()));
        return this;
    },
    events: {
        'click .deleteButton': "deleteFile",
        'click .syncButton': "syncFile",
        'click .changeButton': "changeFile",
        'click .addButton': "addFile",
    },
    changeFile: function() {
        var x = prompt("new name");
        if(x!= null){
            this.model.url = "/home/ChangeFileName/";
            this.model.set("id",12); //TODO: hack
            var data = { file: x, path: app.pathForUrls, oldName: this.model.get("file"), newName: x };
            var it = this;
            this.model.save(data).then(function(e) {
                if (e === true) {
                    it.el = it.render().el;
                } else {
                    it.model.set('file', it.model._previousAttributes.file);
                    console.log("File Name Error");
                }
            });
        }
    },
    deleteFile: function () {
        var fullPath = app.pathForUrls + "/" + this.model.get("file");
        this.model.url = "/home/DeleteFile/";//without id
        this.model.set("id", 12);// JSON.stringify("c:/homde/lol"));
        this.model.destroy({
            data: JSON.stringify({ path: fullPath }),
            contentType: "application/json"
        });
    }
});
app.Views.FileCollection = Backbone.View.extend({
    tagName: "ul",
    initialize: function () {
        this.render();
        //this.collection.on('add', function (e) { this.$el.append(e); }, this);
        this.collection.on("add", function (file) {
            var driveV = new app.Views.File({ model: file });
            this.$el.append(driveV.render().el);
        }, this);
    },
    events: {
        'click .addButton': "addFile",
    },
    addFile: function () {
        var x = prompt("filename is");
        var model = new app.Models.File({ 'file': x });
        var data = { path: app.pathForUrls, name: x }
        model.url = "/home/AddFile/";
        model.save(data);
        this.collection.add(model);
    },
    render: function () {
        var it = this;
        this.$el.append('<input type="button" class="addButton" value="add" />');
        this.collection.fetch({
            success: function () {
                //$("#forFile").html(app.fv.el);
            }
        });
        return this;
    }

});


app.Models.User = Backbone.Model.extend({
    defaults: {
        email: "default",
        roles: [],
        authorized: false
    },
    urlRoot: 'account/userinformation'
});
app.Views.User = Backbone.View.extend({
    tagName: "div",
    template: _.template("Email: <%=email%> <br> Role: <% for(var role in roles) { %> <%= roles[role] %> <% } %>"),
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
                //alert("change auth");
                it.$el.html(it.template(it.model.toJSON()));

                if (app.user.get("roles").includes("Admin")) {//TODO: bad place
                    //alert("Admin");
                    $("#manage").show();//TODO: manage show
                }
            },
            error:function() {
                //alert("CHANGE ERROR");
            }
        });
        return this;
    },
    renderBySync: function () {
        //alert("Render  by sync User");
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
        'manage': 'manage',
        '*someRef' : 'login'
    },
    initialize: function() {
        this.authorizationCheck();
        this.on('superView', this.superView, this); // SuperView rendering EVENT
    },
    authorizationCheck: function() {
        return $.get({
            url: "/account/IsAuthorized",
            it: this,
            success: function(isAuthorized) {
                if (isAuthorized === true) {
                    app.user.set("authorized", true);
                    app.triggered = false; // we can create full super view

                    if (Backbone.history.fragment === "login") // TODO: ridirect crutch
                        Backbone.history.navigate("#preMain", true);
                }
            }
        });
    },
    appendLogoutLogic: function() {
        $("#logout").show();
        $("#logout").click(function(e) {
            e.preventDefault();
            $.get({
                url: "/account/LogOut",
                success: function(e) {
                    app.user.set("authorized", false);
                    $("#logout").hide();
                    $("#manage").hide(); // TODO: manage hiding
                    app.triggered = false; // Bad practise
                    Backbone.history.navigate("#login", true);
                }
            });
        });
    },
    superView: function() {
        if (!app.triggered) {
            //alert("Trigger SuperView");
            $("#appEnterPoint").html("").append($("#appSuperTemplate").html()); //TODO: event
            if (app.user.get("authorized") === true) { //TODO:here
                $("#account").append(app.userView.el); //.render() no need to use it here
            } else {
                $("#account").append($("#appUnauthorizedTemplate").html());
            }
            app.triggered = true; // mark
        } else {
            //alert("not super");
            $("#subView").html("");
        }
        if (app.user.get("authorized") === true)
            this.appendLogoutLogic();
    },
    preMain: function () {
        var it = this;
        this.authorizationCheck().then(function() {
            if (app.user.get("authorized") === false) {
                Backbone.history.navigate("#login", true);
            } else {
                it.trigger("superView");
                $("#subView").append($("#appPreMainTemplate").html());
                app.drive = new app.Views.DriveCollection({ collection: new app.Collections.Drive() });
                $("#drives").append(app.drive.el);
            }
        });
    },
    main: function(drive, path) {
        it = this;
        it.path = path;
        this.authorizationCheck().then(function() {
            if (app.user.get("authorized") === false) {
                Backbone.history.navigate("#login",true);
            }
            else{
                it.trigger("superView");
                $("#subView").append($("#appMainTemplate").html());

                app.path = drive + "/" + (path === null ? '' : path); // TODO: mapper adding :
                app.pathForUrls = drive + ":/" + (path === null ? '' : path) + "/"; // TODO: mapper adding :

                app.folderCollection = new app.Collections.Folder();
                app.folderCollection.url += app.pathForUrls;
                app.folderCollectionView = new app.Views.FolderCollection({ collection: app.folderCollection });

                app.fileCollection = new app.Collections.File();
                app.fileCollection.url += app.pathForUrls;
                app.fileCollectionView = new app.Views.FileCollection({ collection: app.fileCollection });


              
                    $("#folders").append(app.folderCollectionView.el);//render().
                    $("#files").append(app.fileCollectionView.el);//render().
                
                    //TODO: bag c/""
                    var pathArr = app.path;
                    pathArr = app.path.split("/");
                    pathArr.splice(-1, 2);
                    var url = "";
                    if ((it.path !== "") && (pathArr.length > 1)) {
                        url = pathArr.join("/");
                        var linker = "<a href='#main/" + url + "'>../</a>";
                        $("#parentFolder").append(linker);
                    } else if ((it.path !== "")) {
                        url = pathArr.join("/") + "/";
                        var linker = "<a href='#main/" + url + "'>../</a>";
                        $("#parentFolder").append(linker);
                    }

                    
                $("#pathInput").val(app.path);
            }
        });
    },
    registration: function() {
        this.trigger("superView");
        $("#subView").append($("#appRegistrationTemplate").html());
        var it = this;
        $("#submitRegistrationButton").click(function(e) {
            e.preventDefault();
            $.post({
                    url: "/account/Register2",
                    success: function(e) {
                        app.triggered = false; // Bad practise
                        //it.authorizationCheck(); // jump by itself Backbone.history.navigate("#preMain", true);
                        Backbone.history.navigate("#preMain", true);
                    }
                },
                $('#registrationForm').serialize());

        });
    },
    login: function () {
        this.trigger("superView");
        if (Backbone.history.fragment === "") {
            Backbone.history.navigate("#login", false);
        }
        if (app.user.get("authorized") === true) {
            Backbone.history.navigate("#preMain", true);
        } else {
            $("#subView").append($("#appLoginTemplate").html());
            var it = this;
            $("#submitButton").click(function(e) {
                e.preventDefault();
                $.post({
                        url: "/account/Login3",
                        success: function(e) {
                            app.triggered = false; // Bad practise
                            Backbone.history.navigate("#preMain", true);
                            //it.authorizationCheck(); // jump by itself Backbone.history.navigate("#preMain", true);//TODO:HEHEHRHEHREHERHERHHER
                        }
                    },
                    $('#loginForm').serialize());

            });
        }
    },
    manage: function () {
        var it = this;
        this.authorizationCheck().then(function() {
            it.trigger("superView");
            if (app.user.get("roles").includes("Admin")) {
                //alert("Admin");
                $("#subView").append($("#appManageTemplate").html());
                app.usersCollection = new app.Collections.Account();
                app.usersView = new app.Views.AccountCollection({ collection: app.usersCollection });
                //app.userView.collection.fetch();
                $("#managingTable").append(app.usersView.el);
            } else {
                Backbone.history.navigate("#preMain", true);
            }
        });
    }
});

Backbone.emulateHTTP = true;
app.user = new app.Models.User();
app.userView = new app.Views.User({ model: app.user });
new app.Router();
Backbone.history.start();