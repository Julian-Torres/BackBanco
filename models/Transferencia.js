/*
•Número de transferencia (único de 10 dígitos)
•Cuenta origen
•Cuenta destino
•Monto transferencia
•Fecha de creación y actualización
*/

const { Schema, model } = require('mongoose');

const TransferenciaSchema = Schema({
    numeroTransferencia: {
        type: String, required: true, maxLength: 10, minLength: 10,
    },
    cuentaOrigen: {
        type: Schema.Types.ObjectId, ref: 'Cuenta', required: true,
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

module.exports = model('Transferencia', TransferenciaSchema);