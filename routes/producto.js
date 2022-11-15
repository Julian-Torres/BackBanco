const { Router } = require('express');
const { check, validationResult } = require('express-validator');
const Producto = require('../models/Producto')
const { validarJWT } = require('../middlewares/validar-jwt');
const { validarRol } = require('../middlewares/validar-rol-admin');
const { creaContrasena } = require('../helpers/generador')

const router = Router();

//crear producto
router.post('/',
    [
        check('usuario', 'Usuario Invalido').not().isEmpty(),
        check('valor', 'Valor Invalido').not().isEmpty().isNumeric(),
        check('cuotas', 'Cuotas Invalidas').isIn([12, 24, 36, 48, 60]),
        check('fechaCorte', 'fechaCorte Invalida').isIn([1, 15, 25]),
        //validar condicional solo si tipo 'Tarjeta Credito'
        oneOf([
            [
                check('tipo', 'Tipo invalido').isIn(['Tarjeta crédito']),
                check('tarjeta', 'Falta Tarjeta').not().isEmpty()
            ], // si tipo es tarjeta credito, campo tarjeta no puede estar vacio.
            [
                check('tipo', 'Tipo Invalido').isIn(['Crédito Vivienda', 'Crédito Vehículo', 'Crédito Estudios', 'Crédito Libre inversión', 'Seguro Vida', 'Seguro Desempleo', 'Seguro Accidente']),
            ]
        ]),
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
            //validar creacion numeroProducto unico
            let existe = true;
            while (existe = true) {
                const numero = creaContrasena("n");
                const existeNumeroProducto = await Producto.findOne({ numeroProducto: numero });
                if (!existeNumeroProducto) {
                    existe = false;
                    console.log(numero);
                }
            }
            //validar usuario existe
            const existeUsuario = await Usuario.findOne({ documento: req.body.usuario });
            if (!existeUsuario) {
                return res.status(400).json({ mensaje: 'Usuario inexistente' })
            }

            //validar si tarjeta existe si es necesario
            if (req.body.tarjeta != null) {
                const existeTarjeta = await Tarjeta.findOne({ numeroPlastico: req.body.tarjeta });
                if (!existeTarjeta) {
                    return res.status(400).json({ mensaje: 'Tarjeta inexistente' })
                }
            }

            let producto = new Producto();
            producto.numeroProducto = numero;
            producto.usuario = req.body.usuario;
            producto.tipo = req.body.tipo;
            producto.valor = req.body.valor;
            producto.cuotas = req.body.cuotas;
            producto.fechaCorte = req.body.fechaCorte;
            producto.tarjeta = req.body.tarjeta;
            producto.estado = req.body.estado;
            producto.fechaCreacion = new Date();
            producto.fechaActualizacion = new Date();

            producto = await producto.save();
            res.send(producto);

        } catch (error) {
            console.log(error);
            res.status(500).json({ mensaje: 'Error de servidor' })
        }
    }
);
//listar productos
router.get('/', [validarJWT], async function (req, res) {
    try {
        const productos = await Producto.find();
        res.send(productos);

    } catch (error) {
        console.log(error);
        res.status(500).send({ mensaje: 'Error de servidor' })
    }
})

module.exports = router;