const { Router } = require('express');
const { check, validationResult } = require('express-validator');
const Tarjeta = require('../models/Tarjeta')
const bcrypt = require('bcryptjs');
const { validarJWT } = require('../middlewares/validar-jwt');
const { validarRol } = require('../middlewares/validar-rol-admin');
const { creaContrasena } = require('../helpers/generador')

const router = Router();

//crear tarjeta
router.post('/',
    [
        check('numeroPlastico', 'Numero de tarjeta invalido').isNumeric().isLength({ max: 12}).isLength({ min: 12}),
        check('franquicia', 'Franquicia Invalida').isIn(['Visa', 'MasterCard', 'American Express', 'Dinners Club']),
        check('tipo', 'Tipo Invalido').isIn(['Crédito', 'Débito']),
        validarJWT,
        validarRol
    ], async function (req, res) {
        try {
            console.log(req.body);
            //validar campos
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ mensaje: errors.array() });
            }
            //validar numeroTarjeta unico
            const existeNumeroTarjeta = await Tarjeta.findOne({ numeroPlastico: req.body.numeroPlastico });
            if (existeNumeroTarjeta) {
                return res.status(400).json({ mensaje: 'Numero de tarjeta ya existe' })
            }

            let tarjeta = new Tarjeta();
            tarjeta.numeroPlastico = req.body.numeroPlastico;
            tarjeta.franquicia = req.body.franquicia;
            tarjeta.tipo = req.body.tipo;

            const salt = bcrypt.genSaltSync();
            const clave = creaContrasena("ct");
            console.log(clave);
            tarjeta.clave = bcrypt.hashSync(clave, salt);
            tarjeta.fechaCreacion = new Date();
            tarjeta.fechaActualizacion = new Date();

            tarjeta = await tarjeta.save();
            res.send(tarjeta);

        } catch (error) {
            console.log(error);
            res.status(500).json({ mensaje: 'Error de servidor' })
        }
    }
);
//listar tarjetas
router.get('/', [validarJWT], async function (req, res) {
    try {
        const tarjetas = await Tarjeta.find();
        res.send(tarjetas);

    } catch (error) {
        console.log(error);
        res.status(500).send({ mensaje: 'Error de servidor' })
    }
})

//-----------------------------------------------------------------------
//editar tarjeta
router.put('/:tarjetaId',[validarJWT], async function (req, res) {
        try {
            console.log(req.body);
            //validar campos
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ mensaje: errors.array() });
            }
            //llamar tarjeta
            let tarjeta = await Tarjeta.findById(req.params.tarjetaId);
            if (!tarjeta) {
                return res.status(400).json({ mensaje: 'Tarjeta noexiste' })
            }

            const salt = bcrypt.genSaltSync();
            const clave = creaContrasena("ct");
            console.log(clave);
            tarjeta.clave = bcrypt.hashSync(clave, salt);
            tarjeta.fechaActualizacion = new Date();

            tarjeta = await tarjeta.save();
            res.send(tarjeta);

        } catch (error) {
            console.log(error);
            res.status(500).json({ mensaje: 'Error de servidor' })
        }
    }
);

//listar una Tarjeta
router.get('/:tarjetaId',async function(req,res){
    try {
      const tarjeta=await Tarjeta.findById(req.params.tarjetaId);
      if(!tarjeta){
       return res.status(404).send('Tatjeta No existe');
      }
      res.send(tarjeta);
    } catch (error) {
         console.log(error);
         res.status(500).send ('Error');
    }
 });    

//borrar Tarjeta
router.delete('/:tarjetaId',[validarJWT,validarRol],async function(req,res){
    try{
        let tarjeta=await Tarjeta.findByIdAndRemove(req.params.tarjetaId);
        if (!tarjeta){
            return res.status(400).send('Tatjeta no existe');
        }
        res.send("Tarjeta Eliminada");
    }catch(error){
        console.log(error);
        res.status(500).send ('Error');
    }
 });

module.exports = router;