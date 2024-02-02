import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MethodDescriptor, TimeZoneInfo } from 'imx-qbm-dbts';
import { AppConfigService, AuthenticationService } from 'qbm';
import { BehaviorSubject } from 'rxjs';
import { FormControl } from '@angular/forms';


@Component({
  selector: 'imx-data-explorer-plus',
  templateUrl: './data-explorer-plus.component.html',
  styleUrls: ['./data-explorer-plus.component.scss'],
})
export class DataExplorerPlusComponent implements OnInit {




  constructor(
    private readonly config: AppConfigService,
    private readonly authentication: AuthenticationService,
    private cdr: ChangeDetectorRef) {}

  public async ngOnInit(): Promise<void>  {


  }

  ngOnDestroy() {

  }






}
