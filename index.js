const express = require('express');
const { getConnection } = require('./db/db-config');
const cors = require('cors');
const UsuarioRoute = require('./routes/usuario');
const AbonoRoute = require('./routes/abono');
const CuentaRoute = require('./routes/cuenta');
const DepositoRoute = require('./routes/deposito');
const ProductoRoute = require('./routes/producto');
const TarjetaRoute = require('./routes/tarjeta');
const TransferenciaRoute = require('./routes/transferencia');

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
app.use('/abono', AbonoRoute);
app.use('/cuenta', CuentaRoute);
app.use('/deposito', DepositoRoute);
app.use('/producto', ProductoRoute);
app.use('/tarjeta', TarjetaRoute);
app.use('/transferencia', TransferenciaRoute);

app.use('/login', AuthRoute);

//server
app.listen(port, () => {
    console.log('Server ON on port', port);
});