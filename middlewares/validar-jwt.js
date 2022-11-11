const jwt = require('jsonwebtoken');

const validarJWT = (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) {
        return res.status(401).json({ mensaje: 'Error de Autorizacion' })
    }
    try {
        const payload = jwt.verify(token, 'c0oeÑrF3chr3KWC');
        req.payload = payload;
        next();
    } catch (error) {
        console.log(error);
        return res.status(401).json({ mensaje: 'Error de Autorizacion' })
    }
}
module.exports = { validarJWT }