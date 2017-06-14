//define(['jquery','underscore','backbone'], function () {

//$("body").css("background-color","black");
app = {} || app;


app.path = "";
app.DriveModel = Backbone.Model.extend({
    defaults: {
        Drives: ['default']
    },
    urlRoot: 'home/disk'
});


app.DirectoryModel = Backbone.Model.extend({
    defaults: {
        Folders: ['default']
        
    },
    urlRoot: 'home/GetDirectory?path='
});

app.DirectoryViewModel = Backbone.View.extend({
    tagName: 'ul',
    model: app.DirectoryModel,
    template: _.template("  <% for(var drive in Folders) { %><li> <%= Folders[drive] %> </li><% } %>"),
    initialize: function () {
        var it = this;
        this.model.fetch().then(function () {
            it.render();
            $("#file").html(it.el);
        });
    },
    render: function () {
        alert("render");
        this.$el.html(this.template(this.model.toJSON()));
        return this; // enable chained calls
    }
});


app.FileModel = Backbone.Model.extend({
    defaults: {
        Files: ['default']
    },
    urlRoot: 'home/GetDirectory?path='
});
app.FileViewModel = Backbone.View.extend({
    tagName: 'ul',
    model: app.DirectoryModel,
    template: _.template("  <% for(var drive in Files) { %><li> <%= Files[drive] %> </li><% } %>"),
    initialize: function () {
        var it = this;
        this.model.fetch({
            success: function () {
                alert("VIEW RENDER when path is" + app.path + "and " + it.model);


                //                    $("#xxx").change(function () {
                //                        alert(this.value);
                //                    });
            }
        }).then(function () {
            it.render();
            $("#dir").html(it.el);
        });
        //this.render();
        //this.model.fetch();
    },
    events: {
        //'change': 'showAlert'

    },



    render: function () {
        alert("render");
        this.$el.html(this.template(this.model.toJSON()));
        return this; // enable chained calls
    }
});

app.DirFileModel = Backbone.Model.extend({
    defaults: {
        
        Files: ['default'],
        Folders: ['default']
        
    },
    urlRoot: 'home/GetDirectory?path=C:/home'
});

app.SmallModel = Backbone.Model.extend({
    defaults: {
        name: "asd"
    },
    urlRoot: 'home/set'
});

app.SmallModelView = Backbone.View.extend({
    tagName: 'li',
    initialize: function() {
        this.model.on('save', this.rc, this);
    },
    rc: function() {
        alert("RCSAVE");
    },
    render: function () {
        alert(this.model.get('name'));
        this.$el.html(this.model.get('name'));
        return this;
    }
});
app.DirCollection = Backbone.Collection.extend({
    model: app.SmallModel,
    //    parse: function (data) {
//        alert(data.Files);
//        alert(this.collection);
//        return data.books;
//    },
    url: 'home/GetFiles?path=C:/home'
});
app.DirCollectionView = Backbone.View.extend({
    tagName: 'ul',

    render: function () {
        alert(this.$el.html(""));
        var it = this;
        this.collection.fetch({
            success: function () {
                alert("success" + it.model);
                it.collection.each(it.addOne, it);
                return it;
            }
        }).then(function(parameters) {
            
        });
        return this;

    },

    addOne: function (sm) {
        var task = new app.SmallModelView({ model: sm });
        this.$el.append(task.render().el);
    }
});

app.c = new app.DirCollection();
app.c.fetch().then(function() {

    app.cv = new app.DirCollectionView({ collection: app.c });
    app.cv.render();
    $("#zzz").append(app.cv.el);
});


app.FileViewModel = Backbone.View.extend({
    tagName: 'ul',
    model: app.DirFileModel,
    template: _.template("  <% for(var drive in Files) { %><li> <%= Files[drive] %> </li><% } %> <% for(var drive in Folders) { %><li> <%= Folders[drive] %> </li><% } %>"),
    initialize: function () {
        var it = this;
        this.model.fetch().then(function () {
            it.render();
            $("#dir").html(it.el);
        });
    },
    render: function () {
        alert("render FILEs AND DIRs");
        this.$el.html(this.template(this.model.toJSON()));
        return this; // enable chained calls
    }
});






app.DriveView = Backbone.View.extend({
    tagName: 'select',
    id: 'xxx',

    template: _.template(" <option disabled selected value>Drive</option> </option> <% for(var drive in Drives) { %><option> <%= Drives[drive] %> </option><% } %>"),
    initialize: function () {
        var it = this;
        this.model.fetch({
            success: function () {
                alert("success" + it.model);
                it.render();
            }
        });
    },
    events: {
        'change': 'showAlert'

    },
    showAlert() {

        if (app.path.length < 3) {

            var select = $("#xxx :selected");
            //var select2 = $("#xxx");
            console.log(select.text());
            app.path = select.text();
        }

        var dir = new app.DirectoryModel();
        dir.urlRoot += app.path.trim();
        app.dirview = new app.DirectoryViewModel({ model: dir });


        var file = new app.FileModel();
        file.urlRoot += app.path.trim();
        app.fileview = new app.FileViewModel({ model: file });

        $("#input1").val(app.path.trim());
    },


    render: function () {
        alert("render");
        this.$el.html(this.template(this.model.toJSON()));
        return this; // enable chained calls
    }
});



app.drive = new app.DriveModel();
app.view = new app.DriveView({ model: app.drive });

app.fd = new app.DirFileModel();
app.v = new app.FileViewModel({model:app.fd});

$("#yyy").append(app.view.el);





























































/*
app.FrameModel = Backbone.Model.extend({

    defaults: function () {
        return {
            drive: "C:/",
            path: "C:/Temp",
            folders: ["1", "2", "3", "4"],
            files: ["f1", "f3"]
        };
    }

});

app.FrameView = Backbone.View.extend({

    tagName: "li",
    initialize: function () {
        console.log(this.model)
        this.render();
    },

    // model: app.FrameModel,

    template: _.template($('#template').html()),

    render: function () {
        this.$el.html(this.template(this.model.toJSON()));
        return this;
    }

});


app.Collection = Backbone.Collection.extend({
    model: app.FrameModel,
    
});
app.ViewCollection = Backbone.View.extend({
    tagName: 'ul',
    //template: _.template($('#collectionTemplate').html()),
    initialize: function(){
        this.render();
    },
    render: function(){

        this.collection.each(function(frame){
            var frameView = new app.FrameView({model:frame});
            this.$el.append(frameView.render().el);
        },this);


        //this.$el.html(this.template(this.collection.toJSON()));
        return this;
        //this.$el.html(this.template)
    }
    
});


var dir = new app.FrameModel;
var view = new app.FrameView({ model: dir });

var col = new app.Collection();
col.add(dir);
var colV = new app.ViewCollection({collection:col});
//});
$(document).ready(function(){
    $('body').append(colV.render().el);
});
*/