/**
 * Created by CEDIA on 24/07/2017.
 */
declare var module;
declare var sails;
declare var Articulo;
declare var File;


//    localhost:1337/Articulo/metodos

module.exports = {

  eliminarArticulo: (req, res) => { //Función para eliminar artículos de la biblioteca

    let params = req.allParams();    //obtenemos todos los datos de artículo
    sails.log.info("Parametros", params);

    if (req.method == "POST" && params.id) {

      Articulo.destroy({       //Utilizamos la función destroy() de Sails
        id: params.id           //Buscamos la id del artículo
      }).exec((err, articuloBorrado) => {
        if (err) return res.serverError(err); //Controlamos errores
        return res.redirect("/bibliotecaUser")
      })

    } else {
      return res.badRequest();
    }

  },

  VerArticulo:(req,res)=>{
    let parametros = req.allParams();  //obtenemos todos los datos del artículo

    if(parametros.id){
      Articulo.findOne({              //Buscamos los datos del artículo en la base de datos
        id:parametros.id
      })

        .exec((err,articuloEditado)=>{
          if(err) return res.serverError(err);
          if(articuloEditado){

            File.find()                      //Si encontro el artículo
              .where({
                fkIdArticulo:parametros.id    //Indexamos los archivos que tenga el artículo

              }).exec(
              (error,File)=>{
                if(error){                       //Controlamos errores
                  return res.serverError(error);
                }
                if (!File) {                            //Si no existen archivos indexados solo presentamos
                  return res.view('editarArticulo',{    //los datos del artículo en la vista editarArtículo
                    articulos:articuloEditado

                  })
                }
                return res.view('editarArticulo',{     //enviamos los datos del archivo para
                  articulos:articuloEditado,          // presentarlos en la vista editarArtículo
                  File:File

                })
              }
            )

          }else{
            //No encontro
            return res.redirect('/biblioteca')
          }
        })
    }else{
      return res.redirect('/biblioteca')
    }


  },
  editanota:(req,res)=>{

    let parametros = req.allParams();

    if(parametros.title&&
      parametros.country&&
      parametros.notas&&
      parametros.number&&
      parametros.volume&&
      parametros.year&&
      parametros.journal&&
      parametros.editorial&&
      parametros.abstract&&
      parametros.issns&&
      parametros.doi&&
      parametros.language&&
      parametros.category&&
      parametros.pages&&
      parametros.idArticulo){

      Articulo.update({
        id:parametros.idArticulo
      },{
        title:parametros.title,
        country:parametros.country,
        notas:parametros.notas,
        number: parametros.number,
        volume: parametros.volume,
        year: parametros.year,
        journal: parametros. journal,
        editorial: parametros. editorial,
        abstract: parametros.abstract,
        issns:parametros.issns,
        doi:parametros.doi,
        language:parametros.language,
        category:parametros.category,
        pages: parametros.pages,
      })
        .exec((err,Editado)=>{
          if(err) return res.serverError(err);
          if(Editado){
            //Si encontro
            return res.redirect('/VerArticulo?id=' + parametros.idArticulo)
          }else{
            //No encontro
            return res.notFound()
          }
        })
    }else{
      return res.badRequest()
    }
  },

  editarArticulo:(req,res)=>{

    let parametros = req.allParams();

    if(parametros.idArticulo&&
      parametros.title&&
     // parametros.country&&
      parametros.number&&
      parametros.volume&&
      parametros.year&&
      parametros.journal&&
     // parametros.editorial&&
      //parametros.abstract&&
      //parametros.issns&&
     // parametros.language&&
      parametros.keywords&&
      //parametros.category&&
      parametros.pages
      //parametros.notas

    ){

      Articulo.update({
        id:parametros.idArticulo
      },{
        title:parametros.title,
        country:parametros.country,
        number: parametros.number,
        volume: parametros.volume,
        year: parametros.year,
        journal: parametros. journal,
        editorial: parametros. editorial,
        abstract: parametros.abstract,
       issns:parametros.issns,
        doi:parametros.doi,
        language:parametros.language,
        keywords:parametros.keywords,
        category:parametros.category,
        pages: parametros.pages,
        notas: parametros.notas,
      })
        .exec((err,Editado)=>{
          if(err) return res.serverError(err);
          if(Editado){
            //Si encontro
            return res.redirect('/VerArticulo?id=' + parametros.idArticulo)
          }else{
            //No encontro
            return res.notFound()
          }
        })
    }else{
      return res.badRequest()
    }

  }
}
