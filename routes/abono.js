const { Router } = require('express');
const { oneOf,check, validationResult } = require('express-validator');
const Abono = require('../models/Abono')
const Producto = require('../models/Producto')
const Tarjeta = require('../models/Tarjeta')
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

    ], async function (req, res) {
        try {
            console.log(req.body);
            //validar campos
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ mensaje: errors.array() });
            }

            //llamar Producto
            let producto = await Producto.findById(req.body.producto._id);
            if (!producto) {
                return res.status(400).json({ mensaje: 'Producto no existe' })
            }

            //valor pago mayor o igual a cuota
            valorCuota=producto.valorTotal/producto.cuotas
            if (req.body.valor<valorCuota) {
                return res.status(400).json({ mensaje: 'Valor de cuota insuficiente' })
            }

            //saldo pendiente
            const abonos = await Abono.find({ producto: req.body.producto });
            console.log(abonos);

            console.log("valor",producto.valorTotal);
            saldo = producto.valorTotal
            if (!(abonos.length>0)) {
            }else{
                abonos.forEach(abono => {
                    saldo = saldo-abono.valor
                });
            }
            console.log("saldo",saldo);
            if (saldo<=0){
                return res.status(400).json({ mensaje: 'Este producto ya ha sido pagado' })
            }

            //validar creacion numeroAbono unico
            let existe = true;
            while (existe == true) {
                 numero = creaContrasena("n");
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
            if (!(req.body.tarjeta == "")) {
                const existeTarjeta = await Tarjeta.findOne({ numeroPlastico: req.body.tarjeta });
                if (!existeTarjeta) {
                    return res.status(400).json({ mensaje: 'Tarjeta inexistente' })
                }
            }

            let abono = new Abono();
            abono.numeroAbono = numero;
            abono.producto = req.body.producto;

            //console.log(saldo);
            console.log("pago", req.body.valor);

            if (!(saldo>req.res.valor)){
                abono.valor = saldo;
                //console.log(abono.valor);
                console.log('La cuota exede el saldo pendiente, te devolvemos ',req.body.valor-saldo);
                
            }else{
                abono.valor = req.body.valor;
            }
            abono.medioPago = req.body.medioPago;

            if (!(req.body.tarjeta == "")) {
                abono.tarjeta = req.body.tarjeta;
            }   
            abono.fechaCreacion = new Date();

            abono = await abono.save();

            //console.log(abono);
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

//listar un abono
router.get('/:abonoId',async function(req,res){
    try {
      const abono=await Abono.findById(req.params.abonoId).populate([
        { path: 'producto', select: 'numeroPRoducto valorTotal' },
    ]);
      if(!abono){
       return res.status(404).send('Abono No existe');
      }
      res.send(abono);
    } catch (error) {
         console.log(error);
         res.status(500).send ('Error');
    }
 });    

module.exports = router;