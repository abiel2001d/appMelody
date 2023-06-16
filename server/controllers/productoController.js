const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
//Obtener listado
module.exports.get = async (request, response, next) => {
  const productos = await prisma.producto.findMany({
    include: {
        categoria:true,
        productoEstado: true,
        imagenes:true
    },
  });
  response.json(productos);
};
//Obtener por Id
//locahost:3000/pedido/1
module.exports.getById = async (request, response, next) => {
    let id=parseInt(request.params.id);
    const producto =await prisma.producto.findUnique({
        where: { id: id },
        include: {
            categoria:true,
            productoEstado: true,
            imagenes:true
        }
    })
    response.json(producto);
};
//Crear
module.exports.create = async (request, response, next) => {};
//Actualizar
module.exports.update = async (request, response, next) => {};
