import { Component, OnInit, ChangeDetectorRef, OnDestroy, ViewChild, AfterViewInit  } from '@angular/core';
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

interface IdentQBMLimitedSQLType {
  IdentQBMLimitedSQL: string | null;
}

@Component({
  selector: 'imx-data-explorer-plus',
  templateUrl: './data-explorer-plus.component.html',
  styleUrls: ['./data-explorer-plus.component.scss'],
})
export class DataExplorerPlusComponent implements OnInit, OnDestroy, AfterViewInit  {
  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;
  data: ExplorerItem[] | null = null;
  dataSourcedynamic: ExplorerItem[] = [];
  sideNavOptions: { displayName: string; configParm: string }[] = [];
  private subscription: Subscription;
  configParm: string;
  selectedCategory: string | null = null;
  IdentQBMLimitedSQL: IdentQBMLimitedSQLType | null = null;
  SQLresults: string[] = [];
  displayedColumns: string[] = [];
  dataSource = new MatTableDataSource<any>([]);
  searchControl = new FormControl('');


  constructor(
    private route: ActivatedRoute,
    private service: DataExplorerPlusService,
    private readonly config: AppConfigService,
    private readonly authentication: AuthenticationService,
    private cdr: ChangeDetectorRef) {}

    public ngOnInit(): void {
      this.subscription = this.route.params.subscribe(async params => {
        // Check if configParm has actually changed to prevent unnecessary reloads
        if (this.configParm !== params['configParm']) {
          this.configParm = params['configParm'];

          // Reset component state for the new configParm
          this.resetComponentState();

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

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  private resetComponentState(): void {
    // Clear the MatTableDataSource
    this.dataSource.data = [];
    // Reset displayed columns
    this.displayedColumns = [];
    // Optionally reset the paginator to the first page
    if (this.paginator) {
      this.paginator.firstPage();
    }
    // Reset any additional state as needed
    this.selectedCategory = null;
    this.IdentQBMLimitedSQL = null;
    // Ensure any other state relevant to the view is reset or reinitialized here
  }

  public selectOption(configParm: string): void {
    this.selectedCategory = configParm;
    this.IdentQBMLimitedSQL = null;

    // Find the corresponding ExplorerItem for the selected category
    const findSelectStmt = (items: ExplorerItem[]): string | null => {
      for (const item of items) {
        if (item.ConfigParm === configParm) {
          // If this is the selected category, look for the selectStmt in its children
          const selectStmtItem = item.Children.find(child => child.ConfigParm === 'selectStmt');
          return selectStmtItem ? selectStmtItem.Value : null;
        } else if (item.Children.length > 0) {
          // Recursively search in children
          const result = findSelectStmt(item.Children);
          if (result) return result; // If found in sub-children, return it
        }
      }
      return null; // Return null if not found at all
    };

    // Set the IdentQBMLimitedSQL based on the found selectStmt, or keep it null if not found
    const selectStmtValue = findSelectStmt(this.dataSourcedynamic);
    if (selectStmtValue) {
      this.IdentQBMLimitedSQL = { IdentQBMLimitedSQL: selectStmtValue };
    }
    console.log('IdentQBMLimitedSQL:', this.IdentQBMLimitedSQL);
    console.log(this.selectedCategory);
    this.executeSQL(this.IdentQBMLimitedSQL);
  }

  applyFilter(): void {
    const filterValue = this.searchControl.value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    // Reset the paginator to the first page (important if you have pagination)
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  getSelectedDisplayName(): string {
    if (!this.selectedCategory) {
      return 'No data'; // Default message or you can return an empty string
    }

    const option = this.sideNavOptions.find(o => o.configParm === this.selectedCategory);
    return option ? option.displayName : 'No data';
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

    // Automatically select the first category if available
    if (this.sideNavOptions.length > 0) {
      const firstOption = this.sideNavOptions[0].configParm;
      // Delay the selection to ensure view initialization is complete
      setTimeout(() => this.selectOption(firstOption), 0);
    }
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

  public async executeSQL(limitedSQL: IdentQBMLimitedSQLType): Promise<void> {
    this.dataSource.data = [];
    this.displayedColumns = [];

    const results = await this.config.apiClient.processRequest<any[]>(this.predefinedSQL(limitedSQL));
    if (results.length > 0) {
      this.dataSource.data = results.map(row => {
        const flattenedRow = {};
        row.forEach(column => {
          flattenedRow[column.Column] = column.Value;
        });
        return flattenedRow;
      });

      // Set displayed columns based on the first row keys
      this.displayedColumns = Object.keys(this.dataSource.data[0]);
    }
    if (this.paginator) {
      this.paginator.firstPage();
      this.dataSource.paginator = this.paginator;
    }
    console.log('DataSource:', this.dataSource.data);
  }

  private predefinedSQL(limitedSQL: IdentQBMLimitedSQLType): MethodDescriptor<void> {
    return {
      path: `/portal/predefinedsql/fulldynamic`,
      parameters: [
        {
          name: 'limitedSQL',
          value: limitedSQL,
          in: 'body'
        },
      ],
      method: 'POST',
      headers: {
        'imx-timezone': TimeZoneInfo.get(),
      },
      credentials: 'include',
      observe: 'response',
      responseType: 'json',
    };
  }
}

