const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
//Obtener listado
module.exports.get = async (request, response, next) => {
  const productos = await prisma.producto.findMany({
    include: {
        categoria:true,
        productoEstado: true,
        imagenes:true,
        proveedor:true
    },
  });
  response.json(productos);
};

module.exports['getByCategory'] = async (request, response, next) => {
  let id = parseInt(request.params.id);
  const productos = await prisma.producto.findMany({
    where:{ categoriaId: id},
    include: {
        categoria:true,
        productoEstado: true,
        imagenes:true,
        proveedor:true
    },
  });
  response.json(productos);
};

//Obtener por Id
module.exports.getById = async (request, response, next) => {
  let id = parseInt(request.params.id);
  const producto = await prisma.producto.findUnique({
      where: { id: id },
      include: {
          categoria: true,
          productoEstado: true,
          imagenes: true,
          proveedor: {
              select: {
                  proveedor: true
              }
          },
          dialogos: {
              select: {
                titulo:true,
                  id:true,
                  comentarios: {
                      include: {
                          usuario: {
                              select: {
                                  nombre: true,
                                  proveedor: true
                              }
                          }
                      }
                  },
              },
          },
      },
  });
  response.json(producto);
};

//Crear
module.exports.create = async (request, response, next) => {
  let producto = request.body; 
  const newProducto = await prisma.producto.create({
    data: {
      descripcion: producto.descripcion,
      precio: producto.precio,
      cantidad: producto.cantidad,
      estado: producto.estado,
      categoriaId: producto.categoria,
      productoEstadoId: producto.productoEstado,
      proveedorId: producto.proveedor,
      imagenes: {
        create: producto.imagenes.map((imagen) => ({
          imagen: Buffer.from(imagen.imagen.split(';base64,').pop(), 'base64'), 
          imagenPath:imagen.imagenPath,
          estado: imagen.estado,
        })),
      }
    },
    include:{
        imagenes:true
    }
  });
  response.json(newProducto);
};

  
  
//Actualizar
module.exports.update = async (request, response, next) => {
  let producto = request.body;
  let idProducto = parseInt(request.params.id);
 
 
  await prisma.galeria.deleteMany({
    where: {
      productoId: idProducto,
    },
  });

  const newProducto = await prisma.producto.update({
    where: {
      id: idProducto,
    },
    data: {
      descripcion: producto.descripcion,
      precio: producto.precio,
      cantidad: producto.cantidad,
      estado: producto.estado,
      categoriaId: producto.categoria,
      productoEstadoId: producto.productoEstado,
      proveedorId: producto.proveedor,
      imagenes: {
        create: producto.imagenes.map((imagen) => ({
          imagen: Buffer.from(imagen.imagen.split(';base64,').pop(), 'base64'), 
          imagenPath:imagen.imagenPath,
          estado: imagen.estado,
        })),
      }
    },
  });
  response.json(producto);
};

