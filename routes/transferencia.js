const { Router } = require('express');
const { check, validationResult } = require('express-validator');
const Abono = require('../models/Abono')
const { validarJWT } = require('../middlewares/validar-jwt');
const { creaContrasena } = require('../helpers/generador');
const Transferencia = require('../models/Transferencia');

const router = Router();

//crear transferencia
router.post('/',
    [
        check('cuentaOrigen', 'Cuenta Origen Invalida').not().isEmpty(),
        check('cuentaDestino', 'Cuenta Destino Invalida').not().isEmpty(),
        check('valor', 'Valor Invalido').not().isEmpty().isNumeric(),
        validarJWT,
    ], async function (req, res) {
        try {
            console.log(req.body);
            //validar campos
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ mensaje: errors.array() });
            }
            //validar creacion numeroTransferencia unico
            let existe = true;
            while (existe = true) {
                const numero = creaContrasena("n");
                const existeNumeroTransferencia = await Transferencia.findOne({ numeroTransferencia: numero });
                if (!existeNumeroTransferencia) {
                    existe = false;
                    console.log(numero);
                }
            }
            //validar cuentaOrigen existe
            const existeCuentaOrigen = await Cuenta.findOne({ numeroCuenta: req.body.cuentaOrigen });
            if (!existeCuentaOrigen) {
                return res.status(400).json({ mensaje: 'Revisa Cuenta Origen' })
            }            
             //validar cuentaDestino existe
             const existeCuentaDestino = await Cuenta.findOne({ numeroCuenta: req.body.cuentaDestino });
             if (!existeCuentaDestino) {
                 return res.status(400).json({ mensaje: 'Revisa Cuenta Destino' })
             }           

            let transferencia = new  Transferencia();
            transferencia.numeroTransferencia = numero;
            transferencia.cuentaOrigen = req.body.cuentaOrigen;
            transferencia.cuentaDestino = req.body.cuentaDestino;
            transferencia.valor = req.body.valor;
            transferencia.fechaCreacion = new Date();

            transferencia = await transferencia.save();

            res.send(transferencia);

            //falta validar fondos suficientes y aplicar la treansferencia entre cuentas

        } catch (error) {
            console.log(error);
            res.status(500).json({ mensaje: 'Error de servidor' })
        }
    }
);
//listar transferencias
router.get('/', [validarJWT], async function (req, res) {
    try {
        const transferencias = await Transferencia.find();
        res.send(transferencias);

    } catch (error) {
        console.log(error);
        res.status(500).send({ mensaje: 'Error de servidor' })
    }
})

module.exports = router;