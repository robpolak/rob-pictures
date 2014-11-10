var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var crypto = require('crypto')
  , key = 'djsdDSKSDLKdsk234'
  , cipher = crypto.createCipher('aes-256-cbc', key);

module.exports = function(dir) {

  function encrypt(text){
    var crypted = cipher.update(text,'utf8','hex')
    crypted += cipher.final('hex');
    return crypted;
  }

  function decrypt(text){
    var decipher = crypto.createDecipher('aes-256-cbc', key);
    var dec = decipher.update(text,'hex','utf8');
    dec += decipher.final('utf8');
    return dec;
  }

  function isAuthorizedForGallery(gallery, req) {
    var authCookieName = gallery.config.directory + "_auth";

    var authCookie = req.cookies[authCookieName];
    if(!authCookie)
      return false;

    if(authCookie) {
      var value = decrypt(authCookie);
      return value === gallery.config.galleryPassword
    }
      return true;

    return false;
  }

  function authenticateForGallery(gallery, req, res) {
    var authCookieName = gallery.config.directory + "_auth";

    if(gallery.config.galleryPassword.toLowerCase() === req.body.password.toLowerCase()) {
      res.cookie(authCookieName, encrypt(gallery.config.galleryPassword), {maxage: 900000});
      return true;
    }
    return false;

  }

  return {
    isAuthorizedForGallery: isAuthorizedForGallery,
    authenticateForGallery: authenticateForGallery
  };
};