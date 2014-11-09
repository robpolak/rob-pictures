var express = require('express');
var router = express.Router();
var path = require('path');

var imageController = require('../lib/controllers/imageController')(path.join(__dirname,'../public/gallery'));
var authController = require('../lib/controllers/authController')();

/* GET home page. */
router.get('/', function(req, res) {
  var galleries = imageController.getGalleries();
  res.render('index', { galleries: galleries });
});

router.get('/gallery/:galleryName', function(req, res) {
  var gallery = imageController.getGallery(req.params.galleryName);

  if(gallery.config.galleryPassword) {
    var isAuth = authController.isAuthorizedForGallery(gallery, req);
    if(!isAuth)
    {
      res.redirect('/gallery/authenticate/'+ req.params.galleryName);
      return;
    }
  }

  res.render('gallery', { gallery: gallery });
});

router.get('/gallery/authenticate/:galleryName', function(req, res) {
  var gallery = imageController.getGallery(req.params.galleryName);

  res.render('authenticate', { gallery: gallery });
});

router.post('/gallery/authenticate/:galleryName', function(req, res) {
  var gallery = imageController.getGallery(req.params.galleryName);

  var authenticated = authController.authenticateForGallery(gallery, req,res);
  if(authenticated) {
    res.redirect('/gallery/'+ req.params.galleryName);
    return;
  }

  res.render('authenticate', { gallery: gallery, message: "Invalid Password." });
});


module.exports = router;
