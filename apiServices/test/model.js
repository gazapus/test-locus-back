let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let schema = new Schema({
    alias: String,
    age: Number,
    sex: String,
    grade: String,
    institution: String,
    results: [Number],
    locus: String
},
    { timestamps: true }
);

schema.method("toJSON", function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
});

schema.post("save", async function (doc, next) {
    if(doc.locus) return next();
    console.log("procesar")
})

module.exports = mongoose.model('Test', schema)