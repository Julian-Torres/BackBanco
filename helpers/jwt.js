const jwt = require('jsonwebtoken');

const generarJWT = (usuario) => {
    const payload = {
        _id: usuario._id,
        nombre: usuario.nombre,
        rol: usuario.rol,
        email: usuario.email
    };
    const token = jwt.sign(payload, 'c0oeÑrF3chr3KWC', { expiresIn: '2h' });
    return token
}

module.exports = {
    generarJWT
}