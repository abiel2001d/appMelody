import { Component, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { LocationService } from 'src/app/direccion/location.service';

@Component({
selector: 'app-direccion-index',
templateUrl: './direccion-index.component.html',
styleUrls: ['./direccion-index.component.css']
})
export class DireccionIndexComponent implements OnInit {
provinces: any[];
cantons: any[];
distritos: any[];
selectedProvince: string;
selectedCanton: string;
selectedDistrito: string;
postalCode: string;
destroy$: Subject<boolean>=new Subject<boolean>();

constructor(private locationService: LocationService) { }


  ngOnInit() {
  this.locationService.getProvinces()
  .pipe(takeUntil(this.destroy$))
  .subscribe(data => {
  this.provinces = Object.entries(data).map(([key, value]) => ({ key, value }));
  });
  }

  onProvinceChange() {
  this.locationService.getCantons(this.selectedProvince)
  .pipe(takeUntil(this.destroy$))
  .subscribe(data => {
  this.cantons = Object.entries(data).map(([key, value]) => ({ key, value }));
  this.updatePostalCode();
  });
  }

  onCantonChange() {
  this.locationService.getDistricts(this.selectedProvince, this.selectedCanton)
  .pipe(takeUntil(this.destroy$))
  .subscribe(data => {
  this.distritos = Object.entries(data).map(([key, value]) => ({ key, value }));
  this.updatePostalCode();
  });
  }

  onDistritoChange() {
    this.updatePostalCode();
  }

  private updatePostalCode() {
    const format = (value: string, length: number): string => {
      if (value && value.length === length) {
        return value;
      } else if (value && value.length === 1) {
        return '0' + value;
      } else {
        return length === 1 ? '0' : '00';
      }
    };

    this.postalCode =
      format(this.selectedProvince, 1) +
      format(this.selectedCanton, 2) +
      format(this.selectedDistrito, 2);
  }
  ngOnDestroy(){
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}