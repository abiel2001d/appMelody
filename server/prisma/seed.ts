import { PrismaClient } from '@prisma/client';
import { roles } from './seeds/roles';
import { usuarios } from './seeds/usuarios';
import { direcciones } from './seeds/direcciones';
import { metodospago } from './seeds/metodospago';
import { productoEstados } from './seeds/productoEstados';
import { categorias } from './seeds/categorias';
import { productos } from './seeds/productos';
import { galerias } from './seeds/galerias';
import { pedidos } from './seeds/pedidos';
import { facturas } from './seeds/factura';
import { evaluaciones } from './seeds/evaluaciones';
import { dialogos } from './seeds/dialogos';
import { comentarios } from './seeds/comentarios';

const prisma = new PrismaClient();

async function main() {

  //Roles
  await prisma.rol.createMany({
    data: roles
  });

  //Usuarios
  for (const data of usuarios) {
    await prisma.usuario.create({
      data: data
    });
  }
  
  //Direcciones
  await prisma.direccion.createMany({
    data: direcciones
  });

  //Metodos de Pago
  await prisma.metodoPago.createMany({
    data: metodospago
  });

  //Categorias Productos
  await prisma.categoria.createMany({
    data: categorias
  });

  //Estado de los Productos
  await prisma.productoEstado.createMany({
    data: productoEstados
  });
  
  //Productos
  await prisma.producto.createMany({
    data: productos
  });

  //Galerias
   await prisma.galeria.createMany({
    data: galerias
  });

  //Pedidos
  for (const data of pedidos) {
    await prisma.pedido.create({
      data: data
    });
  }

  //Facturas
  await prisma.factura.createMany({
    data: facturas
  });

  //Evaluaciones
   await prisma.evaluacion.createMany({
    data: evaluaciones
  });

  //Dialogos
  await prisma.dialogo.createMany({
    data: dialogos
  });

  //Comentarios
   await prisma.comentario.createMany({
    data: comentarios
  });

}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async e => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
