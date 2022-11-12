const express = require('express');
const { getConnection } = require('./db/db-config');
const cors = require('cors');
const UsuarioRoute = require('./routes/usuario');
const AuthRoute = require('./routes/auth');

const app = express();
const port =4000;

getConnection(); 

//cors
app.use(cors());
//json
app.use(express.json());

//rutas
app.use('/usuario', UsuarioRoute);
app.use('/login', AuthRoute);

//server
app.listen(port, () => {
    console.log('Server ON on port', port);
});