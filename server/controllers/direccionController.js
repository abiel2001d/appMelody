const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
//Obtener listado
module.exports['getByUser'] = async (request, response, next) => {
    let id = parseInt(request.params.id);
    const direccion = await prisma.direccion.findMany({
      where:{ usuarioId: id},
    });
    response.json(direccion);
};
//Obtener por Id
module.exports.getById = async (request, response, next) => {};
//Crear
module.exports.create = async (request, response, next) => {
  let direccion = request.body; 
  const newDireccion = await prisma.direccion.create({
    data: {
      usuario: { 
        connect: { id: direccion.usuario } 
      },
      provincia: direccion.provincia,
      provinciaDesc:  direccion.provinciaDesc,
      canton: direccion.canton,
      cantonDesc:  direccion.cantonDesc,
      distrito: direccion.distrito,
      distritoDesc:  direccion.distritoDesc,
      exacta: direccion.exacta,
      codigoPostal: direccion.codigoPostal,
      telefono: direccion.telefono
    }
  });
  response.json(newDireccion);
};

//Actualizar
module.exports.update = async (request, response, next) => {
  let direccion = request.body;
  let idDireccion = parseInt(direccion.id);
 
  const newDireccion = await prisma.direccion.update({
    where: {
      id: idDireccion,
    },
    data: {
      provincia: direccion.provincia,
      provinciaDesc:  direccion.provinciaDesc,
      canton: direccion.canton,
      cantonDesc:  direccion.cantonDesc,
      distrito: direccion.distrito,
      distritoDesc:  direccion.distritoDesc,
      exacta: direccion.exacta,
      codigoPostal: direccion.codigoPostal,
      telefono: direccion.telefono
    },
  });
  response.json(newDireccion);
};
