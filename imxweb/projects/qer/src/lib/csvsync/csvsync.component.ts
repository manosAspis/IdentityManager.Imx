import { Component, OnInit, ViewChild, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { QerService } from '../qer.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MethodDescriptor, TimeZoneInfo } from 'imx-qbm-dbts';
import { AppConfigService, AuthenticationService, MenuService  } from 'qbm';
import { BehaviorSubject } from 'rxjs';
import { FormControl } from '@angular/forms';

export interface PeriodicElement {}
export interface ValidationElement{
  rowIndex: number;
  colIndex: number;
  message: string;
}
export interface ConfigElement {
  Person: string;
  Org: string;
}

let ConfigParam: ConfigElement[] = [
  {Person: '', Org: ''},

];

@Component({
  selector: 'imx-csvsync',
  templateUrl: './csvsync.component.html',
  styleUrls: ['./csvsync.component.scss']
})
export class CsvsyncComponent implements OnInit, AfterViewInit {
  allRowsValidated: boolean = false;
  validationResults$ = new BehaviorSubject<ValidationElement[]>([]);
  @ViewChild(MatPaginator) paginator: MatPaginator;
  csvDataSource: MatTableDataSource<any> = new MatTableDataSource();
  csvData: any[] = [];
  fileLoaded: boolean = false;
  headers: string[] = [];
  validationResponses: any[] = [];
  validationResults: ValidationElement[] = [];
  CsvImporter: boolean;
  allvalidated: boolean = false;
  public noDataText = '#LDS#No data';
  public noDataIcon = 'table';
  public visibleRows: any[] = [];
  validating: boolean;
  initializing: boolean = false;
  shouldValidate: boolean = false;
  numberOfErrors: number;
  searchControl = new FormControl({value: '', disabled: true});
  loading = false;

  displayedParams: string[] = ['Person', 'Org'];
  configSource = ConfigParam;
  Person: string;
  Org: string;
  selectedOption: string;

  constructor(
    private menuService: MenuService,
    private readonly config: AppConfigService,
    private readonly authentication: AuthenticationService,
    private qerService: QerService,
    private cdr: ChangeDetectorRef) {}

  public async ngOnInit(): Promise<void>  {
    await this.getCustom();
      if (this.configSource && this.configSource.length > 0) {
        this.Person = this.configSource[0].Person;
        this.Org = this.configSource[0].Org;

      }

    this.selectedOption = null;
    this.numberOfErrors = 0;
    this.loading = false;
    this.validating = true;
    this.allvalidated = false;
    this.CsvImporter = this.qerService.getCsvImporter();
    this.authentication.update();
    this.cdr.detectChanges();
    console.warn(this.Person, this.Org)
    console.log(this.CsvImporter)
    console.log(this.allvalidated)
    console.log(this.validating)
  }

  ngOnDestroy() {
    this.selectedOption = null;
    this.Person = '';
    this.Org = '';
    this.allRowsValidated = false;
    this.validationResults$.next([]);
    this.csvDataSource = new MatTableDataSource();
    this.csvData = [];
    this.fileLoaded = false;
    this.headers = [];
    this.validationResponses = [];
    this.validationResults = [];
    this.CsvImporter = false;
    this.allvalidated = false;
    this.visibleRows = [];
    this.validating = false;
    this.initializing = false;
    this.shouldValidate = false;
    this.numberOfErrors = 0;
  }


  checkAllRowsValidated(): boolean {
    // All rows are validated if there are no errors
    return this.numberOfErrors === 0;
  }

  ngAfterViewInit() {
    this.initializing = true;
    setTimeout(() => {
      this.csvDataSource.paginator = this.paginator;
      this.validating = true;
      this.cdr.detectChanges();
      if (this.paginator) {
        // Create a new PageEvent and manually trigger the page change event
        const initialPageEvent = new PageEvent();
        initialPageEvent.pageIndex = 0;
        initialPageEvent.pageSize = this.paginator.pageSize;
        initialPageEvent.length = this.csvDataSource.data.length;

        this.pageChanged(initialPageEvent);

        // Subscribe to future page changes
        this.paginator.page.subscribe((event) => {
          this.pageChanged(event);
        });
      } else {
        console.warn('Paginator is not available');
      }
      this.initializing = false;
    }, 100); // Adjust the delay as needed, typically a small value like 100ms should be sufficient
  }


  applyFilter() {
    const filterValue = this.searchControl.value;
    this.csvDataSource.filter = filterValue.trim().toLowerCase();

    if (this.csvDataSource.paginator) {
      this.csvDataSource.paginator.firstPage();
    }
    this.cdr.detectChanges();
  }

  getErrorRowsAndHeaders(): string {
    const errorInfos = this.validationResults.map(result => {
      const headerName = this.headers[result.colIndex];
      return `At row ${result.rowIndex + 1} the value of ${headerName}`;
    });
    return errorInfos.join(', ');
  }

  isRowError(rowIndex: number): boolean {
    // Get the row index in the filtered data
    const adjustedRowIndex = this.csvDataSource.filteredData[rowIndex + (this.paginator.pageIndex * this.paginator.pageSize)]?.[0] - 1;
    return this.validationResults.some(result => result.rowIndex === adjustedRowIndex);
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.processFile(file);
    }
    this.cdr.detectChanges();
  }

  onDragOver(event: any) {
    event.preventDefault();
    if (event.target) {
      event.target.classList.add('dragover');
    }
  }

  onDragLeave(event: any) {
    event.preventDefault();
    if (event.target) {
      event.target.classList.remove('dragover');
    }
  }

  triggerFileUpload() {
    const fileInput = document.getElementById('csv-file') as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  }

  onDrop(event: any) {
    event.preventDefault();
    let files = event.dataTransfer.files;
    if (files.length > 0) {
      let file = files[0];
      if (file.type.match(/.csv/)) {
        this.processFile(file);
      }
    }
  }

  private processFile(file: File) {
    const reader = new FileReader();
    reader.onload = async () => {
        const data = reader.result as string;
        const lines = data.split('\n').filter(line => line.trim().length > 0);  // Filter out empty lines
        this.headers = ['Index', ...lines[0].split(',').map(header => header ? header.trim() : '')];
        for (let i = 1; i < lines.length; i++) {
            const row = [i, ...lines[i].split(',').map(cell => cell ? cell.trim() : '')];
            this.csvData.push(row);
        }
        this.csvDataSource.data = this.csvData;
        this.fileLoaded = true;
    };
    this.searchControl.enable();
    reader.readAsText(file);
    this.allvalidated = false;
  }

replaceCsv() {
  this.loading = true;
  this.fileLoaded = false;
  this.allvalidated = false;
  this.csvData = [];
  this.headers = [];
  this.csvDataSource.data = [];
  this.validationResponses = [];
  this.validationResults = [];
  this.validationResults$.next([]);
  this.validating = true;
  this.numberOfErrors = 0;
  this.visibleRows = [];
  this.shouldValidate = false;
  this.searchControl.disable();
  setTimeout(() => {
    this.loading = false;
  });
}

getValidationResult(rowIndex: number, colIndex: number): string | undefined {
  // Get the row index in the filtered data
  const adjustedRowIndex = this.csvDataSource.filteredData[rowIndex + (this.paginator.pageIndex * this.paginator.pageSize)]?.[0] - 1;

  // Find the validation result using the adjusted row index
  const validationResult = this.validationResults.find(result => result.rowIndex === adjustedRowIndex && result.colIndex === colIndex);
  return validationResult?.message;
}

  isValidationError(rowIndex: number, colIndex: number): boolean {
    return this.getValidationResult(rowIndex, colIndex) !== undefined;
  }

  public async onValidateClickedBR(): Promise<void> {
    this.shouldValidate = true;
    await this.validateBR();
    this.allRowsValidated = this.checkAllRowsValidated(); // Call the new method after validation
  }

  public async validateBR(): Promise<void> {
    this.loading = true;
    if(this.initializing) {
      setTimeout(() => {
        this.loading = false;
      });
      return;
    }
    if(!this.shouldValidate) {
      setTimeout(() => {
        this.loading = false;
      });
      return;
    }
    this.validationResults = [];  // Clear the previous validation results
    this.allvalidated = true;
    this.validating = true;
    this.numberOfErrors = 0;  // Reset the error count before new validation

    const firstColumnValues = this.csvDataSource.data.map(row => row[1]);

    for (const [rowIndex, csvRow] of this.csvDataSource.data.entries()) {  // Validate all rows
      const rowToValidate: any = {
          "Ident_Org": csvRow[1].trim(), // Trim the values here
          "City": csvRow[5].trim(),
          "Description": csvRow[4].trim()
      };

      try {
        let validationResponse: any = await this.config.apiClient.processRequest(this.ValidateRowBR(rowToValidate));

        // Check for duplicate Ident_Org here
        if (firstColumnValues.indexOf(csvRow[1]) !== firstColumnValues.lastIndexOf(csvRow[1])) {
          validationResponse["Ident_Org"] = "The CSV has already a same Business Role name.";
        }

        console.log(validationResponse);

        const columnMapping = {
          1: "Ident_Org",
          5: "City",
          4: "Description"
        };

        Object.keys(columnMapping).forEach(colIndex => {
          const columnName = columnMapping[colIndex];
          if (validationResponse[columnName] && validationResponse[columnName] !== "ok") {
            this.validationResults.push({ rowIndex, colIndex: Number(colIndex), message: validationResponse[columnName] });
            this.allvalidated = false;
            this.numberOfErrors++;
          }
        });

      } catch (error) {
        console.error(`Error validating row ${rowIndex}: ${error}`);
        this.allvalidated = false;
        this.validationResults$.next(this.validationResults);
      }
    }

    this.validating = false;
    console.log(this.allvalidated);
    this.cdr.detectChanges();
    setTimeout(() => {
      this.loading = false;
    });
  }

  public async onValidateClickedID(): Promise<void> {
    this.shouldValidate = true;
    await this.validateID();
    this.allRowsValidated = this.checkAllRowsValidated(); // Call the new method after validation
  }

  public async validateID(): Promise<void> {
    this.loading = true;
    if(this.initializing) {
      setTimeout(() => {
        this.loading = false;
      });
      return;
    }
    if(!this.shouldValidate) {
      setTimeout(() => {
        this.loading = false;
      });
      return;
    }
    this.validationResults = [];  // Clear the previous validation results
    this.allvalidated = true;
    this.validating = true;
    this.numberOfErrors = 0;  // Reset the error count before new validation

    for (const [rowIndex, csvRow] of this.csvDataSource.data.entries()) {  // Validate all rows
      const rowToValidate: any = {
          "FirstName": csvRow[1].trim(), // Trim the values here
          "LastName": csvRow[2].trim(),
          "Manager": csvRow[3].trim(),
          "Department": csvRow[5].trim()
      };

      try {
        let validationResponse: any = await this.config.apiClient.processRequest(this.ValidateRowID(rowToValidate));

        console.log(validationResponse);

        const columnMapping = {
          1: "FirstName",
          2: "LastName",
          3: "Manager",
          5: "Department"
        };

        Object.keys(columnMapping).forEach(colIndex => {
          const columnName = columnMapping[colIndex];
          if (validationResponse[columnName] && validationResponse[columnName] !== "ok") {
            this.validationResults.push({ rowIndex, colIndex: Number(colIndex), message: validationResponse[columnName] });
            this.allvalidated = false;
            this.numberOfErrors++;
          }
        });

      } catch (error) {
        console.error(`Error validating row ${rowIndex}: ${error}`);
        this.allvalidated = false;
        this.validationResults$.next(this.validationResults);
      }
    }

    this.validating = false;
    console.log(this.allvalidated);
    this.cdr.detectChanges();
    setTimeout(() => {
      this.loading = false;
    });
  }

  public pageChanged(event: PageEvent): void {
    this.loading = true;
    const startIndex = event.pageIndex * event.pageSize;
    let endIndex = startIndex + event.pageSize;

    if (endIndex > this.csvDataSource.data.length) {
      endIndex = this.csvDataSource.data.length;
    }

    this.visibleRows = this.csvDataSource.data.slice(startIndex, endIndex);
    this.cdr.detectChanges();
    setTimeout(() => {
      this.loading = false;
    });
  }

  private ValidateRowBR(rowToValidate: any): MethodDescriptor<ValidationElement> {
    return {
      path: `/portal/validateBR`,
      parameters: [
        {
          name: 'rowToValidate',
          value: rowToValidate,
          in: 'body'
        },
      ],
      method: 'POST',
      headers: {
        'imx-timezone': TimeZoneInfo.get(),
      },
      credentials: 'include',
      observe: 'response',
      responseType: 'json'
    };
  }

  private ValidateRowID(rowToValidate: any): MethodDescriptor<ValidationElement> {
    return {
      path: `/portal/validateID`,
      parameters: [
        {
          name: 'rowToValidate',
          value: rowToValidate,
          in: 'body'
        },
      ],
      method: 'POST',
      headers: {
        'imx-timezone': TimeZoneInfo.get(),
      },
      credentials: 'include',
      observe: 'response',
      responseType: 'json'
    };
  }

  public async importToDatabaseBR(): Promise<PeriodicElement[]> {
    this.loading = true;
    const inputParameters: any[] = [];
    const csvData = this.csvDataSource.data;
    const results: PeriodicElement[] = [];
    this.validating = true;

    for (const csvRow of csvData) {
      const inputParameterName: any = {
        "Ident_Org": '',
        "City": '',
        "Description": ''
      };

      // Remove line breaks and leading/trailing spaces
      const cleanRow = csvRow.map(cell => typeof cell === 'string' ? cell.replace(/[\r\n]+/g, '').trim() : cell);

      inputParameterName['Ident_Org'] = cleanRow[1];
      inputParameterName['City'] = cleanRow[5];
      inputParameterName['Description'] = cleanRow[4];

      inputParameters.push(inputParameterName);
    }

    for (const inputParameter of inputParameters) {
      console.log(inputParameter);
      try {
        const data = await this.config.apiClient.processRequest(this.PostBR(inputParameter));
        results.push(data);
      } catch (error) {
        console.error(`Error submitting CSV data: ${error}`);
      }
    }
    this.allRowsValidated = false;
    setTimeout(() => {
      this.loading = false;
    });
    return results;

  }


private PostBR(inputParameterName: any): MethodDescriptor<PeriodicElement> {
  return {
    path: `/portal/createBR`,
    parameters: [
      {
        name: 'inputParameterName',
        value: inputParameterName,
        in: 'body'
      },
    ],
    method: 'POST',
    headers: {
      'imx-timezone': TimeZoneInfo.get(),
    },
    credentials: 'include',
    observe: 'response',
    responseType: 'json'
  };
}


public async getCustom(): Promise<ConfigElement> {
  const data = await this.config.apiClient.processRequest(this.getConfigCsv());
  ConfigParam = [data];
  this.configSource = ConfigParam;
  return data;
 }

 private getConfigCsv(): MethodDescriptor<ConfigElement> {
  const parameters = [];
  return {
    path: `/portal/ConfigCsv`,
    parameters,
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
