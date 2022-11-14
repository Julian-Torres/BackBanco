const { Router } = require('express');
const { check, validationResult } = require('express-validator');
const Abono = require('../models/Abono')
const { validarJWT } = require('../middlewares/validar-jwt');
const { creaContrasena } = require('../helpers/generador');
const Deposito = require('../models/Deposito');

const router = Router();

//crear deposito
router.post('/',
    [
        check('cuentaDestino', 'Cuenta Invalida').not().isEmpty(),
        check('valor', 'Valor Invalido').not().isEmpty().isNumeric(),
        validarJWT,

        //falta añadir el deposito a la cuenta

    ], async function (req, res) {
        try {
            console.log(req.body);
            //validar campos
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ mensaje: errors.array() });
            }
            //validar creacion numeroDeposito unico
            let existe = true;
            while (existe = true) {
                const numero = creaContrasena("n");
                const existeNumeroDeposito = await Deposito.findOne({ existeNumeroDeposito: numero });
                if (!existeNumeroDeposito) {
                    existe = false;
                    console.log(numero);
                }
            }

             //validar cuenta existe
             const existeCuentaDestino = await Cuenta.findOne({ numeroCuenta: req.body.cuentaDestino });
             if (existeCuentaDestino) {
                 return res.status(400).json({ mensaje: 'Revisa Cuenta Origen' })
             } 

            let deposito = new Deposito();
            deposito.numeroDeposito = numero;
            deposito.cuentaDestino = req.body.cuentaDestino;
            deposito.valor = req.body.valor;
            deposito.fechaCreacion = new Date();

            deposito = await deposito.save();

            res.send(deposito);

        } catch (error) {
            console.log(error);
            res.status(500).json({ mensaje: 'Error de servidor' })
        }
    }
);
//listar depositos
router.get('/', [validarJWT], async function (req, res) {
    try {
        const depositos = await Deposito.find();
        res.send(depositos);

    } catch (error) {
        console.log(error);
        res.status(500).send({ mensaje: 'Error de servidor' })
    }
})

module.exports = router;