let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let schema = new Schema({
    user: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true
    },
    originalEmail: {
        type: String,
        required: true
    },
    newEmail: {
        type: String,
        required: true
    },
    confirmed: {
        type: Boolean,
        default: false
    },
    canceled: {
        type: Boolean,
        default: false
    }
},
    { timestamps: true }
);

schema.post("save", async function (doc, next) {
    if (!doc.confirmed && !doc.canceled) next();
    try {
        const User = require('../user/model');
        let user = await User.findById(doc.user);
        user.email = (doc.confirmed && !doc.canceled) ? doc.newEmail : doc.originalEmail;
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

module.exports = mongoose.model('RequestChange', schema);