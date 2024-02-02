import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TilesModule } from 'qer';
import { DataExplorerPlusComponent } from './data-explorer-plus.component';
import { DataExplorerPlusService } from './data-explorer-plus.service';
import { ClassloggerService,
          CdrModule,
          LdsReplaceModule,
          DataSourceToolbarModule,
          DataTableModule,
          DataTilesModule,
          QbmModule,
          RouteGuardService,
          TileModule,
          DataTreeModule,
          FkAdvancedPickerModule,
          AppConfigService, } from 'qbm';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule, Routes } from '@angular/router';
import { EuiCoreModule, EuiMaterialModule } from '@elemental-ui/core';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatDialogModule } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { CdkTableModule } from '@angular/cdk/table';


const routes: Routes = [
  {
    path: 'data-explorer-plus',
    component: DataExplorerPlusComponent,
    canActivate: [RouteGuardService],
    resolve: [RouteGuardService],
  },
];

@NgModule({
  declarations: [
    DataExplorerPlusComponent,
  ],
  imports: [
    CdkTableModule,
    MatSidenavModule,
    MatCardModule,
    MatProgressBarModule,
    MatInputModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    CdrModule,
    LdsReplaceModule,
    DataSourceToolbarModule,
    DataTableModule,
    DataTilesModule,
    QbmModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    MatTableModule,
    MatDialogModule,
    RouterModule.forChild(routes),
    TranslateModule,
    CommonModule,
    TilesModule,
    EuiCoreModule,
    EuiMaterialModule,
    MatIconModule,
    MatListModule,
    MatButtonModule,
    TileModule,
    DataTreeModule,
    FkAdvancedPickerModule,
  ],
  exports: [
    DataExplorerPlusComponent,
  ]
})
export class DataExplorerPlusModule {
  constructor(private readonly initializer: DataExplorerPlusService, private readonly logger: ClassloggerService) {
    this.initializer.onInit(routes);
    this.logger.info(this, '🔥 data-explorer-plus loaded');
    this.logger.info(this, '▶️ data-explorer-plus initialized');
  }
}

