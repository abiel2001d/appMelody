const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
//Obtener listado
module.exports.get = async (request, response, next) => {
  const galeria = await prisma.galeria.findMany({});
  response.json(galeria);
};
//Obtener por Id
//locahost:3000/galeria/1
module.exports.getById = async (request, response, next) => {
    let id=parseInt(request.params.id);
    const galeria =await prisma.galeria.findUnique({
        where: { id: id },
    })
    response.json(galeria);
};
//Crear
module.exports.create = async (request, response, next) => {};

//Actualizar
module.exports.update = async (request, response, next) => {};
