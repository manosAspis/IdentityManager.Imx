import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersTableComponent } from './users-table/users-table.component';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';
import { EuiCoreModule, EuiMaterialModule } from '@elemental-ui/core';
import { DataSourceToolbarModule, DataTableModule, LdsReplaceModule, QbmModule } from 'qbm';

@NgModule({
  declarations: [
    UsersTableComponent
  ],
  imports: [
    CommonModule,
    MatIconModule,
    MatListModule,
    MatButtonModule,
    TranslateModule,
    LdsReplaceModule,
    EuiCoreModule,
    EuiMaterialModule,
    DataSourceToolbarModule,
    DataTableModule,
    QbmModule
  ],
  exports: [
    UsersTableComponent
  ]
})
export class UsersTableModule { }
