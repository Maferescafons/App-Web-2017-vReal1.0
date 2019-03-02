/**
 * User.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */
var bcrypt = require("bcrypt");
module.exports = {
  connection: 'Mysqladapter',
  autoCreatedAt: false,
  autoUpdatedAt: false,
    attributes: {
      id: {
        type: "integer",
        autoIncrement: true,
        primaryKey: true
      },
      name: {
        type: 'string',
        required: true,
        unique: true,
      },
      email: {
        type: 'email',
        required: true,
        unique: true,
      },
      password: {
        type: 'longtext',
        required: true
      },
      Articulos: {
        collection: 'Articulo',
        via: 'fkIdUser'
      }

    },


    /**
     * Create a new user using the provided inputs,
     * but encrypt the password first.
     *
     * @param  {Object}   inputs
     *                     • name     {String}
     *                     • email    {String}
     *                     • password {String}
     * @param  {Function} cb
     */

    signup: function (inputs, cb) {
      // Create a user
      User.create({
        name: inputs.name,
        email: inputs.email,
        // TODO: But encrypt the password first
        password: inputs.password
      })
        .exec(cb);
    },



    /**
     * Check validness of a login using the provided inputs.
     * But encrypt the password first.
     *
     * @param  {Object}   inputs
     *                     • email    {String}
     *                     • password {String}
     * @param  {Function} cb
     */

    attemptLogin: function (inputs, cb) {
      // Create a user
      User.findOne({
        email: inputs.email,
        // TODO: But encrypt the password first
        password: bcrypt.compare(inputs.password, User.password)
      })
        .exec(cb);
    },

  beforeCreate: function (values, next) {
    // This checks to make sure the password and password confirmation match before creating record
    bcrypt.genSalt(10, function(err, salt) {
      if (err) return next(err);
      bcrypt.hash(values.password, salt, function passwordEncrypted(err, encryptedPass) {
        if (err) return next(err);
        values.password = encryptedPass;
        next();
      });
    });
  }

};


