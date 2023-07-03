const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
//Obtener listado
module.exports.get = async (request, response, next) => {
  const pedidos = await prisma.pedido.findMany({
    include: {
        usuario:true,
        productos: true,
        direccion:true,
    },
  });
  response.json(pedidos);
};
//Obtener por Id
//locahost:3000/pedido/1
module.exports.getById = async (request, response, next) => {
    let id=parseInt(request.params.id);
    const pedido =await prisma.pedido.findUnique({
        where: { id: id },
        include: {
            usuario:true,
            productos: true,
            direccion:true,
        }
    })
    response.json(pedido);
};
//Crear
module.exports.create = async (request, response, next) => {}

//Actualizar
module.exports.update = async (request, response, next) => {};
