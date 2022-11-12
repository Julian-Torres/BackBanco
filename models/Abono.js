/*
•Número de abono (único de 10 dígitos)
•Producto asociado (cuenta bancaria, crédito o seguro)
•Valor abono
•Medio de pago (efectivo o tarjeta débito del mismo banco)
•Número de tarjeta débito (se guarda cuando el abono se haga con este medio)
•Fechas de creación y actualización
*/

const { Schema, model } = require('mongoose');

const AbonoSchema = Schema({
    numeroAbono: {
        type: String, required: true, maxLength: 10, minLength: 10,
    },
    producto: {
        type: Schema.Types.ObjectId, ref: 'Producto', required: true,
    },
    valor: {
        type: Number, required: true,
    },
    medioPago: {
        type: String, required: true, enum: ['Efectivo', 'Tarjeta débito']
    },
    Tarjeta: {
        type: Schema.Types.ObjectId, ref: 'Tarjeta', required: false,
    },
    fechaCreacion: {
        type: Date, required: true,
    },
});

module.exports = model('Abono', AbonoSchema);