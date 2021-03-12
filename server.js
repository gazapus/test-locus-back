const app = require('./app');
const config = require('config');
const mongoose = require('mongoose');

const dbConfig = config.get('Customer.dbConfig');
const PORT = process.env.PORT || dbConfig.port;

mongoose
    .connect(`${dbConfig.host}/${dbConfig.dbName}`, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => {
        console.log("Connected to the database!");
    })
    .catch(err => {
        console.log("Cannot connect to the database!", err);
        process.exit();
    });

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});