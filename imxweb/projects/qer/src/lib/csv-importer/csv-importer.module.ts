import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatStepperModule, } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { MatListModule } from '@angular/material/list';
import { MatFormFieldModule } from '@angular/material/form-field';
import { RouterModule, Routes } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { EuiCoreModule } from '@elemental-ui/core';
import { MatPaginatorModule } from '@angular/material/paginator';
import { DataTableModule, CdrModule, LdsReplaceModule, MenuService, MenuItem } from 'qbm';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CsvImporterComponent } from './csv-importer.component';
import { CsvImporterService } from './csv-importer.service';

const routes: Routes = [
  {
    path: 'csvImporter',
    component: CsvImporterComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    MatCheckboxModule,
    LdsReplaceModule,
    MatStepperModule,
    CdrModule,
    MatRadioModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    DataTableModule,
    RouterModule.forChild(routes),
    MatButtonModule,
    MatListModule,
    MatFormFieldModule,
    MatPaginatorModule,
    EuiCoreModule
  ],
  declarations: [
  ],
  providers: [CsvImporterService]
})
export class CsvImporterModule {
  constructor(
    private readonly menuService: MenuService,
  ) {
    this.setupMenu();
  }

  private setupMenu(): void {
    this.menuService.addMenuFactories(
      (preProps: string[], groups: string[]) => {

        const items: MenuItem[] = [];

        items.push(
          {
            id: 'QER_CSV_Importer',
            route: 'csvImporter',
            title: '#LDS# CSV Importer',
            sorting: '60',
          },
        );
        if (items.length === 0) {
          return null;
        }
        return {
          id: 'ROOT_CsvImporter',
          title: '#LDS#CSV Importer',
          sorting: '60',
          items
        };
      },
    );
  }
}

/* SECOND METHOD TO DISPLAY THE CSV IMPORTER */

/*
  private setupMenu(): void {
    this.menuService.addMenuFactories(
      (preProps: string[], groups: string[]) => {
        const menu = {
          id: 'ROOT_CsvImporter',
          title: '#LDS# Csv Importer',
          sorting: '60',
      
          items: [
            {
              id: 'QER_CSV_Importer',
              navigationCommands: { commands: ['csvImporter'] },
              title: '#LDS# CSV Importer',
              sorting:'60',
            },
          ]
        };
        return menu;
      }
    );
  }
*/