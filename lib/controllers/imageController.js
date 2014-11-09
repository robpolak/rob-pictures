var fs = require('fs');
var path = require('path');
var _ = require('underscore');

module.exports = function(dir) {

  function getGalleries() {
    var toRet = [];
    var directories = fs.readdirSync(dir).filter(function (item) {
        return fs.statSync(path.join(dir,item)).isDirectory();
    });

    _.each(directories, function(item) {
      var dirPath =  path.join(dir,item);
      var config = path.join(dirPath,'gallery.json');
      var file = fs.readFileSync(config, "utf8");
      var obj = JSON.parse(file);
      var galleryObj = {
        title: obj.title,
        config: obj,
        path: item
      }
      toRet.push(galleryObj);
    });
    return toRet;
  }

  function getGallery(galleryName) {
    var toRet = {
      files: []
    };

    var config = path.join(dir, galleryName,'gallery.json');
    var file = fs.readFileSync(config, "utf8");
    var obj = JSON.parse(file);
    toRet.config = obj;
    var galleryPath = path.join(dir, galleryName, 'thumbs');
    toRet.path = galleryName;

    var files = fs.readdirSync(galleryPath).filter(function (item) {
      return !fs.statSync(path.join(galleryPath,item)).isDirectory();
    });

    _.each(files, function(item) {
      var obj = {};
      obj.path = item;
      toRet.files.push(obj);
    });

    return toRet;
  }

  return {
    getGalleries: getGalleries,
    getGallery: getGallery
  };
};