const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
//Obtener listado
module.exports['getByUser'] = async (request, response, next) => {
    let id = parseInt(request.params.id);
    const direccion = await prisma.direccion.findMany({
      where:{ usuarioId: id},
    });
    response.json(direccion);
};
//Obtener por Id
module.exports.getById = async (request, response, next) => {};
//Crear
module.exports.create = async (request, response, next) => {};

//Actualizar
module.exports.update = async (request, response, next) => {};
