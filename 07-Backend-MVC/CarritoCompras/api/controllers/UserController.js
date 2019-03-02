/**
 * UserController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
var bcrypt = require("bcrypt");
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

    var parametros = req.allParams();
    var nuevoUsuario = {
      name: parametros.name,
      email: parametros.email,
      password: parametros.password
    };
    if(parametros.email) {
      User
        .findOne()
        .where({
          email: parametros.email
        })
        .exec(function (err,user) {
          if (err){
            return res.negotiate(err);}
          if (user) {
            //Si encontro:
            return res.send('Ya existe un usuario registrado con ese correo');
            //res.redirect('/');
          }
          else {
            //No encontro
            User.create(nuevoUsuario)
              .exec(function (error, usuarioCreado) {
                if (error) {
                  return res.serverError(error);
                }
                else {
                  //res.cookie('User',usuarioCreado.id)
                  res.redirect('/');
                  //VerUsuario?email=nuevo2%40hotmail.com&password=1234
                }
              });
          }
        });
    }

  },
  VerUsuario: function (req, res) {

    var parametros = req.allParams();
    if(parametros.email&&
      parametros.password) {

      User
        .findOne()
        .where({
          email: parametros.email
        })
        .exec(function (err,User) {
          if (err){
            return res.negotiate(err);}
          if (User) {
            //Si encontro:
            bcrypt.compare(parametros.password, User.password, function (err, valid) {
              console.log(err);
              if (err) return next(err);

              if(!valid) {
                res.redirect('/');
                return;
              }
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
                res.cookie('User',User.id)
                //res.send('Cookie seteada')
                res.view('biblioteca',{
                  articulos:articulos,
                  User:User,

                })

              });

            }); //end bcrypt.compare

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

