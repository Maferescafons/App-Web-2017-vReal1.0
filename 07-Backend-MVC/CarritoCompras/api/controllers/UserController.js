/**
 * UserController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
var bcrypt = require("bcrypt");
module.exports = {
  login: function (req, res) {
    res.clearCookie("User"),        // Borra la Cookie con información del usuario anterior.
      res.clearCookie("user")
    // See `api/responses/login.js`
    return res.login({                        // Se obtiene los datos proporcionados por el usuario
      email: req.param('email'),
      password: req.param('password'),

      successRedirect:'/VerUsuario',         //Función que se ejecuta si la petición se ha realizado de forma correcta
      invalidRedirect: '/',
    });
  },

  logout: function (req, res) {
   // "Olvida" al usuario de la sesión.
    // Las solicitudes posteriores de este agente de usuario NO tendrán `req.session.me`.
    req.session.me = null;

    // enviar una respuesta simple para que el agente de usuario sepa que se desconectó
    // exitosamente.
    if (req.wantsJSON) {
      return res.ok('Logged out successfully!');
    }
    // Borra la Cookie con informacion del usuario.
    return res.clearCookie("User"),
      res.redirect('/');
  },

  signup: function (req, res) {

    var parametros = req.allParams();
    var nuevoUsuario = {                  // Registrar a un usuario usando los parámetros provistos
      name: parametros.name,
      email: parametros.email,
      password: parametros.password
    };
    if(parametros.email) {                // Controlamos que no se guarde otro usuario con el mismo email
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
            User.create(nuevoUsuario)                   //Si no se trata de otro usuario con el mismo email
              .exec(function (error, usuarioCreado) {   //se procede a guardar en la base los datos del usuario
                if (error) {
                  return res.serverError(error);
                }
                else {
                  if (usuarioCreado) {
                    Mailer.sendWelcomeMail(usuarioCreado);  // <= Here we using
                    res.redirect('/');
                  }
                }
              });
          }
        });
    }

  },
  VerUsuario: function (req, res) {
    var parametros = req.allParams();         // Se obtiene los datos proporcionados por el usuario en el loguin
    if(parametros.email&&
      parametros.password) {
      User
        .findOne()
        .where({                            // Buscamod en la base el usuario con los datos proporcionados
          email: parametros.email
        })
        .exec(function (err,User) {
          if (err){
            return res.negotiate(err);}
          if (User) {
            //Si encontro:
            bcrypt.compare(parametros.password, User.password, function (err, valid) {
              console.log(err);
              if (err) return next(err);         //Encriptamos la contraseña

              if(!valid) {
                res.redirect('/');
                return;
              }
              Articulo.find()
                .where({                             //Indexamos los artículos del usuario para mostrarlos
                  fkIdUser:User.id,
                }).exec(function (err, articulos) {
                if (err) {
                  return res.serverError(err);
                }
                if (!articulos) {
                  return res.view('/busqueda');
                }
                res.cookie('User',User.id)            //Guardamos el id de usuario en una cookie
                //res.send('Cookie seteada')
                res.view('biblioteca',{
                  articulos:articulos,               //Presentamos los datos en la vista biblioteca
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

