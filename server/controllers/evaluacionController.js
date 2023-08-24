const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

module.exports.create = async (request, response, next) => {
  let evaluacion = request.body; 
  const newEvaluacion = await prisma.evaluacion.create({
    data: {
      pedido: { 
        connect: { id: evaluacion.pedido } 
      },
      proveedor: { 
        connect: { id: evaluacion.proveedor } 
      },
      comentrario: evaluacion.comentrario,
      puntaje: evaluacion.puntaje,
      realizadoPor: evaluacion.realizadoPor,
    }
  });
  response.json(newEvaluacion);
};
