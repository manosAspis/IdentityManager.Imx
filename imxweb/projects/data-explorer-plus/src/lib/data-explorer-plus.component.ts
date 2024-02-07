import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MethodDescriptor, TimeZoneInfo } from 'imx-qbm-dbts';
import { AppConfigService, AuthenticationService } from 'qbm';
import { BehaviorSubject, Subscription } from 'rxjs';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DataExplorerPlusService } from './data-explorer-plus.service';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

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
  dataSourcedynamic: ExplorerItem[] = [];
  sideNavOptions: { displayName: string; configParm: string }[] = [];
  private subscription: Subscription;
  configParm: string;
  selectedCategory: string | null = null;


  constructor(
    private route: ActivatedRoute,
    private service: DataExplorerPlusService,
    private readonly config: AppConfigService,
    private readonly authentication: AuthenticationService,
    private cdr: ChangeDetectorRef) {}

    public ngOnInit(): void {
      this.subscription = this.route.params.subscribe(async params => {
      if (this.configParm !== params['configParm']) {
        this.configParm = params['configParm'];
        console.log(this.configParm);

        await this.ExplorerList();
        console.log(this.dataSourcedynamic);
        this.setSideNavOptions();
        console.log(this.sideNavOptions);
        this.cdr.detectChanges();
      }
      });
    }


  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  public selectOption(configParm: string): void {
    this.selectedCategory = configParm;
    console.log('Selected category:', this.selectedCategory);
  }

  setSideNavOptions() {
    const matchingConfig = this.dataSourcedynamic.find(item => item.ConfigParm === this.configParm);
    if (matchingConfig) {
      this.sideNavOptions = matchingConfig.Children
        .filter(child =>
          child.ConfigParm !== 'Endpoint' &&
          child.ConfigParm !== 'selectStmt' &&
          child.Children.some(grandChild => grandChild.ConfigParm === 'DisplayName')
        )
        .map(child => {
          const displayNameChild = child.Children.find(grandChild => grandChild.ConfigParm === 'DisplayName');
          return {
            displayName: displayNameChild ? displayNameChild.Value : 'Unknown',
            configParm: child.ConfigParm
          };
        });
    }
    this.cdr.detectChanges();
  }

  public async ExplorerList(): Promise<void> {
    const explorers = await this.config.apiClient.processRequest<ExplorerItem[]>(this.GetExplorers());
    this.dataSourcedynamic = explorers;
    this.cdr.detectChanges();
  }

  private GetExplorers(): MethodDescriptor<void> {
    return {
      path: `/portal/dataexplorerplus/configparms`,
      parameters: [],
      method: 'GET',
      headers: {
        'imx-timezone': TimeZoneInfo.get(),
      },
      credentials: 'include',
      observe: 'response',
      responseType: 'json',
    };
  }
}

