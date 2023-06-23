import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CsvImporterComponent } from './csv-importer.component';
import { TranslateModule } from '@ngx-translate/core';



@NgModule({
  declarations: [
    CsvImporterComponent
  ],
  imports: [
    CommonModule,
    TranslateModule,
  ],
  exports: [
    CsvImporterComponent
  ]
})
export class CsvImporterModule { }
