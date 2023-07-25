import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersTableComponent } from './users-table.component';
import { TranslateModule } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { DataSourceToolbarModule, DataTableModule, LdsReplaceModule, QbmModule } from 'qbm';
import { EuiCoreModule, EuiMaterialModule } from '@elemental-ui/core';
import { UsersTableService } from './users-table.service';

@NgModule({
  declarations: [
    UsersTableComponent,
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
    QbmModule,
  ],
  exports: [
    UsersTableComponent,
  ],
  providers: [
    UsersTableService
  ]
})
export class UsersTableModule { }
