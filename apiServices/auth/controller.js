var User = require('../user/model');
const bcrypt = require('bcryptjs');
var jwt = require("jsonwebtoken");
const SECRET_KEY = require('config').get('Customer.secret').key;

exports.sign_in = async function (req, res) {
    const A_DAY_IN_MS = 86400;
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) return res.status(404).send({ message: "User not found" });
        if (!user.confirmed) return res.status(400).send({ message: "User must confirm email to finish register" });
        const isPasswordValid = bcrypt.compareSync(req.body.password, user.password);
        if (isPasswordValid) {
            var token = jwt.sign({ id: user.id }, SECRET_KEY, { expiresIn: A_DAY_IN_MS });
            res.status(200).send({
                username: user.username,
                email: user.email,
                accessToken: token
            });
        } else {
            return res.status(404).send({ message: "Invalid password" });
        }
    } catch (err) {
        return res.status(500).send({ message: err });
    }
}

exports.sign_up = async function (req, res, next) {
    const SALT_ROUNDS = 10;
    try {
        const hashPassword = await bcrypt.hash(req.body.password, SALT_ROUNDS);
        let user = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashPassword,
        })
        user.save()
            .then(data => {
                req.body.id = data.id;
                next();
            })
            .catch(err => {
                return res.status(500).send({
                    message: err.message || 'Some error occurred while creating this data'
                })
            })
    } catch (err) {
        return res.status(500).send({ message: err.message || 'Server Error' });
    }
}

exports.confirm = async function (req, res) {
    User.updateOne(
        { _id: req.params.id },
        { confirmed: true },
        (err, response) => {
            if (err) return res.status(500).send({ message: 'Some error occurred while updating this data' });
            if (response.n === 0) return res.status(404).send({ message: 'User not found' });
            return res.status(200).send(response)
        }
    )
}

exports.is_logged = function (req, res) {
    return res.status(200).send('Ok')
}