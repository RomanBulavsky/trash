//define(['jquery','underscore','backbone'], function () {

//$("body").css("background-color","black");
app = {
    Model: {},
    Collection: {},
    Views:{}
} || app;


app.path = "";


app.Model.Drive = Backbone.Model.extend({
    defaults: {
        drive: 'default'
    },
    //urlRoot: 'home/disk'
});
app.Collection.Drive = Backbone.Collection.extend({
    model: app.Model.Drive,
    url: 'home/getdrives'
});
app.Views.Drive = Backbone.View.extend({
    tagName: 'option',
    template: _.template('<%=drive%>'),
    render: function () {
        this.$el.html(this.template(this.model.toJSON()));
        return this;
    }
});
app.Views.DriveCollection = Backbone.View.extend({
    tagName: 'select',
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
                },it);
                return it;
            }
        }).then(function() {

            $("#forSelect").append(app.cv.el);
        });
        return this;
    },
    events: {
        'change': 'showAlert'
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
        file: 'default'
    },
    //urlRoot: 'home/deleteFile'
});
app.Collection.File = Backbone.Collection.extend({
    model: app.Model.File,
    url: 'home/getfile?path='
});
app.Views.File = Backbone.View.extend({
    tagName: 'li',
    template: _.template('File <%= file %> <input type="button" class="deleteButton" value="delete" />'),
    render: function () {
        this.$el.html(this.template(this.model.toJSON()));
        return this;
    },
    events: {
        'click .deleteButton': 'deleteFile'
    },
    deleteFile: function() {
        alert(this.$el.text());
        this.model.urlRoot = 'home/deleteFile';
        this.model.save("file", this.$el.text());
        this.model.destroy();
    }
});
app.Views.FileCollection = Backbone.View.extend({
    tagName: 'ul',
    initialize: function () {
        this.render();
    },
    render: function () {
        var it = this;
        this.collection.fetch({
            success: function () {
                it.collection.each(function (file) {
                    var driveV = new app.Views.File({ model: file });
                    it.$el.append(driveV.render().el);
                }, it);
                return it;
            }
        }).then(function () {

            $("#forFile").html(app.fv.el);
        });
        return this;
    }

});


app.Model.Folder = Backbone.Model.extend({
    defaults: {
        folder: 'default'
    },
    //urlRoot: 'home/disk'
});
app.Collection.Folder = Backbone.Collection.extend({
    model: app.Model.Folder,
    url: 'home/getfolder?path='
});
app.Views.Folder = Backbone.View.extend({
    tagName: 'li',
    template: _.template('Folder <%= folder %>'),
    render: function () {
        this.$el.html(this.template(this.model.toJSON()));
        return this;
    }
});
app.Views.FolderCollection = Backbone.View.extend({
    tagName: 'ul',
    initialize: function () {
        this.render();
    },
    render: function () {
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

    $("#pathInputButton").click(function () {

        app.path = $("#pathInput").val();
        app.path = decodeURI(app.path);
        app.f = new app.Collection.File();
        app.f.url += app.path.trim();
        app.fv = new app.Views.FileCollection({ collection: app.f });

        app.ff = new app.Collection.Folder();
        app.ff.url += app.path.trim();
        app.ffv = new app.Views.FolderCollection({ collection: app.ff });
    });

});