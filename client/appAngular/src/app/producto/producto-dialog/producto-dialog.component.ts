import { Component, Inject } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { GenericService } from 'src/app/share/generic.service';
import { NotificacionService } from 'src/app/share/notificacion.service';

@Component({
  selector: 'app-producto-dialog',
  templateUrl: './producto-dialog.component.html',
  styleUrls: ['./producto-dialog.component.css']
})
export class ProductoDialogComponent {

  submitted = false;
  dialogoForm: FormGroup;
  destroy$: Subject<boolean>=new Subject<boolean>();
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    public dialogRef: MatDialogRef<ProductoDialogComponent>,
    private gService: GenericService,
    private noti: NotificacionService, 
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.formularioReactive();
  }

  formularioReactive() {
    this.dialogoForm = this.fb.group({
      producto:[null,null],
      titulo: [null, [Validators.required, Validators.minLength(2)]],
      contenido: [null, [Validators.required, Validators.minLength(2)]],
      comentarios: this.fb.array([])
    });
  }

  public errorHandling = (control: string, error: string) => {
    return this.dialogoForm.get(control)?.hasError(error);
  };


  crearDialogo() {
    this.submitted = true;
  
    if (this.dialogoForm.invalid) {
      return;
    }
  
    this.dialogoForm.patchValue({ 
      producto: this.data.productoId 
    });
  
    // Patch the comentarios array with a new object
    const comentario = {
      contenido: this.dialogoForm.get('contenido').value,
      tipo: 3,
      usuario: this.data.usuarioId
    };
    const comentariosArray = this.dialogoForm.get('comentarios') as FormArray;
    comentariosArray.push(this.fb.group(comentario));
  
    console.log(this.dialogoForm.value);
    this.gService.create('dialogo', this.dialogoForm.value)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
          // Close the dialog and indicate that a new dialog was created
          this.dialogRef.close('created');  
      });
  }
  
  
  
  

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

}
