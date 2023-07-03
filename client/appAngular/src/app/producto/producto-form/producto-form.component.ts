import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { GenericService } from 'src/app/share/generic.service';

@Component({
  selector: 'app-producto-form',
  templateUrl: './producto-form.component.html',
  styleUrls: ['./producto-form.component.css']
})
export class ProductoFormComponent implements OnInit {
  
  destroy$: Subject<boolean> = new Subject<boolean>();
  //Titulo
  titleForm: string = 'Crear';

  categoriasList: any;
  estadosProductoList: any;
  usuariosList: any;
  proveedoresList: any;

  productoInfo: any;
  //Respuesta del API crear/modificar
  respProducto: any;
  //Sí es submit
  submitted = false;
  //Nombre del formulario
  productoForm: FormGroup;
 
  idProducto: number = 0;
  //Sí es crear
  isCreate: boolean = true;

  constructor(
    private fb: FormBuilder,
    private gService: GenericService,
    private router: Router,
    private activeRouter: ActivatedRoute
  ) {
    this.formularioReactive();
    this.listaCategorias();
    this.listaEstadoProductos();
    this.listaProveedores();
  }
  ngOnInit(): void {
    //Verificar si hay parametros
    this.activeRouter.params.subscribe((params:Params)=>{
      this.idProducto=params['id'];
      if(this.idProducto!== undefined){
        this.isCreate=false;
        this.titleForm="Actualizar";
        //Obtener el videojuego del API, el que se va a actualizar
        this.gService
        .get('producto',this.idProducto)
        .pipe(takeUntil(this.destroy$))
        .subscribe((data:any)=>{
          this.productoInfo=data;
          //Establecer valor de cada entrada
          this.productoForm.setValue({
            id: this.productoInfo.id,
            descripcion: this.productoInfo.descripcion,
            precio: this.productoInfo.precio,
            cantidad: this.productoInfo.cantidad,
            estado: this.productoInfo.estado,
            categoria:this.productoInfo.categoria,
            productoEstado: this.productoInfo.productoEstado,
            proveedor: this.productoInfo.proveedor,
          })
        });

      }
    })
  }
  //Crear Formulario
  formularioReactive() {
    //[null, Validators.required]
    this.productoForm=this.fb.group({
      //Input type hidden
      id:[null,null],
      descripcion: [null,
        Validators.compose([
          Validators.required, Validators.minLength(2)
        ])      
      ],
      precio:  [null, Validators.required],
      cantidad:  [null, Validators.required],
      estado:  [true, Validators.required],
      categoria: [null, Validators.required],
      productoEstado:  [null, Validators.required],
      proveedor:  [null, Validators.required],
    })
  }
  listaEstadoProductos() {
    this.estadosProductoList = null;
    this.gService
      .list('estado')
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        console.log(data);
        this.estadosProductoList = data;
      });
  }

  listaCategorias() {
    this.categoriasList = null;
    this.gService
      .list('categoria')
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        console.log(data);
        this.categoriasList = data;
      });
  }


  listaProveedores() {
    this.usuariosList = null;
    this.proveedoresList = null;
    this.gService
      .list('usuario')
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        
        this.usuariosList = data;
        this.proveedoresList = data.filter(item => {
          return item.roles.some(role => role.id === 2);
        }).map(item => {
          return {
            id: item.id,
            proveedor: item.proveedor
          };
        });
        console.log(this.proveedoresList);
      });
  }
  
  public errorHandling = (control: string, error: string) => {
    return this.productoForm.controls[control].hasError(error);
  };
  //Crear 
  crearProducto(): void {
    //Establecer submit verdadero
    this.submitted = true;
    //Verificar validación
    if(this.productoForm.invalid){
      return;
    }
  
    console.log(this.productoForm.value)
    this.gService.create('producto',this.productoForm.value)
    .pipe(takeUntil(this.destroy$)) .subscribe((data: any) => {
      //Obtener respuesta
      this.respProducto=data;
      this.router.navigate(['/videojuego/all'],{
        queryParams: {create:'true'}
      });
    });
  }
  //Actualizar 
  actualizarProducto() {
    //Establecer submit verdadero
    this.submitted=true;
    //Verificar validación
    if(this.productoForm.invalid){
      return;
    }
    
    
    console.log(this.productoForm.value);
    //Accion API create enviando toda la informacion del formulario
    this.gService.update('producto',this.productoForm.value)
    .pipe(takeUntil(this.destroy$)) .subscribe((data: any) => {
      //Obtener respuesta
      this.respProducto=data;
      this.router.navigate(['/videojuego/all'],{
        queryParams: {update:'true'}
      });
    });
  }
  onReset() {}
  onBack() {
    this.router.navigate(['/videojuego/all']);
  }
  ngOnDestroy() {
    this.destroy$.next(true);
    // Desinscribirse
    this.destroy$.unsubscribe();
  }
}

