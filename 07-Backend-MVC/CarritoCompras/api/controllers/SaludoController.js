/**
 * Created by USRDEL on 19/6/17.
 */
// /Saludo/crearMiArticulo
module.exports = {
    welcome: function (req, res) {
        sails.log.info(req.method);
        if (req.method == "POST") {
            return res.json({ saludo: "hola" });
        }
        else {
            return res.send("Error");
        }
    },
    bienvenido: function (req, res) {
        //PUT
        return res.send("Hola");
    },
    crearMiArticulo: function (req, res) {
        var parametros = req.allParams();
        var nuevoArticulo = {
            title: parametros.title,
            country: parametros.country,
            number: parametros.number,
            volume: parametros.volume,
            year: parametros.year,
            journal: parametros.journal,
            editorial: parametros.editorial,
            abstract: parametros.abstract,
            issns: parametros.issns,
            language: parametros.language,
            keywords: parametros.keywords,
            link: parametros.link,
            authors: parametros.authors,
            category: parametros.category,
            pages: parametros.starpage + "-" + parametros.endpage,
            notas: parametros.notas,
            fkIdUser: parametros.idUsuario
        };
        MiArticulo.create(nuevoArticulo)
            .exec(function (error, articuloCreado) {
            if (error) {
                return res.serverError(error);
            }
            else {
                MiArticuloId = articuloCreado.id;
                res.redirect('/VerMisArticulo?id=' + MiArticuloId);
            }
        });
    },
    VerMisArticulos: function (req, res) {
        req.cookies.User;
        sails.log.info("idUser", req.cookies.User);
        // res.send('Cookie seteada',req.cookies.User)
        var parametros = req.allParams();
        User
            .findOne()
            .where({
            id: req.cookies.User
        })
            .exec(function (err, User) {
            if (err) {
                return res.negotiate(err);
            }
            if (User) {
                //Si encontro
                // User:User
                if (!parametros.mibiblioteca) {
                    parametros.mibiblioteca = '';
                    parametros.idUsuario = req.cookies.User;
                }
                MiArticulo.find()
                    .where({
                    fkIdUser: req.cookies.User,
                    title: {
                        contains: parametros.mibiblioteca
                    }
                }).exec(function (err, Miarticulo) {
                    if (err) {
                        return res.serverError(err);
                    }
                    if (!Miarticulo) {
                        return res.view('/homepage');
                    }
                    return res.view('MisArticulos', {
                        MiArticulo: Miarticulo,
                        User: User
                    });
                });
            }
            else {
                //No encontro
                return res.redirect('/');
            }
        });
    },
    eliminarmiArticulo: function (req, res) {
        var params = req.allParams();
        sails.log.info("Parametros", params);
        if (req.method == "POST" && params.id) {
            MiArticulo.destroy({
                id: params.id
            }).exec(function (err, articuloBorrado) {
                if (err)
                    return res.serverError(err);
                return res.redirect("/MisArticulos");
            });
        }
        else {
            return res.badRequest();
        }
    },
    VerMiArticulo: function (req, res) {
        var parametros = req.allParams();
        if (parametros) {
            MiArticulo.findOne({
                id: parametros.id,
            })
                .exec(function (err, articuloEditado) {
                if (err) {
                    return res.serverError(err);
                }
                if (articuloEditado) {
                    //Si encontro
                    MiFile.find()
                        .where({
                        fkIdMiArticulo: parametros.id
                    }).exec(function (err, MiFile) {
                        if (err) {
                            return res.serverError(err);
                        }
                        if (!MiFile) {
                            return res.view('verMisArticulos', {
                                Miarticulo: articuloEditado
                            });
                        }
                        return res.view('verMisArticulos', {
                            Miarticulo: articuloEditado,
                            MiFile: MiFile
                        });
                    });
                }
                else {
                    //No encontro
                    return res.view('MisArticulos');
                }
            });
        }
        else {
            return res.view('MisArticulos');
        }
    },
};
