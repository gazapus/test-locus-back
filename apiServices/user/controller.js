var User = require('./model');
const bcrypt = require('bcryptjs');

exports.get_all = function (req, res) {
    User.find({})
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({ message: err.message || "Error retrieving data" })
        })
}

exports.get_one = function (req, res) {
    const id = req.params.id;
    User.findById(id)
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

exports.check_username = function (req, res) {
    const username = req.params.username;
    User.findOne({username: username})
        .then(data => {
            if (data) return res.status(200).send();
            else return res.status(404).send({message: 'Usuario no encontrado'});
        })
        .catch(err => res.status(500).send({ message: err.message || "Error retrieving result with id=" + id }))
};

exports.create = function (req, res) {
    const role = (req.body.role === "" || req.body.role === null) ? "USER" : "ADMIN";
    let user = new User({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        role: role
    })
    user.save()
        .then(data => {
            res.status(200).send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || '"Some error occurred while creating this data'
            })
        })
}

exports.update_email = async function (req, res) {
    try {
        const id = req.body.userId;
        let user = await User.findOne({ email: req.body.email });
        if (user && user.id !== ud) return res.status(400).send({ message: "The email is used" })
        let userUpdated = await User.findByIdAndUpdate(id, { email: req.body.email });
        if (userUpdated) {
            req.body.originalEmail = user.email;
            req.body.newEmail = req.body.email;
            return res.send(userUpdated);
        }
        return res.status(404).send({ message: "Not found result with id " + id });
    } catch (err) {
        return res.status(500).send({ message: err.message || "Error retrieving result with id=" + id });
    }
};

exports.update_username = async function (req, res) {
    try {
        const id = req.body.userId;
        let user = await User.findOne({ username: req.body.username });
        if (user && user.id !== id) return res.status(400).send({ message: "The username is used" })
        let userUpdated = await User.findByIdAndUpdate(id, { username: req.body.username });
        if (userUpdated) return res.send(userUpdated);
        return res.status(404).send({ message: "Not found result with id " + id });
    } catch (err) {
        return res.status(500).send({ message: err.message || "Error retrieving result with id=" + id });
    }
};

exports.update_password = async function (req, res) {
    try {
        const id = req.body.userId;
        const hashPassword = await bcrypt.hash(req.body.password, 10);
        let userUpdated = await User.findByIdAndUpdate(id, { password: hashPassword});
        if (userUpdated) return res.send(userUpdated);
        return res.status(404).send({ message: "Not found result with id " + id });
    } catch (err) {
        return res.status(500).send({ message: err.message || "Error retrieving result with id=" + id });
    }
};

exports.delete_one = async (req, res) => {
    const id = req.params.id;
    try {
        let user = await User.findById(id);
        if(!user) return res.status(404).send({message: `Cannot found result with id=${id}`});
        await user.deleteOne();
        return res.send({message: "result was deleted successfully!"});;
    }catch(err) {
        res.status(500).send({ message: "Could not delete result with id=" + id });
    };
};

exports.delete_all = (req, res) => {
    User.deleteMany({})
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

exports.self_delete = async (req, res) => {
    try {
        let user = await User.findById(req.body.userId);
        if(!user) return res.status(404).send({message: `No se halló cuenta de usuario`});
        await user.deleteOne();
        return res.status(200).send({message: "result was deleted successfully!"});
    }catch(err) {
        res.status(500).send({ message: "Error: No se pudo eliminar"});
    };
};
