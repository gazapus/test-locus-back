let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let schema = new Schema({
    username: {
        type: String, lowercase: true, trim: true
    },
    email: {
        type: String, lowercase: true, trim: true
    },
    password: String,
    tests: [{type: Schema.ObjectId, ref: 'Test'}],
    confirmed: { type: Boolean, default: false },
    role: {
        type: String,
        default: "USER"
    }
},
    { timestamps: true }
);

schema.method("toJSON", function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
});

schema.pre("deleteOne", { document: true, query: false }, async function (next) {
    try {
        const Test = require('../test/model');
        await Test.deleteMany({owner: this._id})
        next();
    } catch (err) {
        let error = new Error(err.message || 'Error al guardar');
        next(error)
    }
})

module.exports = mongoose.model('User', schema)