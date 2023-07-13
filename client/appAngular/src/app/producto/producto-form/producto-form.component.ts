import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { GenericService } from 'src/app/share/generic.service';

@Component({
  selector: 'app-producto-form',
  templateUrl: './producto-form.component.html',
  styleUrls: ['./producto-form.component.css']
})
export class ProductoFormComponent implements OnInit {
  currentCarouselIndex: number=0;
  destroy$: Subject<boolean> = new Subject<boolean>();
  //Titulo
  titleForm: string = 'Crear';

  categoriasList: any;
  estadosProductoList: any;
  usuariosList: any;
  proveedoresList: any;
  productoInfo: any;
  selectedImagesPath: string[] = [];
  selectedFileName: string = '';
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
    this.activeRouter.params.subscribe((params: Params) => {
      this.idProducto = params['id'];
      if (this.idProducto !== undefined) {
        this.isCreate = false;
        this.titleForm = "Actualizar";
        this.gService.get('producto', this.idProducto)
          .pipe(takeUntil(this.destroy$))
          .subscribe((data: any) => {
            this.productoInfo = data;
            
  
            // Initialize the imagenes control as an empty array
            this.productoForm.setValue({
              id: this.productoInfo.id,
              descripcion: this.productoInfo.descripcion,
              precio: this.productoInfo.precio,
              cantidad: this.productoInfo.cantidad,
              estado: this.productoInfo.estado,
              categoria: this.productoInfo.categoriaId,
              productoEstado: this.productoInfo.productoEstadoId,
              proveedor: this.productoInfo.proveedorId,
              imagenes: [] 
            });
            this.productoForm.patchValue({
              imagenes: this.productoInfo.imagenes
            });

            this.productoInfo.imagenes.forEach(async (imagen) => {
              const imagePath = imagen.imagen === null ? await this.convertImageToBase64(imagen.imagenPath) : this.convertBufferToUrl(imagen.imagen);
              this.selectedImagesPath.push(imagePath);
            });

            console.log(this.selectedImagesPath);
          });
      } else {
        this.buildDefaultImage();
        console.log(this.selectedImagesPath)
      }
    });
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
      imagenes: this.fb.array([])
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


  addImagenesToForm() {
    const imagenes = this.productoForm.get('imagenes') as FormArray;
        const imagenesData = this.selectedImagesPath.map((imagen, index) => ({
          imagen: imagen,
          imagenPath: null,
          estado: true
        }));
        console.log(imagenesData);
        imagenesData.forEach((imagenData) => {
          const imagenGroup = this.fb.group({
            imagen: [imagenData.imagen, Validators.required],
            imagenPath: [imagenData.imagenPath, Validators.required],
            estado: [imagenData.estado, Validators.required]
          });
  
          imagenes.push(imagenGroup);
        });
        return imagenesData;
  }
  
  //Crear 
  crearProducto(): void {
    this.submitted = true;
  
    const imagenesData = this.addImagenesToForm()
      const productoFormValue = {
        ...this.productoForm.value,
        cantidad: parseInt(this.productoForm.value.cantidad),
        imagenes: imagenesData
      };
  
      console.log(productoFormValue);
      this.gService.create('producto', productoFormValue)
        .pipe(takeUntil(this.destroy$))
        .subscribe((data: any) => {
          this.respProducto = data;
          this.router.navigate(['/producto/all'], {
            queryParams: { create: 'true' }
          });
        });
    
  }
  //Actualizar 
  actualizarProducto() {
    //Establecer submit verdadero
    this.submitted=true;

    const imagenesData = this.addImagenesToForm()
      const productoFormValue = {
        ...this.productoForm.value,
        cantidad: parseInt(this.productoForm.value.cantidad),
        imagenes: imagenesData
      };
  

    //Verificar validación
    /*if(this.productoForm.invalid){
      return;
    }*/
    
    
    console.log(this.productoForm.value);
    //Accion API create enviando toda la informacion del formulario
    this.gService.update('producto',productoFormValue)
    .pipe(takeUntil(this.destroy$)) .subscribe((data: any) => {
      //Obtener respuesta
      this.respProducto=data;
      this.router.navigate(['/producto/all'],{
        queryParams: {update:'true'}
      });
    });
  }
  onReset() {}
  onBack() {
    this.router.navigate(['/producto/all']);
  }
  ngOnDestroy() {
    this.destroy$.next(true);
    // Desinscribirse
    this.destroy$.unsubscribe();
  }

    handleFileInput(event: any): void {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        const target = e.target as FileReader;
        if (target && target.result) {
          const imageSrc = target.result.toString();
          this.convertImageToBase64(imageSrc)
            .then((base64String) => {
              this.selectedFileName = base64String;
            })
            .catch((error) => {
              console.error(error);
            });
        }
      };
      reader.readAsDataURL(file);
    }
  }
  
  clearFileInput(): void {
    const fileInput: HTMLInputElement = document.querySelector('#customFile');
    if (fileInput) {
      fileInput.value = ''; // Clear the input value
    }
  }

  changeImage(event: Event): void {
    event.preventDefault();
    if (this.selectedFileName) {
      this.selectedImagesPath[this.currentCarouselIndex]=this.selectedFileName;
      this.selectedFileName = '';
      this.clearFileInput();
    }
 
  }
  
  addSelectedImage(event: Event): void {
    event.preventDefault();
    if (this.selectedFileName) {
      this.selectedImagesPath.push(this.selectedFileName);
      this.selectedFileName = '';
      this.clearFileInput();
    }
    console.log(this.selectedImagesPath)
  }

  deleteImage(event: Event): void {
    event.preventDefault();
    if (this.selectedImagesPath.length > 1) {
      this.selectedImagesPath.splice(this.currentCarouselIndex, 1);
      if (this.currentCarouselIndex >= this.selectedImagesPath.length) {
        this.currentCarouselIndex = this.selectedImagesPath.length - 1;
      }
      this.clearFileInput();
    }
  }
  
  

  trackByIndex(index: number): number {
    return index;
  
  }
  
  convertImageToBase64(path: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = image.width;
        canvas.height = image.height;
  
        const context = canvas.getContext('2d');
        if (context) {
          context.drawImage(image, 0, 0);
          const base64String = canvas.toDataURL('image/jpeg');
          resolve(base64String);
        } else {
          reject(new Error('Failed to create canvas context.'));
        }
      };
      image.onerror = (error) => {
        reject(error);
      };
      image.src = path;
    });
  }
  
  
  async buildDefaultImage(): Promise<void> {
    const defaultImagePath = './assets/img/default.jpg';
    try {
      const base64String = await this.convertImageToBase64(defaultImagePath);
      this.selectedImagesPath.push(base64String);
    } catch (error) {
      console.error('Error converting image to base64:', error);
    }
  }
  
  updateCurrentCarouselIndex(event: any): void {

    this.currentCarouselIndex = event.to;
    console.log(this.currentCarouselIndex)
  }

  convertBufferToUrl(bufferData: any): string {
    if (bufferData && bufferData.type === 'Buffer' && Array.isArray(bufferData.data)) {
      const uintArray = new Uint8Array(bufferData.data);
      const base64Data = btoa(String.fromCharCode.apply(null, uintArray));
      return `data:image/jpeg;base64,${base64Data}`;
    }
    return '';
  }
  

}

