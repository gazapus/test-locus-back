var Test = require('./model');

exports.get_all = function (req, res) {
    Test.find({})
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({ message: err.message || "Error retrieving data" })
        })
}

exports.get_one = function (req, res) {
    const id = req.params.id;
    Test.findById(id)
        .then(data => {
            if (data)
                res.send(data);
            else
                res.status(404).send({ message: "Not found result with id " + id });
        })
        .catch(err => {
            res
                .status(500)
                .send({ message: err.message || "Error retrieving result with id=" + id });
        });
};

exports.create = async function (req, res) {
    try {
        let test = new Test({
            alias: user.req.body.alias,
            age: user.age,
            sex: user.sex,
            institution: req.body.institution,
            grade: req.body.grade,
            results: req.body.results,
        })
        let testSaved = await test.save();
        return res.status(200).send(testSaved);
    } catch (err) {
        console.log(err)
        return res.status(400).send({message: err.message || "Error al guardar el test"});
    }
}

exports.delete_one = (req, res) => {
    const id = req.params.id;
    Test.findByIdAndRemove(id)
        .then(data => {
            if (data) {
                res.send({
                    message: "result was deleted successfully!"
                });
            } else {
                res.status(404).send({
                    message: `Cannot delete result with id=${id}. Probably result was not found!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete result with id=" + id
            });
        });
};

exports.delete_all = (req, res) => {
    Test.deleteMany({})
        .then(data => {
            res.send({
                message: `${data.deletedCount} results were deleted successfully!`
            });
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while removing all results."
            });
        });
};