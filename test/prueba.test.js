const mongoose = require("mongoose");
const request = require("supertest");
const app = require("../index");


    beforeEach(async () => {
        const url = 'mongodb://inventario:5mQvfDdgtOkf7GvK@ac-nusbaxw-shard-00-00.wnvxi9b.mongodb.net:27017,ac-nusbaxw-shard-00-01.wnvxi9b.mongodb.net:27017,ac-nusbaxw-shard-00-02.wnvxi9b.mongodb.net:27017/GestionBancaria?ssl=true&replicaSet=atlas-5dxop9-shard-0&authSource=admin&retryWrites=true&w=majority';
        await mongoose.connect(url);
    });

    afterEach(async () => {
        await mongoose.connection.close();
    });

    describe("lista de usuarios", () => {
        it("debería regresar todos los usuarios", async () => {
          const res = await request(app).get("/usuario");
          expect(res.statusCode).toBe(401);
          //expect(res.body.length).toBeGreaterThan(0);
        });
      });

    describe("lista de tarjetas", () => {
    it("debería regresar todas las tarjetas", async () => {
        const res = await request(app).get("/tarjeta");
        expect(res.statusCode).toBe(401);
        //expect(res.body.length).toBeGreaterThan(0);
    });
    });

    describe("lista de cuenta", () => {
        it("debería regresar todas las cuentas", async () => {
          const res = await request(app).get("/cuenta");
          expect(res.statusCode).toBe(401);
          //expect(res.body.length).toBeGreaterThan(0);
        });
      });

    describe("lista de productos", () => {
    it("debería regresar todos los productos", async () => {
        const res = await request(app).get("/producto");
        expect(res.statusCode).toBe(401);
        //expect(res.body.length).toBeGreaterThan(0);
    });
    });
