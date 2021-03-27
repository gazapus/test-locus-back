let ChangePasswordRequest = require('./model');
let User = require('../user/model');

exports.get_all = async function (req, res) {
    ChangePasswordRequest.find({})
        .then(data => res.status(200).send(data))
        .catch(err => res.status(500).send({ message: err.message || "Error retrieving data" }))
}

exports.create = async function (req, res, next) {
    
    try {
        const user = await User.findOne({email: req.body.email});
        if(!user) return res.status(404).send({message: 'Usuario no encontrado'});
        let changeRequest = new ChangePasswordRequest({
            user: user.id, 
            newPassword: req.body.newPassword
        });
        await changeRequest.save();
        res.locals.email = user.email;
        res.locals.idRequest = changeRequest.id;
        next();
    } catch (err) {
        return res.status(400).send({ message: 'Hubo un error con esta solicitud' })
    }
}

exports.confirm = async function (req, res) {
    try {
        let change = await ChangePasswordRequest.findById(req.params.id);
        if(!change) return res.status(404).send({message: 'Registro no encontrado'});
        if(change.confirmed) return res.status(400).send({message: 'Solicitud expirada'});
        await change.updateOne({ $set: {confirmed: true}});
        return res.status(200).send({message: 'Cambio realizado correctamente'})
    } catch (err) {
        return res.status(400).send({ message: 'Hubo un error con esta solicitud' })
    }
}


exports.delete_one = async function (req, res) {
    const id = req.params.id;
    ChangePasswordRequest.findOneAndDelete({ _id: id })
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
    ChangePasswordRequest.deleteMany({})
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