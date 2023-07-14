const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


//Crear
module.exports.create = async (request, response, next) => {
  const dialogo = request.body;
  const newDialogo = await prisma.dialogo.create({
    data: {
      titulo: dialogo.titulo,
      producto: { connect: { id: dialogo.producto } },
      comentarios: {
        create: dialogo.comentarios.map(comentario => ({
          contenido: comentario.contenido,
          tipo: comentario.tipo,
          usuario: { connect: { id: comentario.usuario } }
        }))
      }
    }
  });
  response.json(newDialogo);
};


