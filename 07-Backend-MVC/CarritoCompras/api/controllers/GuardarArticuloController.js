// /Saludo/crearMiArticulo
module.exports = {
    crearArticuloQuemado: function (req, res) {
        var parametros = req.allParams(); //obtenemos todos los datos del artículo
        var nuevoArticulo = {
            country: parametros.country,
            number: parametros.number,
            title: parametros.title,
            volume: parametros.volume,
            year: parametros.year,
            journal: parametros.journal,
            editorial: parametros.editorial,
            abstract: parametros.abstract,
            issns: parametros.issns,
            language: parametros.language,
            keywords: parametros.keywords,
            link: parametros.link,
            authores: parametros.authores,
            category: parametros.category,
            pages: parametros.pages,
            notas: parametros.notas
        };
        Articulo.create(nuevoArticulo) // creamos un nuevo registro en la base
            .exec(function (error, articuloCreado) {
            if (error) {
                return res.serverError(error);
            }
            else {
                return res.view('busquedaArxiv'); //redirigimos a la vista del modulo recomendador
            }
        });
    },
    Busqueda: function (req, res) {
        Articulo.find().exec(function (err, articulos) {
            if (err)
                return res.negotiate(err);
            sails.log.info("Articulo", articulos);
            return res.view('bilioteca', {
                articulos: articulos
            });
        });
    },
    biblioteca: function (req, res) {
        Articulo.find().exec(function (err, articulos) {
            if (err)
                return res.negotiate(err);
            sails.log.info("articulo", articulos);
            return res.view('busqueda', {
                articulos: articulos
            });
        });
    },
    crearUsuario: function (req, res) {
        return res.view('busqueda');
    },
    VerArticuloSpringer: function (req, res) {
        if (Articulo.authores == '') {
            return res.view('busqueda');
        }
        else {
            //return res.ok(articuloCreado);
            return res.created('Nuevo articulo creado.');
        }
    },
    viewFile: function (req, res) {
        file.find().exec(function (err, file) {
            if (err)
                return res.negotiate(err);
            sails.log.info("file", file);
            return res.view('editarArticulo', {
                file: file
            });
        });
    },
};
