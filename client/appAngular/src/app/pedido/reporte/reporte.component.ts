
import { GenericService } from 'src/app/share/generic.service';
import { AfterViewInit, Component, ViewChild } from '@angular/core';
import Chart from 'chart.js/auto';
import { Subject, takeUntil } from 'rxjs';
import { AuthenticationService } from 'src/app/share/authentication.service';

@Component({
  selector: 'app-reporte',
  templateUrl: './reporte.component.html',
  styleUrls: ['./reporte.component.css']
})
export class ReporteComponent implements AfterViewInit {

  currentUser:any
  roleSelected:any
  //Canvas para el grafico
  compras:any
  canvas: any;
  topProducto:any
  topCliente:any
  //Contexto del Canvas
  ctx: any;
  //Elemento html del Canvas
  @ViewChild('graficoCanvas1') graficoCanvas1!: { nativeElement: any };
  @ViewChild('graficoCanvas2') graficoCanvas2!: { nativeElement: any };
  @ViewChild('graficoCanvas3') graficoCanvas3!: { nativeElement: any };
  @ViewChild('graficoCanvas4') graficoCanvas4!: { nativeElement: any };
  @ViewChild('graficoCanvas5') graficoCanvas5!: { nativeElement: any };

  graficoTopProductos: Chart | null = null;
  
  //Datos para mostrar en el gráfico
  datos: any;
  //Lista de meses para filtrar el gráfico
  mesList:any;
  //Mes actual
  filtro= new Date().getMonth();
  destroy$: Subject<boolean> = new Subject<boolean>();
  constructor(
    private gService: GenericService,
    private authService: AuthenticationService,
  ) {
    this.listaMeses();
    this.authService.currentUser.subscribe((x)=>(this.currentUser=x));
    this.authService.currentSelectedRole.subscribe((valor)=>(this.roleSelected=valor));
 
  
  }
  listaMeses(){
    this.mesList = [
      { Value: 1, Text: 'Enero' },
      { Value: 2, Text: 'Febrero' },
      { Value: 3, Text: 'Marzo' },
      { Value: 4, Text: 'Abril' },
      { Value: 5, Text: 'Mayo' },
      { Value: 6, Text: 'Junio' },
      { Value: 7, Text: 'Julio' },
      { Value: 8, Text: 'Agosto' },
      { Value: 9, Text: 'Septiembre' },
      { Value: 10, Text: 'Octubre' },
      { Value: 11, Text: 'Noviembre' },
      { Value: 12, Text: 'Diciembre' }
  ]
  }
  ngAfterViewInit(): void {
    if(this.roleSelected!=2){
      this.adminDashboard()
    }else{
      this.proveedorDashboard()
    }

  }


  adminDashboard(){
    // Cantidad de compras registradas en el día.
    this.getComprasDia()

    //Top 5 productos más comprado en el mes
    this.getTopProductosCompradosMes(this.filtro);

    // Top 5 vendedores con mejor evaluación
    this.getTopProveedores()

    // Top 3 peores vendedores evaluados.
    this.getWorstProveedores()
  
  }

 
  getComprasDia(){
    
    this.gService
      .list('pedido/compras')
      .pipe(takeUntil(this.destroy$))
      .subscribe((data:any)=>{
        this.compras =data
      })
    
   }

  

   getTopProductosCompradosMes(newValue:any){
    this.filtro=newValue;
    if(this.filtro){
     this.gService
       .get('pedido/topProductos', this.filtro)
       .pipe(takeUntil(this.destroy$))
       .subscribe((data:any)=>{
         this.graficoGetTopProductosCompradosMes(data);
       })
    }
   }
 
   //Configurar y crear gráfico
   graficoGetTopProductosCompradosMes(data: any): void {
    if (this.graficoTopProductos) {
      this.graficoTopProductos.destroy();
    }
  
    this.canvas = this.graficoCanvas2.nativeElement;
    this.ctx = this.canvas.getContext('2d');
  
    const colors = [
      'rgba(255, 99, 132, 0.6)',
      'rgba(54, 162, 235, 0.6)',
      'rgba(255, 205, 86, 0.6)',
      'rgba(75, 192, 192, 0.6)',
      'rgba(153, 102, 255, 0.6)',
    ];
  
    this.graficoTopProductos = new Chart(this.ctx, {
      type: 'bar',
      data: {
        labels: data.map((x: any) => x.descripcion),
        datasets: [
          {
            label: 'Cantidad',
            data: data.map((x: any) => x.suma),
            backgroundColor: colors.slice(0, data.length),
            borderColor: colors.slice(0, data.length),
            borderWidth: 1,
          },
        ],
      },
      options: {},
    });
  }
 

