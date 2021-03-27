let mongoose = require('mongoose');
let Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');

let schema = new Schema({
    user: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true
    },
    newPassword: {
        type: String,
        required: true
    },
    confirmed: {
        type: Boolean,
        default: false
    }
},
    { timestamps: true }
);

schema.pre('save', { document: true, query: false }, async function(next) {
    try {
        this.newPassword = await bcrypt.hash(this.newPassword, 10);
        next();
    } catch(err) {
        console.log(err)
        let error = new Error({message: err.message || 'Error al guardar'});
        next(error)
    }
});

schema.pre("updateOne", { document: true, query: false }, async function (next) {
    try {
        const User = require('../user/model');
        let user = await User.findById(this.user);
        console.log(user)
        user.password = this.newPassword;
        await user.save();
    } catch (err) {
        console.log(err)
        let error = new Error({message: err.message || 'Error al guardar'});
        next(error)
    }
})

schema.method("toJSON", function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
});

module.exports = mongoose.model('ChangePasswordRequest', schema);