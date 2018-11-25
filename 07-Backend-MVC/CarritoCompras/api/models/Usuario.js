/**
 * Created by USRDEL on 26/6/17.
 */
module.exports = {
    attributes: {
        email: {
            type: 'email',
            required: true
        },
        password: {
            type: 'string',
            required: true
        },
        signup: function (inputs, cb) {
            // Create a user
            Usuario.create({
                name: inputs.name,
                email: inputs.email,
                // TODO: But encrypt the password first
                password: inputs.password
            })
                .exec(cb);
        },
        attemptLogin: function (inputs, cb) {
            // Create a user
            Usuario.findOne({
                email: inputs.email,
                // TODO: But encrypt the password first
                password: inputs.password
            })
                .exec(cb);
        }
    }
};
