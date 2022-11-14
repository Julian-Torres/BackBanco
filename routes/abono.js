const { Router } = require('express');
const { check, validationResult } = require('express-validator');
const Abono = require('../models/Abono')
const { validarJWT } = require('../middlewares/validar-jwt');
const { creaContrasena } = require('../helpers/generador')

const router = Router();

//crear abono
router.post('/',
    [
        check('producto', 'Producto Invalido').not().isEmpty(),
        check('valor', 'Valor Invalido').not().isEmpty().isNumeric(),
        //validar condicional solo si medioPago 'Tarjeta debito'
        oneOf([
            [
                check('medioPago', 'Medio de Pago Invalido').isIn(['Tarjeta débito']),
                check('tarjeta', 'Falta Tarjeta').not().isEmpty()
            ], // si tipo es tarjeta debito, campo tarjeta no puede estar vacio.
            [
                check('medioPago', 'Medio de Pago Invalido').isIn(['Efectivo']),
            ]
        ]),
        validarJWT,

        //falta añadir el abono al producto *preguntar como se lelva registro de la cantidad total pagada*

    ], async function (req, res) {
        try {
            console.log(req.body);
            //validar campos
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ mensaje: errors.array() });
            }

            //validar creacion numeroAbono unico
            let existe = true;
            while (existe = true) {
                const numero = creaContrasena("n");
                const existeNumeroAbono = await Abono.findOne({ numeroAbono: numero });
                if (!existeNumeroAbono) {
                    existe = false;
                    console.log(numero);
                }
            }

             //validar producto existe
             const existeProducto = await Producto.findOne({ numeroProducto: req.body.producto });
             if (existeProducto) {
                 return res.status(400).json({ mensaje: 'Producto inexistente' })
             }            

            //validar tarjeta existe si es encesario
            if(req.body.tarjeta!=null){
                const existeTarjeta = await Tarjeta.findOne({ numeroPlastico: req.body.tarjeta });
                if (!existeTarjeta) {
                    return res.status(400).json({ mensaje: 'Tarjeta inexistente' })
                } 
            }

            let abono = new Abono();
            abono.numeroAbono = numero;
            abono.producto = req.body.producto;
            abono.valor = req.body.valor;
            abono.medioPago = req.body.medioPago;
            abono.tarjeta = req.body.tarjeta;
            abono.fechaCreacion = new Date();

            abono = await abono.save();

            res.send(abono);

        } catch (error) {
            console.log(error);
            res.status(500).json({ mensaje: 'Error de servidor' })
        }
    }
);
//listar abonos
router.get('/', [validarJWT], async function (req, res) {
    try {
        const abonos = await Abono.find();
        res.send(abonos);

    } catch (error) {
        console.log(error);
        res.status(500).send({ mensaje: 'Error de servidor' })
    }
})

module.exports = router;