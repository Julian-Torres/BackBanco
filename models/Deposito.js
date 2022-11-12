/*
•Número de depósito (único de 10 dígitos)
•Cuenta destino
•Monto
•Fecha de creación y actualización
*/

const { Schema, model } = require('mongoose');

const DepositoSchema = Schema({
    numeroDeposito: {
        type: String, required: true, maxLength: 10, minLength: 10,
    },
    cuentaDestino: {
        type: Schema.Types.ObjectId, ref: 'Cuenta', required: true,
    },
    valor: {
        type: Number, required: true,
    },
    fechaCreacion: {
        type: Date, required: true,
    },
});

module.exports = model('Deposito', DepositoSchema);