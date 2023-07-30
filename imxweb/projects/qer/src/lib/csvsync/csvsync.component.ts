import { Component, OnInit, ViewChild, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { QerService } from '../qer.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MethodDescriptor, TimeZoneInfo } from 'imx-qbm-dbts';
import { AppConfigService, AuthenticationService } from 'qbm';
import { BehaviorSubject } from 'rxjs';

export interface PeriodicElement {}
export interface ValidationElement{
  rowIndex: number;
  colIndex: number;
  message: string;
}


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


  constructor(
    private readonly config: AppConfigService,
    private readonly authentication: AuthenticationService,
    private qerService: QerService,
    private cdr: ChangeDetectorRef) {}

  public async ngOnInit(): Promise<void>  {

    this.validating = true;
    this.allvalidated = false;
    this.CsvImporter = this.qerService.getCsvImporter();
    this.authentication.update();
    this.cdr.detectChanges();
    console.log(this.CsvImporter)
    console.log(this.allvalidated)
    console.log(this.validating)
  }

  checkAllRowsValidated(): boolean {
    // Iterate through all rows and check if each one is validated
    for (const row of this.csvDataSource.data) {
      // Logic to check if a row is validated
      // Assuming your csvDataSource.data structure is the same as csvData
      const validationResult = this.validationResults.find(result => result.rowIndex === row[0] && result.colIndex === row[1]);
      if (!validationResult) {
        // If a row is not validated, return false
        return false;
      }
    }
    // If all rows are validated, return true
    return true;
  }


  ngAfterViewInit() {
    this.initializing = true;
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
        const lines = data.split('\n');
        this.headers = lines[0].split(',').map(header => header.trim());
        for (let i = 1; i < lines.length; i++) {
            const row = lines[i].split(',').map(cell => cell.trim()); // Trim the values here
            if (row.length > 1) {
                this.csvData.push(row);
            }
        }
        this.csvDataSource.data = this.csvData;
        this.fileLoaded = true;
    };
    reader.readAsText(file);
    this.allvalidated = false;
}



  replaceCsv() {
    this.fileLoaded = false;
    this.allvalidated = false;
    this.csvData = [];
    this.headers = [];
    this.csvDataSource.data = [];
    this.validationResponses = [];
    this.validationResults = [];
    this.validating = true;
  }


  getValidationResult(rowIndex: number, colIndex: number): string | undefined {
    const validationResult = this.validationResults.find(result => result.rowIndex === rowIndex && result.colIndex === colIndex);
    return validationResult?.message;
  }

  isValidationError(rowIndex: number, colIndex: number): boolean {
    return this.getValidationResult(rowIndex, colIndex) !== undefined;
  }

  public async onValidateClicked(): Promise<void> {
    this.shouldValidate = true;
    await this.validate();
    this.allRowsValidated = this.checkAllRowsValidated(); // Call the new method after validation
  }



  public async validate(): Promise<void> {
    if(this.initializing) {
      return;
    }
    if(!this.shouldValidate) {
      return;
    }
    this.validationResults = [];
    this.allvalidated = true;
    this.validating = true;
    this.visibleRows = this.csvDataSource.data.slice(this.paginator.pageIndex * this.paginator.pageSize, (this.paginator.pageIndex + 1) * this.paginator.pageSize);

    const firstColumnValues = this.csvDataSource.data.map(row => row[0]);

    for (const [rowIndex, csvRow] of this.visibleRows.entries()) {
      const rowToValidate: any = {
          "Ident_Org": csvRow[0].trim(), // Trim the values here
          "City": csvRow[4].trim(),
          "Description": csvRow[3].trim()
      };

      try {
        let validationResponse: any = await this.config.apiClient.processRequest(this.ValidateRow(rowToValidate));

        // Check for duplicate Ident_Org here
        if (firstColumnValues.indexOf(csvRow[0]) !== firstColumnValues.lastIndexOf(csvRow[0])) {
          validationResponse["Ident_Org"] = "The CSV has already a same Business Role name.";
        }

        console.log(validationResponse);

        const columnMapping = {
          0: "Ident_Org",
          4: "City",
          3: "Description"
        };

        Object.keys(columnMapping).forEach(colIndex => {
          const columnName = columnMapping[colIndex];
          if (validationResponse[columnName] && validationResponse[columnName] !== "ok") {
            this.validationResults.push({ rowIndex, colIndex: Number(colIndex), message: validationResponse[columnName] });
            this.allvalidated = false;
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
  }

  public pageChanged(event: PageEvent): void {
    const startIndex = event.pageIndex * event.pageSize;
    let endIndex = startIndex + event.pageSize;

    if (endIndex > this.csvDataSource.data.length) {
      endIndex = this.csvDataSource.data.length;
    }

    this.visibleRows = this.csvDataSource.data.slice(startIndex, endIndex);
    if(this.shouldValidate) {
      this.validate();
    }
  }




  private ValidateRow(rowToValidate: any): MethodDescriptor<ValidationElement> {
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


  public async importToDatabase(): Promise<PeriodicElement[]> {
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

      inputParameterName['Ident_Org'] = cleanRow[0];
      inputParameterName['City'] = cleanRow[4];
      inputParameterName['Description'] = cleanRow[3];

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
    this.validating = false;
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
}
