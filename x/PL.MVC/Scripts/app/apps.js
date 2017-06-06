//define(['jquery','underscore','backbone'], function () {

//$("body").css("background-color","black");
app = {
    Model: {},
    Collection: {},
    Views: {}
} || app;


Backbone.emulateHTTP = true;
app.path = "";


app.Model.Drive = Backbone.Model.extend({
    defaults: {
        drive: "default"
    },
    //urlRoot: 'home/disk'
});
app.Collection.Drive = Backbone.Collection.extend({
    model: app.Model.Drive,
    url: "home/getdrives"
});
app.Views.Drive = Backbone.View.extend({
    tagName: "option",
    template: _.template("<%=drive%>"),
    render: function () {
        this.$el.html(this.template(this.model.toJSON()));
        return this;
    }
});
app.Views.DriveCollection = Backbone.View.extend({
    tagName: "select",
    initialize: function () {
        this.render();
    },
    render: function () {
        var it = this;
        this.collection.fetch({
            success: function () {
                it.collection.each(function (drive) {
                    var driveV = new app.Views.Drive({ model: drive });
                    it.$el.append(driveV.render().el);
                }, it);
                return it;
            }
        }).then(function () {

            $("#forSelect").append(app.cv.el);
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


app.Model.File = Backbone.Model.extend({
    defaults: {
        file: "default",
        //path: 'X'
    },
    //    destroy: function () {
    //        alert("DESTROY");
    //        model.trigger('destroy', model, model.collection, options);  
    //    },
    //    sync: function (method, model, options) {
    //        options || (options = {});
    //
    //        // passing options.url will override 
    //        // the default construction of the url in Backbone.sync
    //
    //        switch (method) {
    //            case "read":
    //                options.url = "/myservice/getUser.aspx?id=" + model.get("id");
    //                break;
    //            case "delete":
    //                options.url = "http://localhost:65058/home/deleteFile/";
    //                break;
    //            case "update":
    //                options.url = "/myService/setUser.aspx";
    //                break;
    //        }
    //
    //        if (options.url)
    //            return Backbone.sync(method, model, options);
    //    },
    //idAttribute: 'path'
    urlRoot: "home/deleteFile"
});
app.Collection.File = Backbone.Collection.extend({
    model: app.Model.File,
    url: "home/getfile?path="
});
app.Views.File = Backbone.View.extend({
    tagName: "li",
    initialize: function() {
        //alert("init");
//        this.model.on('change', function () {
//            this.model.url = "/home/ChangeFileName/";
//            //alert("cnhg");
//
//            var data = { file: "asdsad", path: app.path, oldname: this.model._previousAttributes.file, name: this.model.get('file') };
////            this.model.save({
////                    data: JSON.stringify(data),
////                    contentType: "application/json"
////                }
////            );
//            this.model.save();//data
//            //alert("rend");
//            this.el = this.render().el;
//            //alert("stop");
//        }, this);

        this.model.on("destroy", function() {
            alert("destroy");
            this.$el.remove();
        }, this);
    },
    template: _
        .template('File <%= file %> <input type="button" class="deleteButton" value="delete" /> <input type="button" class="changeButton" value="change" />'),
    render: function() {
        this.$el.html(this.template(this.model.toJSON()));
        return this;
    },
    events: {
        'click .deleteButton': "deleteFile",
        'click .syncButton': "syncFile",
        'click .changeButton': "changeFile",
        'sync': "alertSync",
        'all': "alertAll",
        'click .addButton': "addFile",
    },
    changeFile: function() {
        var x = prompt("new name");
        alert("SET");
        //this.model.set({ "file": x, 'id': 12 });

        this.model.url = "/home/ChangeFileName/";
        this.model.set('id', 12);
        //alert("cnhg");

        var data = { file: x, path: app.path, oldName: this.model.get("file"), newName: x };
        //            this.model.save({
        //                    data: JSON.stringify(data),
        //                    contentType: "application/json"
        //                }
        //            );
        this.model.save(data);//data
        //alert("rend");
        this.el = this.render().el;
    },
    alertAll: function (e) {
        alert(e);
        console.log(e);
    },
    syncFile: function () {
        alert("SyncButtonVIEWFILE");
        //this.model.fetch();
    },
    alertSync: function () {
        alert("SYNC");
    },
    deleteFile: function () {
        //alert(this.$el.text() + "VIEW _ NON COLL");
        //this.model.urlRoot = 'home/deleteFile';
        var fullPath = app.path + "/" + this.model.get("file");
        //var x = { path: "xxx", fullPath: fullPath };
        //this.model.urlRoot = "/home/DeleteFile/";//with id
        this.model.url = "/home/DeleteFile/";//without id
        this.model.set("id", 12);// JSON.stringify("c:/homde/lol"));
        //console.log(this.model.get('fullPath'));
        //console.log(fullPath);
        //this.remove();
        //        this.model.save("file", this.$el.text());
        //console.log(this._previousAttributes.file);
        //alert("destroyinggggg");
        //this.model.destroy();
        this.model.destroy({
            data: JSON.stringify({ path: fullPath }),
            contentType: "application/json"
        });

        //
//                $.ajax({
//                    url: " http://localhost:65058/home/deleteFile/",
//                    type: "POST",
//                    data: JSON.stringify({ X: fullPath}),
//                    headers: {
//                        "Content-Type": "application/json",
//                        "X-HTTP-Method-Override": "DELETE"
//                    },
//                });
//        this.model.destroy({
//            success: function (deletedItem) {
//                console.log("successful deleted: " + deletedItem);
//            },
//            error: function () {
//                alert("ERROR" + this.error);
//            }
////            options:
////            {
////                url: "http://localhost:65058/home/deleteFile/",
////                type: "POST",
////                data: JSON.stringify("strange"),
////                headers: {
////                    "Content-Type": "application/json",
////                    "X-HTTP-Method-Override": "DELETE"
////                }
////            }
//        });
        //        this.model.destroy({
        //            success: function(deletedItem) {
        //                console.log("successful deleted: " + deletedItem);  
        //            },
        //            error:function() {
        //                alert("ERROR" + this.error);
        //            }
        //        });
    }
});
app.Views.FileCollection = Backbone.View.extend({
    tagName: "ul",
    initialize: function () {
        this.render();
      
        //this.collection.on('add', function (e) { this.$el.append(e); }, this);
        this.collection.on("add", function (file) {
            alert("add_FILECOLLEC");
            var driveV = new app.Views.File({ model: file });
            this.$el.append(driveV.render().el);
        }, this);
    },
    events: {
        'click .addButton': "addFile",
    },
    addFile: function () {
        var x = prompt("filename is");
        alert(x);
        
        var model = new app.Model.File({ 'file': x });
        //var data = model.toJSON();
        //data.extras = { myParam: "lolo" };
        var data = {path: app.path, name: x }
        model.url = "/home/AddFile/";
        model.save(data);
//        Backbone.save({
//            url: "/home/AddFile/",
//            data: JSON.stringify({ path: app.path, name: x })
//        });
//        {
//            data: JSON.stringify({ path: app.path, name: x}),
//            contentType: "application/json"});

        //console.log(model);
        //var view = new app.Views.File({ model: model });

        this.collection.add(model);
        //var driveV = new app.Views.File({ model: model });
        //this.$el.append(driveV.render().el);
        //this.render();
        //console.log(this.collection);
    },
    render: function () {
        var it = this;
        this.$el.append('<input type="button" class="addButton" value="add" />');
        this.collection.fetch({
            success: function () {
//                it.collection.each(function (file) {
////                    var driveV = new app.Views.File({ model: file });
////                    it.$el.append(driveV.render().el);
//                }, it);
//                it.$el.append('<input type="button" class="addButton" value="add" />');
//                return it;
            }
        }).then(function () {
            $("#forFile").html(app.fv.el);
        });
        return this;
    }

});


app.Model.Folder = Backbone.Model.extend({
    defaults: {
        folder: "default"
    },
    //urlRoot: 'home/disk'
});
app.Collection.Folder = Backbone.Collection.extend({
    model: app.Model.Folder,
    url: "home/getfolder?path="
});
app.Views.Folder = Backbone.View.extend({
    tagName: "li",
    template: _.template("<a href='#' class='path'>Folder <%= folder %></a>"),
    events: {
        'click .path' : 'changeFolder'
    },
    changeFolder: function () {
        $("#backButton").show();
        app.previousPath = app.path;
        app.path = this.model.get('path');
        app.f = new app.Collection.File();
        app.f.url += app.path.trim();
        app.fv = new app.Views.FileCollection({ collection: app.f });

        app.ff = new app.Collection.Folder();
        app.ff.url += app.path.trim();
        app.ffv = new app.Views.FolderCollection({ collection: app.ff });
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
    },
    render: function () {
        //alert("render");
        //console.log(this.model);//nope mosh
        //console.log(this.collection);
        var it = this;
        this.collection.fetch({
            success: function () {
                it.collection.each(function (file) {
                    var driveV = new app.Views.Folder({ model: file });
                    it.$el.append(driveV.render().el);
                }, it);
                return it;
            }
        }).then(function () {
            $("#forFolder").html(app.ffv.el);
        });
        return this;
    }

});


app.c = new app.Collection.Drive();
app.cv = new app.Views.DriveCollection({ collection: app.c });
$(document).ready(function () {

    $("#pathInputButton").click(function (e) {
        e.preventDefault();
        app.path = $("#pathInput").val();
        app.path = decodeURI(app.path);

        app.f = new app.Collection.File();
        app.f.url += app.path.trim();
        app.fv = new app.Views.FileCollection({ collection: app.f });

        app.ff = new app.Collection.Folder();
        app.ff.url += app.path.trim();
        app.ffv = new app.Views.FolderCollection({ collection: app.ff });
    });
    $("#backButton").click(function (e) {
        e.preventDefault();
        //app.path = app.previousPath;
        $.get("/home/GetParrent?path=" + app.path, function (e) {
            alert(e);
            app.path = e;
            app.f = new app.Collection.File();
            app.f.url += app.path.trim();
            app.fv = new app.Views.FileCollection({ collection: app.f });

            app.ff = new app.Collection.Folder();
            app.ff.url += app.path.trim();
            app.ffv = new app.Views.FolderCollection({ collection: app.ff });
        });
        
    });
    $("#BC").click(function(e) {
        e.preventDefault();
        $.get("/home/GetBreadCrumbs?path=" + app.path,
            function(e) {
                alert(e);
                $("#BCUL").empty();
                for (var index in e) {
                    console.log(e[index]);
                    var str = '<li><a href="#" id="'+index+'">' + e[index] + '</a></li>';
                    console.log(str);
                    $("#BCUL").append(str);
                }
                for (var i in e) {
                    var indexer = (function (i) {
                        var z = i;
                        return function() {
                            return z;
                        };
                    })(i);
//                    if(i == 0)
//                        app.indexer = indexer;
//
//                    if (i == 1 )
//                        app.indexer2 = indexer;
                    
                    $("#" + i).click(function (z) {
                        app.path = $(this).html();
                        app.f = new app.Collection.File();
                        app.f.url += app.path.trim();
                        app.fv = new app.Views.FileCollection({ collection: app.f });

                        app.ff = new app.Collection.Folder();
                        app.ff.url += app.path.trim();
                        app.ffv = new app.Views.FolderCollection({ collection: app.ff });

                    });
                }
                
            });
    });
    

});
