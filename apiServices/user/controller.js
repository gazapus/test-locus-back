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

exports.create = function (req, res) {
    let user = new User({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
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
/*
exports.update_one = function (req, res) {
    const id = req.params.id;
    User.findOne({ email: req.body.email })
        .then(data => {
            if (data && data.id !== id) {
                return res.status(400).send({ message: "The email is used" })
            } else {
                User.findByIdAndUpdate(id, {
                    email: req.body.email,
                    password: req.body.password,
                })
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
            }
        })
};
*/
exports.delete_one = (req, res) => {
    const id = req.params.id;
    User.findByIdAndRemove(id)
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
