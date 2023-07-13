const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


//Crear
module.exports.create = async (request, response, next) => {
  let comentario = request.body; 
  const newComentario= await prisma.comentario.create({
    data: {
        contenido: comentario.contenido,
        tipo: comentario.tipo,
        dialogoId: comentario.dialogo,
        usuarioId: comentario.usuario,
    }
  });
  response.json(newComentario);
};

