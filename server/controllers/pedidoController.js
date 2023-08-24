const { PrismaClient,Prisma } = require('@prisma/client');
const prisma = new PrismaClient();
//Obtener listado
module.exports.get = async (request, response, next) => {
  const pedidos = await prisma.pedido.findMany({
    include: {
        usuario:true,
        productos: {
            include: {
                  producto: {
                      include: {
                          proveedor:true
                      }
                  }
              }
        },
        evaluaciones:{
          include: {
            proveedor:true,
            pedido:{
              select: {
                usuario:{
                  select:{ nombre:true}
                }
              }
            },
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

  
  const updatedPedido = await prisma.pedido.update({
    where: { id: pedidoId },
    data: { estado: updatedPedidoEstado },
  });

  response.json(updatedPedido); 
};


module.exports.getComprasDia = async (request, response, next) => {
  const result = await prisma.$queryRaw(
    Prisma.sql`SELECT COUNT(*)
    FROM pedido
    WHERE fechaPedido >= DATE(NOW()) AND fechaPedido < DATE(NOW() + INTERVAL 1 DAY)
    `
  );
  
  const count = Number(result[0]['COUNT(*)']);

  response.json(count);
};


module.exports.getTopProductosCompradosMes = async (request, response, next) => {
  const mes = parseInt(request.params.mes); 
  const result = await prisma.$queryRaw(
    Prisma.sql`
      SELECT p.descripcion, SUM(dp.cantidad) as suma
      FROM DetallePedido dp
      JOIN Producto p ON dp.productoId = p.id
      JOIN Pedido ped ON dp.pedidoId = ped.id
      WHERE MONTH(ped.fechaPedido) = ${mes}
      GROUP BY dp.productoId
      ORDER BY suma DESC
      LIMIT 5`
  );

  response.json(result);
};

module.exports.getTopProveedores = async (request, response, next) => {
  const result = await prisma.$queryRaw(
    Prisma.sql`
    SELECT u.*, AVG(e.puntaje) AS avg_puntaje
  FROM Usuario u
  JOIN Evaluacion e ON u.id = e.proveedorId
  WHERE u.proveedor IS NOT NULL AND e.realizadoPor = 3
  GROUP BY u.id
  ORDER BY avg_puntaje DESC
  LIMIT 5
  `
  );

  response.json(result);
};

module.exports.getWorstProveedores = async (request, response, next) => {
  const result = await prisma.$queryRaw(
    Prisma.sql`
    SELECT u.*, AVG(e.puntaje) AS avg_puntaje
  FROM Usuario u
  JOIN Evaluacion e ON u.id = e.proveedorId
  WHERE u.proveedor IS NOT NULL AND e.realizadoPor = 3
  GROUP BY u.id
  ORDER BY avg_puntaje ASC
  LIMIT 3
  `
  );

  response.json(result);
};

module.exports.getTopProducto = async (request, response, next) => {
  const proveedor = parseInt(request.params.proveedor); 
  const result = await prisma.$queryRaw(
    Prisma.sql`
    SELECT p.descripcion
    FROM Producto p
    JOIN DetallePedido dp ON p.id = dp.productoId
    WHERE p.proveedorId = ${proveedor}
    GROUP BY p.id
    ORDER BY SUM(dp.cantidad) DESC
    LIMIT 1;
    `
  );

  response.json(result);
};

module.exports.getTopCliente = async (request, response, next) => {
  const proveedor = parseInt(request.params.proveedor); 
  const result = await prisma.$queryRaw(
    Prisma.sql`
    SELECT u.nombre 
    FROM Usuario u
    JOIN Pedido ped ON u.id = ped.usuarioId
    JOIN DetallePedido dp ON ped.id = dp.pedidoId
    JOIN Producto p ON dp.productoId = p.id
    WHERE p.proveedorId = ${proveedor}
    GROUP BY u.id
    ORDER BY SUM(dp.cantidad) DESC
    LIMIT 1;
    `
  );

  response.json(result);
};

module.exports.getCalificaciones = async (request, response, next) => {
  const proveedor = parseInt(request.params.proveedor); 
  const result = await prisma.$queryRaw(
    Prisma.sql`
    SELECT puntaje, COUNT(*) AS cantidad_evaluaciones
    FROM Evaluacion
    WHERE proveedorId = ${proveedor} AND realizadoPor = 3
    GROUP BY puntaje;
    `
  );

  // Create a result object with scores from 1 to 5 and their respective counts
  const scoresMap = new Map();
  for (let i = 1; i <= 5; i++) {
    scoresMap.set(i, 0); // Initialize each score with 0
  }

  // Populate the scoresMap with actual counts from the query result
  result.forEach(row => {
    const puntaje = Number(row.puntaje);
    const cantidad_evaluaciones = Number(row.cantidad_evaluaciones);
    scoresMap.set(puntaje, cantidad_evaluaciones);
  });

  // Convert the scoresMap into an array of objects
  const formattedResult = Array.from(scoresMap, ([puntaje, cantidad_evaluaciones]) => ({
    puntaje,
    cantidad_evaluaciones,
  }));

  response.json(formattedResult);
};




