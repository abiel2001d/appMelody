export const pedidos = [
    //1
    {
        total: 56000,
        estado: "Finalizado",
        usuarioId: 465218563,
        productos: {
            createMany: {
                data: [
                {   productoId: 2,
                    cantidad: 1,
                    precioUnitario: 56000,
                    subTotal: 56000,
                    estado: "Finalizado" }
                ],
            },
        },
    },
    //2
    {
        total: 104000,
        estado: "Pendiente",
        usuarioId: 465218563,
        productos: {
            createMany: {
                data: [
                {   
                    productoId: 3,
                    cantidad: 1,
                    precioUnitario: 56000,
                    subTotal: 56000,
                    estado: "Pendiente" 
                },
                {   
                    productoId: 4,
                    cantidad: 1,
                    precioUnitario: 48000,
                    subTotal: 48000,
                    estado: "Pendiente"
                }
                ],
            },
        },
    },
    //3
    {
        total: 760000,
        estado: "Pendiente",
        usuarioId: 462578415,
        productos: {
            createMany: {
                data: [
                {   
                    productoId: 1,
                    cantidad: 2,
                    precioUnitario: 56000,
                    subTotal: 760000,
                    estado: "En proceso"
                }
                ],
            },
        },
    }
  ];
  