 getTopProveedores(){
  this.gService
  .list('pedido/bestProveedores')
  .pipe(takeUntil(this.destroy$))
  .subscribe((data:any)=>{
    this.graficoGetTopProveedores(data);
  })
 }
  
 graficoGetTopProveedores(data:any): void {
  this.canvas = this.graficoCanvas3.nativeElement;
  this.ctx = this.canvas.getContext('2d');

  const colors = [
    'rgba(255, 99, 132, 0.6)', 
    'rgba(54, 162, 235, 0.6)',  
    'rgba(255, 205, 86, 0.6)',  
    'rgba(75, 192, 192, 0.6)',  
    'rgba(153, 102, 255, 0.6)', 
  ];

  let grafico = new Chart(this.ctx, {
    type: 'bar',
    data: {
      labels: data.map((x: any) => x.proveedor),
      datasets: [
        {
          label: 'Evaluación',
          data: data.map((x: any) => x.avg_puntaje),
          backgroundColor: colors.slice(0, data.length), 
          borderColor: colors.slice(0, data.length), 
          borderWidth: 1,
        },
      ],
    },
    options: {},
  });
  }
 
  getWorstProveedores(){
    this.gService
    .list('pedido/wostProveedores')
    .pipe(takeUntil(this.destroy$))
    .subscribe((data:any)=>{
      this.graficoGetWorstProveedores(data);
    })
   }

   graficoGetWorstProveedores(data:any): void {
    this.canvas = this.graficoCanvas4.nativeElement;
    this.ctx = this.canvas.getContext('2d');
  
    const colors = [
      'rgba(255, 99, 132, 0.6)', 
      'rgba(54, 162, 235, 0.6)',  
      'rgba(255, 205, 86, 0.6)',  
      'rgba(75, 192, 192, 0.6)',  
      'rgba(153, 102, 255, 0.6)', 
    ];
  
    let grafico = new Chart(this.ctx, {
      type: 'polarArea',
      data: {
        labels: data.map((x: any) => x.proveedor),
        datasets: [
          {
            label: 'Evaluación',
            data: data.map((x: any) => x.avg_puntaje),
            backgroundColor: colors.slice(0, data.length), 
            borderColor: colors.slice(0, data.length), 
            borderWidth: 1,
          },
        ],
      },
      options: {},
    });
    }



    proveedorDashboard(){
      // Producto más vendido, de los que ofrece
      this.getTopProducto()
  
      // Cliente que ha realizado más compras
      this.getTopCliente();
  
      // Cantidad de evaluaciones
      this.getCalificaciones()
  
    
    }


    getTopProducto(){
    
      this.gService
        .get('pedido/topProducto',this.currentUser.user.id)
        .pipe(takeUntil(this.destroy$))
        .subscribe((data:any)=>{
          this.topProducto = data[0].descripcion
        })
      
    }

    getTopCliente(){
    
      this.gService
        .get('pedido/topCliente',this.currentUser.user.id)
        .pipe(takeUntil(this.destroy$))
        .subscribe((data:any)=>{
          this.topCliente = data[0].nombre
        })
      
    }


    getCalificaciones(){
      this.gService
      .get('pedido/calificaciones',this.currentUser.user.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data:any)=>{
        this.graficoGetCalificaciones(data);
      })
     }


     graficoGetCalificaciones(data:any): void {
      this.canvas = this.graficoCanvas5.nativeElement;
      this.ctx = this.canvas.getContext('2d');
    
      const colors = [
        'rgba(255, 99, 132, 0.6)', 
        'rgba(54, 162, 235, 0.6)',  
        'rgba(255, 205, 86, 0.6)',  
        'rgba(75, 192, 192, 0.6)',  
        'rgba(153, 102, 255, 0.6)', 
      ];
    
      let grafico = new Chart(this.ctx, {
        type: 'bar',
        data: {
          labels: data.map((x: any) => x.puntaje),
          datasets: [
            {
              label: 'Cantidad',
              data: data.map((x: any) => x.cantidad_evaluaciones),
              backgroundColor: colors.slice(0, data.length), 
              borderColor: colors.slice(0, data.length), 
              borderWidth: 1,
            },
          ],
        },
        options: {},
      });
      }
      
      
  ngOnDestroy() {
    this.destroy$.next(true);
    // Desinscribirse
    this.destroy$.unsubscribe();
  }

}