module.exports = {
    vistaOculta: function (req, res) {
        return res.view('Oculto/sorpresa');
    },
    /* biblioteca:(req,res)=>{
    
       sails.log.info("Parametros", req.signedCookies.user);
       let parametros = req.allParams();
    
       if(!parametros.biblioteca){
         parametros.biblioteca ='';
    
       }
      Articulo
          .find()
          .where({
            fkIdUser:parametros.idUsuario,
            title:{
              contains:parametros.biblioteca
            }
          })
          .exec((err,articulos)=>{
            if(err) return res.negotiate(err);
    
    
            return res.view('biblioteca',{
              articulos:articulos,
    
            })
          })
      },*/
    biblioteca: function (req, res) {
        var parametros = req.allParams();
        if (parametros.idUsuario) {
            User
                .findOne()
                .where({
                id: parametros.idUsuario
            })
                .exec(function (err, User) {
                if (err) {
                    return res.negotiate(err);
                }
                if (User) {
                    //Si encontro
                    // User:User
                    if (!parametros.biblioteca) {
                        parametros.biblioteca = '';
                        parametros.idUsuario = User.id;
                    }
                    Articulo.find()
                        .where({
                        fkIdUser: User.id,
                        title: {
                            contains: parametros.biblioteca
                        }
                    }).exec(function (err, articulos) {
                        if (err) {
                            return res.serverError(err);
                        }
                        if (!articulos) {
                            return res.view('/busqueda');
                        }
                        return res.view('biblioteca', {
                            articulos: articulos,
                            User: User
                        });
                    });
                }
                else {
                    //No encontro
                    return res.view('/login');
                }
            });
        }
        else {
            return res.badRequest();
        }
    },
    crearArticulo: function (req, res) {
        return res.view('busqueda');
    },
    crearMisArticulos: function (req, res) {
        return res.view('homepage');
    },
};
