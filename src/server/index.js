require('dotenv').config();

let methods = require('./app');
methods.app.listen(process.env.PORT, () => methods.run());