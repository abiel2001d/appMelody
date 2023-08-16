const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
//Obtener listado
module.exports['getByUser'] = async (request, response, next) => {
    let id = parseInt(request.params.id);
    const metodoPago = await prisma.metodoPago.findMany({
      where:{ usuarioId: id},
    });
    response.json(metodoPago);
};
//Obtener por Id
module.exports.getById = async (request, response, next) => {
  let id = parseInt(request.params.id);
  const metodoPago = await prisma.metodoPago.findMany({
    where:{ id: id},
  });
  response.json(metodoPago);
};
//Crear
module.exports.create = async (request, response, next) => {
  let metodoPago = request.body; 
  const newMetodoPago = await prisma.metodoPago.create({
    data: {
      usuario: { 
        connect: { id: metodoPago.usuario } 
      },
      numTajeta: metodoPago.numTajeta,
      fechaVenc: metodoPago.fechaVenc,
      codSeguridad: metodoPago.codSeguridad,
      tipo: metodoPago.tipo
    }
  });
  response.json(newMetodoPago);
};
//Actualizar
module.exports.update = async (request, response, next) => {
  let metodoPago = request.body;
  let idMetodoPago = parseInt(metodoPago.id);
 
  const newMetodoPago = await prisma.metodoPago.update({
    where: {
      id: idMetodoPago,
    },
    data: {
      numTajeta: metodoPago.numTajeta,
      fechaVenc: metodoPago.fechaVenc,
      codSeguridad: metodoPago.codSeguridad,
      tipo: metodoPago.tipo
    },
  });
  response.json(newMetodoPago);
};

