import { NgModule } from '@angular/core';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';

const primengModules = [DropdownModule, ButtonModule];

@NgModule({
  imports: [...primengModules],
  exports: [...primengModules],
})
export class SharedModule {}
