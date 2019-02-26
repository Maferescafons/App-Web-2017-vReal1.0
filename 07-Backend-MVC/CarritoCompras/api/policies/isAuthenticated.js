/**
 * *
* @module      :: Policy
* @description :: Simple policy to allow any authenticated user
*                 Assumes that your login action in one of your controllers sets `req.session.authenticated = true;`
* @docs        :: http://sailsjs.org/#!documentation/policies
*
*/
module.exports = function(req, res, next) {

  // If `req.session.me` exists, that means the user is logged in.
 // if (req.session.me) return next();
  if (req.cookies.User)
  {
    return next() //Tienes permiso
  }else{
    return res.redirect('/login'); //Redirigirle al login
  }
  // If this is not an HTML-wanting browser, e.g. AJAX/sockets/cURL/etc.,
  // send a 401 response letting the user agent know they need to login to
  // access this endpoint.
  if (req.wantsJSON) {
    return res.send(401);
  }

  // Otherwise if this is an HTML-wanting browser, do a redirect.

};
