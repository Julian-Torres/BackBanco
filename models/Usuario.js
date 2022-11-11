/*
*_id (mongo)
•Tipo de documento (CC,TI,NIT,CE)
•Número de documento (unico)
•Nombres
•Apellidos
•Teléfono 
•Email (usuario)(unico)
•Rol (Administrador, asesor y cliente)
•Contraseña de acceso al sistema (generada aleatoriamente)(encriptada)
•Estado (activo o inactivo)
•Fecha de creación 
•Fecha de actualización)
*/

const { Schema, model } = require('mongoose');

const UsuarioSchema = Schema({
    tipoDocumento: {
        type: String, required: true, enum: ['CC', 'TI', 'NIT', 'CE']
    },
    documento: {
        type: String, required: true, unique: true,
    },
    nombre: {
        type: String, required: true,
    },
    apellido: {
        type: String, required: true,
    },
    email: {
        type: String, required: true, unique: true,
    },
    contrasena: {
        type: String, required: true,
    },
    telefono: {
        type: String, required: true,
    },
    rol: {
        type: String, required: true, enum: ['Admin', 'Asesor', 'Cliente']
    },
    estado: {
        type: String, required: true, enum: ['Activo', 'Inactivo']
    },
    fechaCreacion: {
        type: Date, required: true,
    },
    fechaActualizacion: {
        type: Date, required: true,
    }
});

module.exports = model('Usuario', UsuarioSchema);