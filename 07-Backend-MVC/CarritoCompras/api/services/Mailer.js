/**
 * Created by Fernanda on 12/03/2019.
 */
module.exports.sendWelcomeMail = function(usuarioCreado) {
  sails.hooks.email.send(
 'welcomeEmail',
  {
    Name: usuarioCreado.name
  },
  {
    to: usuarioCreado.email,
      subject: 'Welcome Email'
  },
  function(err) {console.log(err || 'Mail Sent!',usuarioCreado.email);

 }
  )

}
