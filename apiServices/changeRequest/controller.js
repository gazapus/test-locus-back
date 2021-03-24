let ChangeRequest = require('./model');
let User = require('../user/model');

exports.get_all = async function (req, res) {
    ChangeRequest.find({})
        .then(data => res.status(200).send(data))
        .catch(err => res.status(500).send({ message: err.message || "Error retrieving data" }))
}

exports.create = async function (req, res, next) {
    try {
        let user = await User.findById(req.body.userId);
        let changeRequest = new ChangeRequest({
            user: req.body.userId,
            originalEmail: user.email,
            newEmail: req.body.email
        })
        let result = await changeRequest.save();
        res.locals.request_id = result._id;
        res.locals.originalEmail = user.email;
        next();
    } catch(err) {
        res.status(500).send({
            message: err.message || '"Some error occurred while creating this request'
        })
    }
}

exports.confirm = async function (req, res, next) {
    const id = req.params.id;
    try {
        let changeRequest = await ChangeRequest.findById(id);
        if(!changeRequest)  return res.status(404).send({ message: 'Cambio de email no encontrado' })
        if (changeRequest.canceled || changeRequest.confirmed)
            return res.status(400).send({ message: 'Este cambio ya ha expirado' })
        changeRequest.confirmed = true;
        res.locals.email = changeRequest.newEmail;
        await changeRequest.save();
        next();
    } catch(err) {
        res.status(500).send({ message: err.message || 'Se produjo un error al realizar esta confirmación'})
    }
}

exports.cancel = async function (req, res, next) {
    const id = req.params.id;
    try {
        let changeRequest = await ChangeRequest.findById(id);
        if(!changeRequest)  return res.status(404).send({ message: 'Cambio de email no encontrado' })
        if (changeRequest.canceled)
            return res.status(400).send({ message: 'Este cambio ya ha expirado' })
        changeRequest.canceled = true;
        await changeRequest.save();
        res.locals.email = changeRequest.originalEmail;
        next();
    } catch(err) {
        res.status(500).send({ message: err.message || 'Se produjo un error al realizar esta cancelación'})
    }
}

exports.delete_one = async function (req, res) {
    const id = req.params.id;
    ChangeRequest.findOneAndDelete({ _id: id })
        .then(data => {
            res.status(200).send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || '"Some error occurred while deleting this request'
            })
        })
}
exports.delete_all = async function (req, res) {
    ChangeRequest.deleteMany({})
        .then(data => {
            res.status(200).send({
                message: `${data.deletedCount} results were deleted successfully!`
            });
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || '"Some error occurred while deleting this request'
            })
        })
}