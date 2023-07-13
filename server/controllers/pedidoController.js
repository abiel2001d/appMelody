const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
//Obtener listado
module.exports.get = async (request, response, next) => {
  const pedidos = await prisma.pedido.findMany({
    include: {
        usuario:true,
        productos: {
            include:{
                producto:true
            }
        },
        direccion:true,
    },
  });
  response.json(pedidos);
};
//Obtener por Id
//locahost:3000/pedido/1
module.exports.getById = async (request, response, next) => {
  let id = parseInt(request.params.id);
  const pedido = await prisma.pedido.findUnique({
      where: { id: id },
      include: {
          usuario: true,
          productos: {
              include: {
                  producto: {
                      include: {
                          imagenes: true,
                          proveedor:true
                      }
                  }
              }
          },
          direccion: true,
          metodoPago:true,
      }
  });
  response.json(pedido);
};

//Crear
module.exports.create = async (request, response, next) => {
    let pedido = request.body; 
    const newPedido = await prisma.pedido.create({
        data: {
            total: pedido.total,
            estado: pedido.estado,
            usuarioId: pedido.usuario,
            direccionId: pedido.direccion,
            metodoPagoId: pedido.metodoPago,
            productos: {
              createMany: {
                data: pedido.productos.map((producto) => ({
                    productoId: producto.producto,
                    cantidad: producto.cantidad,
                    precioUnitario: producto.precioUnitario,
                    subTotal: producto.subTotal,
                    estado: producto.estado
                  }))
              }
            }
          },
          include: {
            productos: true
          }
    });
    response.json(newPedido);
  };

//Actualizar
module.exports.update = async (request, response, next) => {};
