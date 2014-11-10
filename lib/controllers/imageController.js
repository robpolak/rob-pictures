var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var imageExtensions = ['jpg','png','jpeg'];
var videoExtensions = ['mp4','avi'];

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
      imageFiles: [],
      videoFiles: []
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
      var type = getExtension(item);
      var obj = {};
      obj.path = item;
      obj.fullImage = item.replace("_tn","");
      if(type === "image") {
        toRet.imageFiles.push(obj);
      }
      else if(type === "video") {
        toRet.videoFiles.push(obj);
      }
    });

    return toRet;
  }

  function getExtension(fileName) {
    var pos = fileName.lastIndexOf(".");
    if (!pos || pos <= 0)
      return "unknown";
    var extension = fileName.substring(pos + 1, fileName.length);
    if (_.contains(imageExtensions, extension))
      return "image";
    if (_.contains(videoExtensions, extension))
      return "video";

    return "unknown";
  }

  return {
    getGalleries: getGalleries,
    getGallery: getGallery
  };
};