import { NgModule } from '@angular/core';
import { DropdownModule } from 'primeng/dropdown';

const primengModules = [DropdownModule];

@NgModule({
  imports: [...primengModules],
  exports: [...primengModules],
})
export class SharedModule {}
