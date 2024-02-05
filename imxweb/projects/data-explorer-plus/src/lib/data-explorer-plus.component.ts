import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MethodDescriptor, TimeZoneInfo } from 'imx-qbm-dbts';
import { AppConfigService, AuthenticationService } from 'qbm';
import { BehaviorSubject, Subscription } from 'rxjs';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { DataExplorerPlusService } from './data-explorer-plus.service';

interface ExplorerItem {
  ConfigParm: string;
  Value: string;
  Children: ExplorerItem[];
}

@Component({
  selector: 'imx-data-explorer-plus',
  templateUrl: './data-explorer-plus.component.html',
  styleUrls: ['./data-explorer-plus.component.scss'],
})
export class DataExplorerPlusComponent implements OnInit, OnDestroy {
  data: ExplorerItem[] | null = null;
  private subscription: Subscription;

  constructor(private service: DataExplorerPlusService) {}

  ngOnInit() {
    this.subscription = this.service.currentData.subscribe(data => {
      this.data = data;
    });
    console.log(this.data);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}

