import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SupportPageComponent } from './support-page/support-page.component';
import { MenuService } from 'qbm';
import {MatTableModule} from '@angular/material/table';



@NgModule({
  declarations: [
    SupportPageComponent
  ],
  imports: [
    CommonModule,
    MatTableModule
  ],
  exports: [
    SupportPageComponent
  ]
})
export class SupportPageModule {

  constructor(private readonly menuService: MenuService) {
    this.setupMenu();
  }


  private setupMenu(): void {
    this.menuService.addMenuFactories(
      
      (preProps: string[], __: string[]) => {
        return {
          id: 'ROOT_SUPPORT',
          title: '#LDS#Support',
          route: 'support',
          sorting: '60'
        };
      }  
    );
      
  }
}
