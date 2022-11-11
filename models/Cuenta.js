/*
•Número de cuenta (único de 10 dígitos, autogenerado por el sistema).
•Usuario asociado
•Tipo de cuenta( Ahorros 3%,Corriente 1%)
•Valor depósito inicial
•Tarjeta asociada
•Estado (activo o inactivo)
•Fechas de creación y actualización
*/

const { Schema, model } = require('mongoose');

const CuentaSchema = Schema({
    numeroCuenta: {
        type: String, required: true, maxLength: 10, minLength: 10,
    },
    usuario: {
        type: Schema.Types.ObjectId, ref: 'Usuario', required: true,
    },
    tipo: {
        type: String, required: true, enum: ['Ahorros', 'Corriente']
    },
    valor: {
        type: Number, required: true,
    },
    tarjeta: {
        type: Schema.Types.ObjectId, ref: 'Tarjeta', required: true,
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

module.exports = model('Cuenta', CuentaSchema);