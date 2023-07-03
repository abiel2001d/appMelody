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
                  comentarios: {
                      include: {
                          usuario: {
                              select: {
                                  nombre: true
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
const fs = require('fs');
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
          imagen: fs.readFileSync(imagen.imagePath),
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
module.exports.update = async (request, response, next) => {};
