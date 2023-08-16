const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const jwt = require("jsonwebtoken");
//--npm install bcrypt
const bcrypt = require("bcrypt");
//Obtener listado

module.exports.get = async (request, response, next) => {
  const usuarios = await prisma.usuario.findMany({
    include: {
      roles: true,
    },
  });
  response.json(usuarios);
};


// Crear nuevo usuario
module.exports.register = async (request, response, next) => {
  const userData = request.body;

  // Salt es una cadena aleatoria.
  // "salt round" factor de costo controla cuánto tiempo se necesita para calcular un solo hash de BCrypt
  // salt es un valor aleatorio y debe ser diferente para cada cálculo, por lo que el resultado casi nunca debe ser el mismo, incluso para contraseñas iguales
  let salt = bcrypt.genSaltSync(10);
  // Hash password
  let hash = bcrypt.hashSync(userData.password, salt);

  const user = await prisma.usuario.create({
    data: {
      id:userData.id,
      nombre: userData.nombre,
      email: userData.email,
      telefono: userData.telefono,
      proveedor: userData.proveedor,
      estado: userData.estado,
      password: hash,
      roles: { connect: userData.roles.map((role) => ({ id: role.id })) },
    },
  });

  response.status(200).json({
    status: true,
    message: "Usuario creado",
    data: user,
  });
};


module.exports.login = async (request, response, next) => {
  let userReq = request.body;
  //Buscar el usuario según el email dado
  const user = await prisma.Usuario.findFirst({
    where: {
      email: userReq.email,
      estado: true,
    },
    include:{
      roles:true
    }
  });
  //Sino lo encuentra según su email
  if (!user) {
    response.status(401).send({
      success: false,
      message: "Usuario no registrado",
    });
  }else{
     //Verifica la contraseña
  const checkPassword=await bcrypt.compare(userReq.password, user.password);
  if(checkPassword === false){
    response.status(401).send({
      success:false,
      message: "Credenciales no validas"
    })
  }else{
    //Usuario correcto
    //Crear el payload
    const payload={
      id: user.id,
      email: user.email,
      role: user.roles,
    }
    //Crear el token
    const token= jwt.sign(payload,process.env.SECRET_KEY,{
      expiresIn: process.env.JWT_EXPIRE
    });
    response.json({
      success: true,
      message: "Usuario registrado",
      data: {
        user,
        token,
      }
    })
  }
  }
 
};

//Obtener por Id
module.exports.getById = async (request, response, next) => {
  let id = parseInt(request.params.id);
  
  const usuario = await prisma.usuario.findUnique({
    where: {
      id: id
    },
    include:{
      roles:true
    }
  }); 
  
  response.json(usuario);
};


module.exports.getByEmail = async (request, response, next) => {
  let email = request.params.email;
  
  const usuario = await prisma.usuario.findUnique({
    where: {
      email: email
    },
    include:{
      roles:true
    }
  }); 
  
  response.json(usuario);
};

//Actualizar
module.exports.updatePassword = async (request, response, next) => {
  let idUser = parseInt(request.params.id);
  const userData = request.body;

  // Salt es una cadena aleatoria.
  // "salt round" factor de costo controla cuánto tiempo se necesita para calcular un solo hash de BCrypt
  // salt es un valor aleatorio y debe ser diferente para cada cálculo, por lo que el resultado casi nunca debe ser el mismo, incluso para contraseñas iguales
  let salt = bcrypt.genSaltSync(10);
  // Hash password
  let hash = bcrypt.hashSync(userData.password, salt);

  const user = await prisma.usuario.update({
    where: { id: idUser },
    data: { password: hash },
  });

  response.json(user);
};

//Actualizar
module.exports.update = async (request, response, next) => {
  let idUser = parseInt(request.params.id);
  let userData = request.body;
  const usuarioAnterior = await prisma.usuario.findUnique({
    where: { id: idUser },
    include: {
      roles: {
        select:{
          id:true
        }
      }
    }
  });
  const user = await prisma.usuario.update({
    where: { id: idUser },
    data: { 
      id:userData.id,
      nombre: userData.nombre,
      email: userData.email,
      telefono: userData.telefono,
      proveedor: userData.proveedor,
      estado: userData.estado,
      roles: {
        disconnect:usuarioAnterior.roles,
        connect: userData.roles.map((role) => ({ id: role.id }))
      },
    },
  });

  response.json(user);
};