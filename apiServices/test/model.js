let mongoose = require('mongoose');
let Schema = mongoose.Schema;
const functions = require('./utils/functions');
const User = require('../user/model');

let schema = new Schema({
    owner: { type: mongoose.Types.ObjectId, ref: 'User' },
    alias: String,
    age: Number,
    sex: String,
    grade: String,
    institution: String,
    results: [Number],
    locus: { type: String, default: null },
    internal: Number,
    external: Number
},
    { timestamps: true }
);

schema.method("toJSON", function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
});

schema.post("save", async function (doc, next) {
    if (doc.locus) return next();
    try {
        doc.locus = functions.calculateLocus(doc.results);
        doc.internal = functions.calculateInternalResults(doc.results);
        doc.external = functions.calculateExternalResults(doc.results);
        await doc.save();
    } catch (err) {
        let error = new Error(err.message || 'Error al guardar');
        next(error)
    }
})

schema.pre("deleteOne", { document: true, query: false }, async function (next) {
    try {
        let user = await User.findById(this.owner);
        let index = user.tests.findIndex(e => e === this._id);
        user.tests.splice(index, 1);
        await user.save();
    } catch (err) {
        let error = new Error(err.message || 'Error al guardar');
        next(error)
    }
})

module.exports = mongoose.model('Test', schema)