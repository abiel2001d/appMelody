const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
//Obtener listado
module.exports.get = async (request, response, next) => {
    const roles = await prisma.rol.findMany({});
      response.json(roles);
};  

//Obtener por Id
module.exports.getById = async (request, response, next) => {};
//Crear
module.exports.create = async (request, response, next) => {};

//Actualizar
module.exports.update = async (request, response, next) => {};
