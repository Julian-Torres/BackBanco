//c para clave usuario (15)(#Aa)•
//nt para numero tarjeta (12)(#)•
//ct para clave tarjeta (4)(#)•
//n para nuemro de cuenta, producto, abono, trsnferencia, deposito(10)(#)
const creaContrasena = (x) => {
    let l = 0;
    let lista = "";
    if (x == "c") {
        lista = "QWERTYUIOPASDFGHJKLZXCVBNMqwertyuiopasdfghjklzxcvbnm1234567890";
        l = 15;
    } else {
        lista = "1234567890";
        if (x == "nt") {
            l = 12;
        } else if (x == "ct") {
            l = 4;
        } else if (x == "n") {
            l = 10;
        }
    }
    let contrasena = "";
    for (x = 0; x < l; x++) {
        let random = Math.floor(Math.random() * lista.length);
        contrasena += lista.charAt(random);
    }
    return contrasena;
}
module.exports = {
    creaContrasena
}