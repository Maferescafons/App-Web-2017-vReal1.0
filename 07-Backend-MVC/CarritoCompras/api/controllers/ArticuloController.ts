/**
 * Created by CEDIA on 24/07/2017.
 */
declare var module;
declare var sails;
declare var Articulo;
declare var File;


//    localhost:1337/Articulo/metodos

module.exports = {

  eliminarArticulo: (req, res) => {

    let params = req.allParams();
    sails.log.info("Parametros", params);

    if (req.method == "POST" && params.id) {

      Articulo.destroy({
        id: params.id
      }).exec((err, articuloBorrado) => {
        if (err) return res.serverError(err);
        return res.redirect("/biblioteca")
      })

    } else {
      return res.badRequest();
    }

  },

  VerArticulo:(req,res)=>{

    let parametros = req.allParams();

    if(parametros.id){
      Articulo.findOne({
        id:parametros.id
      })

        .exec((err,articuloEditado)=>{
          if(err) return res.serverError(err);
          if(articuloEditado){
            //Si encontro
            File.find()
              .where({
                fkIdArticulo:parametros.id

              }).exec(
              (error,File)=>{
                if(error){
                  return res.serverError(error);
                }
                if (!File) {
                  return res.view('editarArticulo',{
                    articulos:articuloEditado

                  })
                }
                return res.view('editarArticulo',{
                  articulos:articuloEditado,
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
      parametros. year&&
      parametros. journal&&
      parametros. editorial&&
      parametros.abstract&&
      parametros.issns&&
      parametros.language&&
      parametros.category&&
      parametros. pages&&
      parametros.id){

      Articulo.update({
        id:parametros.id
      },{
        title:parametros.title,
        country:parametros.country,
        notas:parametros.notas,
        number: parametros.number,
        volume: parametros.volume,
        year: parametros. year,
        journal: parametros. journal,
        editorial: parametros. editorial,
        abstract: parametros.abstract,
        issns:parametros.issns,
        language:parametros.language,
        category:parametros.category,
        pages: parametros. pages,
      })
        .exec((err,Editado)=>{
          if(err) return res.serverError(err);
          if(Editado){
            //Si encontro
            return res.redirect('/VerArticulo?id=' + parametros.id)
          }else{
            //No encontro
            return res.notFound()
          }
        })
    }else{
      return res.badRequest()
    }




  },
}
