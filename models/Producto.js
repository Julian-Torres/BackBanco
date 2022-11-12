/*
•Número de producto (único de 10 dígitos).
•Usuario asociado
•Tipo de producto(Crédito Vivienda 7%, Crédito Vehículo 10%, Crédito Estudios 5%, Crédito Libre inversión 7%, 
    Tarjeta Crédito 12%, Seguro Vida 10%, Seguro Desempleo 4%, Seguro Accidente 10%)
•Valor total producto
•Número de cuotas (12, 24, 36, 48 o 60)
•Fecha pago mensual (1, 15 o 25 de cada mes)
•Tarjeta asociada (para tarjeta de crédito)
•Estado (activo o inactivo)
•Fechas de creación y actualización
*/

const { Schema, model } = require('mongoose');

const ProductoSchema = Schema({
    numeroProducto: {
        type: String, required: true, maxLength: 10, minLength: 10,
    },
    usuario: {
        type: Schema.Types.ObjectId, ref: 'Usuario', required: true,
    },
    tipo: {
        type: String, required: true, enum: ['Crédito Vivienda', 'Crédito Vehículo', 'Crédito Estudios', 'Crédito Libre inversión',
            'Tarjeta Crédito', 'Seguro Vida', 'Seguro Desempleo', 'Seguro Accidente']
    },
    valorTotal: {
        type: Number, required: true,
    },
    cuotas: {
        type: Number, required: true, enum: [12, 24, 36, 48, 60]
    },
    fechaCorte: {
        type: Number, required: true, enum: [1, 15, 25]
    },
    tarjeta: {
        type: Schema.Types.ObjectId, ref: 'Tarjeta', required: false,
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

module.exports = model('Producto', ProductoSchema);