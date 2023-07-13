import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { GenericService } from 'src/app/share/generic.service';

@Component({
  selector: 'app-producto-detail',
  templateUrl: './producto-detail.component.html',
  styleUrls: ['./producto-detail.component.css']
})
export class ProductoDetailComponent {
  currentDialogIndex = 0;

  currentDialog: number = 0;

  currentUser:any
  submitted = false;
  comentarioForm: FormGroup;
  datos:any;//Guarda la respuesta del API
  destroy$: Subject<boolean>=new Subject<boolean>();
  estadoInventario:string
  constructor(
    private gService: GenericService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    ){
      //Obtener el parámetro
      let id=this.route.snapshot.paramMap.get('id');
      if(!isNaN(Number(id))){
        this.obtenerProducto(id);
      }
      this.formularioReactive() 
  }
  ngOnInit(): void {
    //Valores de prueba
    let user={
      id:462578415,
      rol: 3
    }
    this.currentUser=user;
  }
  public errorHandling = (control: string, error: string) => {
    return this.comentarioForm.controls[control].hasError(error);
  };

  //Crear Formulario
  formularioReactive() {
    //[null, Validators.required]
    this.comentarioForm=this.fb.group({
      //Input type hidden
      contenido: [null,
        Validators.compose([
          Validators.required, Validators.minLength(2)
        ])      
      ],
      tipo:[null,null],
      dialogo:[null,null],
      usuario:[null,null]
    })
   
  }

  prevDialog() {
    if (this.currentDialog > 0) {
      this.currentDialog--;
    }
  }

  nextDialog() {
    if (this.currentDialog < this.datos.dialogos.length - 1) {
      this.currentDialog++;
    }
  }

  getBackgroundColor(cantidad: any): string {
    if (cantidad <= 0) {
      this.estadoInventario="Agotado"
      return '#f8da5b';
    } else if (cantidad >0) {
      this.estadoInventario="Disponible"
      return '#91ca62';
    } else {
      return 'transparent';
    }
  }

  obtenerProducto(id:any){
    this.gService
    .get('producto',id)
    .pipe(takeUntil(this.destroy$))
    .subscribe((data:any)=>{
      console.log(data);
        this.datos=data; 
    });
   
  }
  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  getBase64FromBytes(byteArray) {
    var binary = '';
    var bytes = new Uint8Array(byteArray);
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return 'data:image/jpeg;base64,' + btoa(binary);
  }

  enviarMensaje(idDialogo: any) {
    this.submitted = true;
    
    if(this.comentarioForm.invalid){
      return;
    }

    this.comentarioForm.patchValue({ 
      dialogo: idDialogo,
      usuario: this.currentUser.id,
      tipo: this.currentUser.rol 
    });
  
    console.log(this.comentarioForm.value);
    this.gService.create('comentario', this.comentarioForm.value)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        let id = this.route.snapshot.paramMap.get('id'); // Obtain the ID from the current URL
  
        this.router.navigate(['/producto', id], { relativeTo: this.route })
          .then(() => {
            window.location.reload(); // Reload the page
          });
      });
  }

  previousDialog() {
    if (this.currentDialogIndex > 0) {
      this.currentDialogIndex--;
    }
  }


}
