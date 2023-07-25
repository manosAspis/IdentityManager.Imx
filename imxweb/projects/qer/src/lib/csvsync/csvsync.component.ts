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

  constructor(
    private readonly config: AppConfigService,
    private readonly authentication: AuthenticationService,
    private qerService: QerService,
    private cdr: ChangeDetectorRef) {}

  public async ngOnInit(): Promise<void>  {
    this.CsvImporter = this.qerService.getCsvImporter();
    this.authentication.update();
    console.log(this.CsvImporter)
  }

  ngAfterViewInit() {
    this.csvDataSource.paginator = this.paginator;
    if (this.paginator) {
      this.paginator.page.subscribe(() => {
        this.validate();
      });
    } else {
      console.warn('Paginator is not available');
    }
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
    reader.onload = () => {
      const data = reader.result as string;
      const lines = data.split('\n');
      this.headers = lines[0].split(',');
      for (let i = 1; i < lines.length; i++) {
        const row = lines[i].split(',');
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
  }

  private checkForDuplicates(): void {
    let duplicates: {rowIndex: number, colIndex: number, message: string}[] = [];
    const firstColumnValues = this.csvData.map(row => row[0]);

    firstColumnValues.forEach((value, index) => {
        if (value && firstColumnValues.indexOf(value) !== firstColumnValues.lastIndexOf(value)) {
            if (!this.validationResults.find(result => result.rowIndex === index && result.colIndex === 0)) {
                duplicates.push({ rowIndex: index, colIndex: 0, message: "The CSV has already a same Business Role name." });
            }
        }
    });

    if(duplicates.length > 0) {
        this.validationResults.push(...duplicates);
        this.allvalidated = false;
        this.validationResults$.next(this.validationResults);
    }
}


  getValidationResult(rowIndex: number, colIndex: number): string | undefined {
    const validationResult = this.validationResults.find(result => result.rowIndex === rowIndex && result.colIndex === colIndex);
    return validationResult?.message;
  }

  isValidationError(rowIndex: number, colIndex: number): boolean {
    return this.getValidationResult(rowIndex, colIndex) !== undefined;
  }



  public async validate(): Promise<void> {
    this.validationResults = [];
    this.allvalidated = true;
    const csvData = this.csvDataSource.data;

    for (const [rowIndex, csvRow] of csvData.entries()) {
      const rowToValidate: any = {
        "Ident_Org": csvRow[0],
        "City": csvRow[4],
        "Description": csvRow[3]
      };

      try {
        const validationResponse: any = await this.config.apiClient.processRequest(this.ValidateRow(rowToValidate));
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
    this.checkForDuplicates();
    console.log(this.allvalidated);
    this.cdr.detectChanges();
  }

  public pageChanged(event: PageEvent): void {
    // the event object contains details about the new page
    console.log('Page changed to: ', event.pageIndex);
    console.log('Number of items per page: ', event.pageSize);

    // you can trigger your validation logic here, so it re-runs whenever the page changes
    this.validate();
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
