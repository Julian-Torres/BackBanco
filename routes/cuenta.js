const { Router } = require('express');
const { check, validationResult } = require('express-validator');
const Cuenta = require('../models/Cuenta')
const { validarJWT } = require('../middlewares/validar-jwt');
const { validarRol } = require('../middlewares/validar-rol-admin');
const { creaContrasena } = require('../helpers/generador')

const router = Router();

//crear cuenta
router.post('/',
    [
        check('usuario', 'Usuario Invalido').not().isEmpty(),
        check('tipo', 'Tipo Invalido').isIn(['Ahorros', 'Corriente']),
        check('saldo', 'Saldo Invalido').not().isEmpty().isNumeric(),
        check('tarjeta', 'Tarjeta Invalida').not().isEmpty(),
        check('estado', 'Estado Invalido').isIn(['Activo', 'Inactivo']),
        validarJWT,
        validarRol,
    ], async function (req, res) {
        try {
            console.log(req.body);
            //validar campos
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ mensaje: errors.array() });
            }
            //validar creacion numeroCuenta unico
            let existe = true;
            while (existe == true) {
                numero = creaContrasena("n");
                const existeNumeroCuenta = await Cuenta.findOne({ numeroCuenta: numero });
                if (!existeNumeroCuenta) {
                    console.log(numero);
                    existe = false;
                }
            }

            //validar uso unico tarjeta
            const usoTarjeta = await Cuenta.findOne({ tarjeta: req.body.tarjeta._id });
            if (usoTarjeta) {
                return res.status(400).json({ mensaje: 'Tarjeta ya en uso' })
            }
            let cuenta = new Cuenta();
            cuenta.numeroCuenta = numero;
            cuenta.usuario = req.body.usuario._id;
            cuenta.tipo = req.body.tipo;
            cuenta.saldo = req.body.saldo;
            cuenta.tarjeta = req.body.tarjeta._id;
            cuenta.estado = req.body.estado;
            cuenta.fechaCreacion = new Date();
            cuenta.fechaActualizacion = new Date();

            cuenta = await cuenta.save();
            res.send(cuenta);

        } catch (error) {
            console.log(error);
            res.status(500).json({ mensaje: 'Error de servidor' })
        }
    }
);
//listar cuentas
router.get('/', [validarJWT], async function (req, res) {
    try {
        const cuentas = await Cuenta.find().populate([
            { path: 'usuario', select: 'documento nombre apellido email' },
            { path: 'tarjeta', select: 'numeroPlastico' }
        ]);
        res.send(cuentas);

    } catch (error) {
        console.log(error);
        res.status(500).send({ mensaje: 'Error de servidor' })
    }
})
// editar cuenta
router.put('/:cuentaId',[check('estado', 'Estado Invalido').isIn(['Activo', 'Inactivo']),validarJWT,validarRol], async function (req, res) {
        try {
            console.log(req.body);
            //validar campos
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ mensaje: errors.array() });
            }

            //llamar cuenta
            let cuenta = await Cuenta.findById(req.params.cuentaId);
            if (!cuenta) {
                return res.status(400).json({ mensaje: 'Cuenta no existe' })
            }

            cuenta.estado = req.body.estado;
            cuenta.fechaActualizacion = new Date();

            cuenta = await cuenta.save();
            res.send(cuenta);

        } catch (error) {
            console.log(error);
            res.status(500).json({ mensaje: 'Error de servidor' })
        }
    }
);
module.exports = router;