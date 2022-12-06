const { Router } = require('express');
const { check, validationResult } = require('express-validator');
const Transferencia = require('../models/Transferencia')
const Cuenta = require('../models/Cuenta')
const { validarJWT } = require('../middlewares/validar-jwt');
const { creaContrasena } = require('../helpers/generador');


const router = Router();

//crear transferencia
router.post('/',
    [
        check('cuentaOrigen', 'Cuenta Origen Invalida').not().isEmpty(),
        check('cuentaDestino', 'Cuenta Destino Invalida').not().isEmpty(),
        check('valor', 'Valor Invalido').isNumeric().not().isEmpty(),
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
            while (existe == true) {
                numero = creaContrasena("n");
                const existeNumeroTransferencia = await Transferencia.findOne({ numeroTransferencia: numero });
                if (!existeNumeroTransferencia) {
                    existe = false;
                    console.log(numero);
                }
            }

            //llamar cuentaOrigen 
            let cuentaOrigen = await Cuenta.findById(req.body.cuentaOrigen._id);
            if (!cuentaOrigen) {
                return res.status(400).json({ mensaje: 'Revisa Cuenta Origen' })
            }
            //llamar cuentaDestino
            let cuentaDestino = await Cuenta.findById(req.body.cuentaDestino._id);
            if (!cuentaDestino) {
                return res.status(400).json({ mensaje: 'Revisa Cuenta Destino' })
            }

            //Validar fondos cuentaOrigen
            if (cuentaOrigen.saldo < req.body.valor) {
                return res.status(400).json({ mensaje: 'Fondos insuficientes' })
            }

            console.log("o",cuentaOrigen.saldo);
            console.log("d",cuentaDestino.saldo);
            console.log("v",req.body.valor);
            cuentaDestino.saldo = cuentaDestino.saldo+req.body.valor;
            cuentaOrigen.saldo = cuentaOrigen.saldo-req.body.valor;
            console.log("o",cuentaOrigen.saldo);
            console.log("v",cuentaDestino.saldo);



            let transferencia = new Transferencia();
            transferencia.numeroTransferencia = numero;
            transferencia.cuentaOrigen = req.body.cuentaOrigen;
            transferencia.cuentaDestino = req.body.cuentaDestino;
            transferencia.valor = req.body.valor;
            transferencia.fechaCreacion = new Date();

            transferencia = await transferencia.save();
            cuentaOrigen = await cuentaOrigen.save();
            cuentaDestino = await cuentaDestino.save();
            res.send(transferencia);

            

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

//listar ua transferencia
router.get('/:transferenciaId',async function(req,res){
    try {
      const transferencia=await Transferencia.findById(req.params.transferenciaId);
      if(!transferencia){
       return res.status(404).send('Transferencia No existe');
      }
      res.send(transferencia);
    } catch (error) {
         console.log(error);
         res.status(500).send ('Error');
    }
 });    

module.exports = router;