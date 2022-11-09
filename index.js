const express =require('express');
const {getConnection}=require('./db/db-config');
const cors =require('cors');
const UsuarioRoute=require('./routes/usuario');
const AuthRoute=require('./routes/auth');

getConnection();

const app=express();
//cors
app.use(cors());
//json
app.use(express.json());

//rutas
app.use('/usuario',UsuarioRoute);
app.use('/login',AuthRoute);

//server
app.listen(4000,()=>{
    console.log('Server ON');
});