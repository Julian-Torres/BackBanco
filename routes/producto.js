const { Router } = require('express');
const { oneOf, check, validationResult } = require('express-validator');
const Producto = require('../models/Producto')
const Usuario = require('../models/Usuario')
const Tarjeta = require('../models/Tarjeta')
const { validarJWT } = require('../middlewares/validar-jwt');
const { validarRol } = require('../middlewares/validar-rol-admin');
const { creaContrasena } = require('../helpers/generador')

const router = Router();

//crear producto
router.post('/',
    [
        check('usuario', 'Usuario Invalido').not().isEmpty(),
        check('valor', 'Valor Invalido').isNumeric().not().isEmpty(),
        check('cuotas', 'Cuotas Invalidas').isIn([12, 24, 36, 48, 60]),
        check('fechaCorte', 'fechaCorte Invalida').isIn([1, 15, 25]),
        //validar condicional solo si tipo 'Tarjeta Credito'
        oneOf([
            [
                check('tipo', 'Tipo invalido').isIn(['Tarjeta Credito']),
                check('tarjeta', 'Falta Tarjeta').not().isEmpty()
            ], // si tipo es tarjeta credito, campo tarjeta no puede estar vacio.
            [
                check('tipo', 'Tipo Invalido').isIn(['Credito Vivienda', 'Credito Vehículo', 'Credito Estudios', 'Credito Libre inversión', 'Seguro Vida', 'Seguro Desempleo', 'Seguro Accidente']),
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
            while (existe == true) {
                numero = creaContrasena("n");
                const existeNumeroProducto = await Producto.findOne({ numeroProducto: numero });
                if (!existeNumeroProducto) {
                    existe = false;
                    console.log(numero);
                }
            }

            //llamar usuario
            let usuario = await Usuario.findById(req.body.usuario._id);
            if (!usuario) {
                return res.status(400).json({ mensaje: 'Usuario no existe' })
            }

            //llamar tarjeta si es necesario
            if (req.body.tipo == "Tarjeta Credito") {
                let tarjeta = await Tarjeta.findById(req.body.tarjeta._id);
                if (!tarjeta) {
                    return res.status(400).json({ mensaje: 'Tarjeta no existe' })
                }
            }


            let producto = new Producto();
            producto.numeroProducto = numero;
            producto.usuario = req.body.usuario._id;
            producto.tipo = req.body.tipo;
            producto.valorTotal = req.body.valor;
            producto.cuotas = req.body.cuotas;
            producto.fechaCorte = req.body.fechaCorte;
            producto.tarjeta = req.body.tarjeta._id;
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
        const productos = await Producto.find().populate([
            { path: 'usuario', select: 'documento nombre apellido email' },
            { path: 'tarjeta', select: 'numeroPlastico' }
        ]);
        res.send(productos);

    } catch (error) {
        console.log(error);
        res.status(500).send({ mensaje: 'Error de servidor' })
    }
})
//editar producto
router.put('/:productoId',
    [
        check('cuotas', 'Cuotas Invalidas').isIn([12, 24, 36, 48, 60]),
        check('fechaCorte', 'fechaCorte Invalida').isIn([1, 15, 25]),
        //validar condicional solo si tipo 'Tarjeta Credito'
        oneOf([
            [
                check('tipo', 'Tipo invalido').isIn(['Tarjeta Credito']),
                check('tarjeta', 'Falta Tarjeta').not().isEmpty()
            ], // si tipo es tarjeta credito, campo tarjeta no puede estar vacio.
            [
                check('tipo', 'Tipo Invalido').isIn(['Credito Vivienda', 'Credito Vehículo', 'Credito Estudios', 'Credito Libre inversión', 'Seguro Vida', 'Seguro Desempleo', 'Seguro Accidente']),
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

            //llamar producto
            let producto = await Producto.findById(req.params.productoId);
            if (!producto) {
                return res.status(400).json({ mensaje: 'Producto no existe' })
            }

            //llamar tarjeta si es necesario
            if (req.body.tipo == "Tarjeta Credito") {
                let tarjeta = await Tarjeta.findById(req.body.tarjeta._id);
                if (!tarjeta) {
                    return res.status(400).json({ mensaje: 'Tarjeta no existe' })
                }
            }

            producto.tipo = req.body.tipo;
            producto.cuotas = req.body.cuotas;
            producto.fechaCorte = req.body.fechaCorte;
            producto.tarjeta = req.body.tarjeta._id;
            producto.estado = req.body.estado;
            producto.fechaActualizacion = new Date();

            producto = await producto.save();
            res.send(producto);

        } catch (error) {
            console.log(error);
            res.status(500).json({ mensaje: 'Error de servidor' })
        }
    }
);
module.exports = router;