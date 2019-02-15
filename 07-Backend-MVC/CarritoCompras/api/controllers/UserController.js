/**
 * UserController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  login: function (req, res) {
    res.clearCookie("User"),
      res.clearCookie("user")
    // See `api/responses/login.js`
    return res.login({
      email: req.param('email'),
      password: req.param('password'),

      successRedirect:'/VerUsuario',
      invalidRedirect: '/',
    });
  },

  logout: function (req, res) {

    // "Forget" the user from the session.
    // Subsequent requests from this user agent will NOT have `req.session.me`.
    req.session.me = null;

   //   res.clearCookie("user")

    // If this is not an HTML-wanting browser, e.g. AJAX/sockets/cURL/etc.,
    // send a simple response letting the user agent know they were logged out
    // successfully.
    if (req.wantsJSON) {
      return res.ok('Logged out successfully!');
    }

    // Otherwise if this is an HTML-wanting browser, do a redirect.
    return res.clearCookie("User"),
      res.redirect('/');
  },

  signup: function (req, res) {

    // Attempt to signup a user using the provided parameters
    User.signup({
      name: req.param('name'),
      email: req.param('email'),
      password: req.param('password')
    }, function (err, user) {
      // res.negotiate() will determine if this is a validation error
      // or some kind of unexpected server error, then call `res.badRequest()`
      // or `res.serverError()` accordingly.
      if (err) return res.negotiate(err);

      // Go ahead and log this user in as well.
      // We do this by "remembering" the user in the session.
      // Subsequent requests from this user agent will have `req.session.me` set.
      req.session.me = user.id;
      res.send(user.id);
      // If this is not an HTML-wanting browser, e.g. AJAX/sockets/cURL/etc.,
      // send a 200 response letting the user agent know the signup was successful.
      if (req.wantsJSON) {
        return res.ok('Signup successful!');
      }

      // Otherwise if this is an HTML-wanting browser, redirect to /welcome.
      return res.redirect('/');
      sails.log.info("Parametros", user.id);

    });
  },
  VerUsuario: function (req, res) {
    var parametros = req.allParams();
    if(parametros.email&&
      parametros.password) {
      User
        .findOne()
        .where({
          email: parametros.email,
          password: parametros.password
        })
        .exec(function (err,User) {
          if (err){
            return res.negotiate(err);}
          if (User) {
            //Si encontro

           // User:User

            Articulo.find()
              .where({
                fkIdUser:User.id,
              }).exec(function (err, articulos) {
              if (err) {
                return res.serverError(err);
              }
              if (!articulos) {
                return res.view('/busqueda');
              }
              /*return res.view('biblioteca',{
                articulos:articulos,
                User:User,

              });*/
              res.cookie('User',User.id)
              //res.send('Cookie seteada')
              res.view('biblioteca',{
                articulos:articulos,
                User:User,

              })

            });
            //res.cookie('user',User.id);
          }
          else {
            //No encontro
            return res.redirect('/');
          }
        });
    }
    else {
      return res.badRequest()
    }
  },




};

