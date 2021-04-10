const jwt = require('jsonwebtoken');
var User = require('../apiServices/user/model');
const SECRET_KEY = require('config').get('Customer.secret').key;

let checkDuplicatedEmail = (req, res, next) => {
    User.findOne({ email: req.body.email })
        .exec((err, user) => {
            if (err) return res.status(500).send({ message: err });
            if (user) {
                return res.status(400).send({ message: "Failed! Email is already in use!" });
            }
            next();
        })
};

let checkDuplicatedUsername = (req, res, next) => {
    User.findOne({ username: req.body.username })
        .exec((err, user) => {
            if (err) return res.status(500).send({ message: err });
            if (user) {
                return res.status(400).send({ message: "Failed! Username is already in use!" });
            }
            next();
        })
};

let verifyToken = (req, res, next) => {
    let token = req.headers["x-access-token"];
    if (!token) return res.status(403).send({ message: "No authentification token provided!" });
    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) return res.status(401).send({ message: "Unauthorized!" });
        req.body.userId = decoded.id;
        next();
    });
};

let verifyAdmin = (req, res, next) => {
    let token = req.headers["x-access-token"];
    if (!token) return res.status(403).send({ message: "No authentification token provided!" });
    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) return res.status(401).send({ message: "Unauthorized!" });
        const userId = decoded.id;
        User.findById(userId)
            .then(user => {
                if(user.role !== "ADMIN") return res.status(401).send({ message: "No tiene permiso de administrador" });
                next();
            })
            .catch(err => {
                return res.status(500).send({ message: err.message || "Se produjo un error en el servidor" });
            })
    })
}

const authValidation = {
    checkDuplicatedEmail,
    checkDuplicatedUsername,
    verifyToken,
    verifyAdmin
};

module.exports = authValidation