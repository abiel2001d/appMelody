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

    for (let producto of pedido.productos) {
      
      let dbProducto = await prisma.producto.findUnique({
        where: { id: producto.producto},
      });
      dbProducto.cantidad = dbProducto.cantidad - producto.cantidad

      // Reduce the cantidad of the associated product
      const updatedProduct = await prisma.producto.update({
        where: { id: dbProducto.id },
        data: { cantidad:   dbProducto.cantidad} // Decrement the cantidad
      });
    }


    response.json(newPedido);
  };

//Actualizar
module.exports.update = async (request, response, next) => {
  let pedidoId = parseInt(request.params.pedidoId);
  let productoId = parseInt(request.params.productoId);

  const updatedDetallePedido = await prisma.detallePedido.update({
    where: {
      pedidoId_productoId: {
        pedidoId,
        productoId,
      },
    },
    data: { estado: "Entregado" },
  });

  const pedido = await prisma.pedido.findUnique({
    where: { id: pedidoId },
    include: {
      productos: true,
    },
  });

  const hasDeliveredProduct = pedido.productos.some(producto => producto.estado === "Entregado");
  const allProductsDelivered = pedido.productos.every(producto => producto.estado === "Entregado");

  let updatedPedidoEstado = pedido.estado;

  if (allProductsDelivered) {
    updatedPedidoEstado = "Finalizado";
  } else if (hasDeliveredProduct && pedido.productos.length > 1) {
    updatedPedidoEstado = "En progreso";
  }

  // Update pedido estado
  const updatedPedido = await prisma.pedido.update({
    where: { id: pedidoId },
    data: { estado: updatedPedidoEstado },
  });

  response.json(updatedPedido); 
};

