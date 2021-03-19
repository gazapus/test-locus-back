var Test = require('./model');
var User = require('../user/model');

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

exports.get_by_user = async function(req, res) {
    User.findOne({ _id: req.body.userId}).populate('tests').exec(
        function(err, user) {
            if(err) return res.status(400).send({message: err.message || 'Falló la busqueda de usuario'});
            return res.status(200).send(user.tests);
        }
    );
}

exports.create = async function (req, res) {
    try {
        let user = await User.findOne({username: req.params.username});
        if(!user) return res.status(404).send({message: "No se encontro usuario con el username dado"});
        let test = new Test({
            owner: user.id,
            alias: req.body.alias,
            age: req.body.age,
            sex: req.body.sex,
            institution: req.body.institution,
            grade: req.body.grade,
            results: req.body.results,
        })
        let testSaved = await test.save();
        user.tests.push(testSaved.id);
        await user.save();
        return res.status(200).send(testSaved);
    } catch (err) {
        console.log(err)
        return res.status(400).send({message: err.message || "Error al guardar el test"});
    }
}

exports.delete_one = async (req, res) => {
    const id = req.params.id;
    try {
        let test = await Test.findById(id);
        if(!test) return res.status(404).send({message: `Cannot found result with id=${id}`});
        if(test.owner != req.body.userId) return res.status(503).send({message: `Usuario no autorizado`});
        await test.deleteOne();
        return res.send({message: "result was deleted successfully!"});;
    }catch(err) {
        res.status(500).send({ message: "Could not delete result with id=" + id });
    };
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