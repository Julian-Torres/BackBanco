/*
*_id (mongo)
•Tipo de documento (CC,TI,NIT,CE)
•Número de documento (unico)
•Nombres
•Apellidos
•Teléfono 
•Email (usuario)(unico)
•Rol (Administrador, asesor y cliente)
*Contraseña de acceso al sistema (generada aleatoriamente)(encriptada)
•Estado (activo o inactivo)
*Fecha de creación 
*Fecha de actualización)
*/

const { Router } = require('express');
const { oneOf, check, validationResult } = require('express-validator');
const Usuario = require('../models/Usuario')
const bcrypt = require('bcryptjs');
const { validarJWT } = require('../middlewares/validar-jwt');
const { validarRol } = require('../middlewares/validar-rol-admin');
const { creaContrasena } = require('../helpers/generador')

const router = Router();

//-----------------------------------------------------------------------
//crear usuario
router.post('/',
    [
        check('tipoDocumento', 'Tipo de documento Invalido').isIn(['CC', 'TI', 'NIT', 'CE']),
        check('documento', 'Documento Invalido').not().isEmpty(),
        check('nombre', 'Nombre Invalido').not().isEmpty(),
        check('apellido', 'Apellido Invalido').not().isEmpty(),
        check('telefono', 'Telefono Invalido').not().isEmpty(),
        check('email', 'Email Invalido').isEmail(),
        check('rol', 'Rol Invalido').isIn(['Admin', 'Asesor', 'Cliente']),
        check('estado', 'Estado Invalido').isIn(['Activo', 'Inactivo']),
        validarJWT,
        validarRol
    ], async function (req, res) {
        console.log(req.body);
        try {
            //validar campos
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ mensaje: errors.array() });
            }
            //validar documento unico
            const existeDocumento = await Usuario.findOne({ documento: req.body.documento });
            if (existeDocumento) {
                return res.status(400).json({ mensaje: 'Documento ya existe' })
            }
            //validar Email unico
            const existeEmail = await Usuario.findOne({ email: req.body.email });
            if (existeEmail) {
                return res.status(400).json({ mensaje: 'Email ya existe' })
            }

            let usuario = new Usuario();
            usuario.tipoDocumento = req.body.tipoDocumento;
            usuario.documento = req.body.documento;
            usuario.nombre = req.body.nombre;
            usuario.apellido = req.body.apellido;
            usuario.email = req.body.email;
            const salt = bcrypt.genSaltSync();
            const contrasena = creaContrasena("c");
            console.log(contrasena);
            usuario.contrasena = bcrypt.hashSync(contrasena, salt);
            usuario.telefono = req.body.telefono;
            usuario.rol = req.body.rol;
            usuario.estado = req.body.estado;
            usuario.fechaCreacion = new Date();
            usuario.fechaActualizacion = new Date();

            usuario = await usuario.save();
            res.send(usuario);

        } catch (error) {
            console.log(error);
            res.status(500).json({ mensaje: 'Error de servidor' })
        }
    }
);
//-----------------------------------------------------------------------
//listar usuarios
router.get('/', [validarJWT], async function (req, res) {
    try {
        const usuarios = await Usuario.find();
        res.send(usuarios);

    } catch (error) {
        console.log(error);
        res.status(500).send({ menseaje: 'Error de servidor' })
    }
})
//-----------------------------------------------------------------------
//editar usuarios

router.put('/:usuarioId', [
    check('nombre', 'Nombre Invalido').not().isEmpty(),
    check('apellido', 'Apellido Invalido').not().isEmpty(),
    check('telefono', 'Telefono Invalido').not().isEmpty(),
    oneOf([
        [//valida que no se infrese contraseña nueva
            check('contrasenaNueva').isEmpty()
        ],
        [//si pide contrseña nueva pide que haya contraseña antigua tambien
            check('contrasenaNueva').not().isEmpty(),
            check('contrasenaAntigua', 'Contraseña antigua necesaria').not().isEmpty()
        ]
    ]),
    check('email', 'Email Invalido').isEmail(),
    validarJWT], async function (req, res) {
        try {
            //validar campos
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ mensaje: errors.array() });
            }
            //llamar usuario
            let usuario = await Usuario.findById(req.params.usuarioId);
            if (!usuario) {
                return res.status(400).json({ mensaje: 'Usuario no existe' })
            }

            //validar Email unico
            let existeEmail = await Usuario.findOne({ email: req.body.email, _id: { $ne: usuario._id } });
            if (existeEmail) {
                return res.status(400).json({ mensaje: 'Email ya existe' })
            }

            usuario.nombre = req.body.nombre;
            usuario.apellido = req.body.apellido;
            usuario.email = req.body.email;
            usuario.fechaActualizacion = new Date();


            //validar si se pide hacer nueva contrasena
            if (req.body.contrasenaNueva.isEmpty) {
                usuario = await usuario.save();
                return res.send(usuario);
            } else {
                //validar que la Contrasena coincide
                const esIgual = bcrypt.compareSync(req.body.contrasenaAntigua, usuario.contrasena);
                if (!esIgual) {
                    return res.status(400).json({ mensaje: 'Contraseña Actual incorrecta' })
                }
                const salt = bcrypt.genSaltSync();
                usuario.contrasena = bcrypt.hashSync(req.body.contrasenaNueva, salt);

                usuario = await usuario.save();
                res.send(usuario);
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({ mensaje: 'Error de servidor' })
        }
    })


module.exports = router;