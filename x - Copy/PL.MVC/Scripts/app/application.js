define(['jquery', 'underscore', 'backbone'], function () {
    // $(document).ready(function(){
    //     $("body").append("<h1>Require works</h1>")
    // });
    app = {
        Models: {},
        Collections: {},
        Views: {},
        Router: {}
    } || app;

    app.Router = Backbone.Router.extend({
        initialize: function () {
            alert("INIT");
            this.on("route", function (e) {
                alert("route event + " + e);
            });
            this.on("route: main", function (e) {
                alert("route: main + " + e);
            });
            this.on("all", function (e) {
                alert("all + " + e);
            });

        },
        routes: {
            "": "main", // #help
            "main/:disk/*path": "main", // #help
            "auth": "auth",
            "search/:name": "search"
        },
        main: function (disk, path) {
            if(disk == undefined && path == undefined){
                alert("EMPTY AMIN");
                disk = "c";
                path = "Home";
                Backbone.history.navigate(disk + "/" + path);
            }
            alert("PATH" + path);

            $(document).ready(function () {
                alert("main again");
                Backbone.emulateHTTP = true;
                //app.path = "";
                if (app.path == undefined && disk != undefined) {

                    app.path = disk + ":/";
                    if (path != undefined)
                        app.path += path;
                }
                app.c = new app.Collection.Drive();
                app.cv = new app.Views.DriveCollection({ collection: app.c });

                $("#pathInput").val(app.path);
                //$("#pathInput").val("c:/home");//trunk for time

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
                $("#BC").click(function (e) {
                    e.preventDefault();
                    $.get("/home/GetBreadCrumbs?path=" + app.path,
                        function (e) {
                            alert(e);
                            $("#BCUL").empty();
                            for (var index in e) {
                                console.log(e[index]);
                                var str = '<li><a href="#" id="' + index + '">' + e[index] + '</a></li>';
                                console.log(str);
                                $("#BCUL").append(str);
                            }
                            $("#BCUL>li>a").click(function (z) {
                                alert($(this).html());
                                app.path = $(this).html();
                                app.f = new app.Collection.File();
                                app.f.url += app.path.trim();
                                app.fv = new app.Views.FileCollection({ collection: app.f });

                                app.ff = new app.Collection.Folder();
                                app.ff.url += app.path.trim();
                                app.ffv = new app.Views.FolderCollection({ collection: app.ff });

                            });
                        });
                });


            });
        },

        auth: function () {


            $(document.body).html('<h2>"Authentication " </h2>');


        },
        search: function (name) {

            $(document.body).html('<h2>"searching " ' + name + '</h2>');
        }

    });

    $(document).ready(function () {
        $("#pathInput").val("c:/home");
        alert("X");
        app.x = new app.Router();
        a = $("#aGET").click(function () {
            alert("check");
            $.get({
                url: "/home/AuthTest",
                success: function (e) {
                    alert("SUCCESS");
                }

            }
            ).then(function (e) {
                alert(e);
            });

        });
        Backbone.history.start();//{ pushState: true }
    });















});