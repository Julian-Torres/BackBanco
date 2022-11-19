const { Router } = require('express');
const { check, validationResult } = require('express-validator');
const Deposito = require('../models/Deposito')
const Cuenta = require('../models/Cuenta')
const { validarJWT } = require('../middlewares/validar-jwt');
const { creaContrasena } = require('../helpers/generador');

const router = Router();

//crear deposito
router.post('/',
    [
        check('cuentaDestino', 'Cuenta Invalida').not().isEmpty(),
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
            //validar creacion numeroDeposito unico
            let existe = true;
            while (existe == true) {
                numero = creaContrasena("n");
                const existeNumeroDeposito = await Deposito.findOne({ existeNumeroDeposito: numero });
                if (!existeNumeroDeposito) {
                    existe = false;
                    console.log(numero);
                }
            }
            //llamar cuenta
            let cuenta = await Cuenta.findById(req.body.cuentaDestino._id);
            if (!cuenta) {
                return res.status(400).json({ mensaje: 'Cuenta no existe' })
            }

            console.log(cuenta.saldo);
            cuenta.saldo = req.body.valor+cuenta.saldo;
            console.log(req.body.valor);
            console.log(cuenta.saldo);
            
            let deposito = new Deposito();
            deposito.numeroDeposito = numero;
            deposito.cuentaDestino = req.body.cuentaDestino;
            deposito.valor = req.body.valor;
            deposito.fechaCreacion = new Date();

            deposito = await deposito.save();
            cuenta = await cuenta.save();
    
            //falta añadir el deposito a la cuenta
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
        const depositos = await Deposito.find().populate([
            { path: 'cuentaDestino', select: 'numeroCuenta' },
        ]);
        res.send(depositos);

    } catch (error) {
        console.log(error);
        res.status(500).send({ mensaje: 'Error de servidor' })
    }
})

//listar un Deposito
router.get('/:depositoId',async function(req,res){
    try {
      const deposito=await Deposito.findById(req.params.depositoId).populate([
        { path: 'cuentaDestino', select: 'numeroCuenta' },
    ]);
      if(!deposito){
       return res.status(404).send('Deposito No existe');
      }
      res.send(deposito);
    } catch (error) {
         console.log(error);
         res.status(500).send ('Error');
    }
 });
module.exports = router;