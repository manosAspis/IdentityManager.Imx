import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { EuiSidesheetRef } from '@elemental-ui/core';
import { QerService } from '../../qer.service';
import { HeaderService } from './header.service';
import { MethodDescriptor, TimeZoneInfo } from 'imx-qbm-dbts';
import { AppConfigService, AuthenticationService } from 'qbm';
import { CsvDataService } from './csvdata.service';

export interface PeriodicElement {}

export interface CsvData {
  csvData: any[];
}

@Component({
  selector: 'imx-csvmapping',
  templateUrl: './csvmapping.component.html',
  styleUrls: ['./csvmapping.component.scss']
})
export class CsvmappingComponent implements OnInit {


  tables: string[] = [];
  @Input() headers: string[];
  @Input() csvData: any[];
  columns: string[] = [];
  columnsID: string[] = [];
  @Output() columnMappingUpdated = new EventEmitter<any>();

  selectedTable: string = '';
  columnMapping: { [key: string]: string } = {};

  updateColumnMapping() {
    this.columnMappingUpdated.emit(this.columnMapping);
  }

  columnSelectHovered: number | null = null;
  onColumnSelectHover(index: number) {
    this.columnSelectHovered = index;
  }

  onColumnSelectLeave() {
    this.columnSelectHovered = null;
  }


  constructor(
    private importDataService: QerService,
    private sideSheetRef: EuiSidesheetRef,
    private csvDataService: CsvDataService,
    private headerService: HeaderService,
    private readonly config: AppConfigService,
    private readonly authentication: AuthenticationService
  ) { }

  public async ngOnInit(): Promise<void> {
    this.tables = this.importDataService.CCC_Tables();
    this.columns = this.importDataService.CCC_BR_Columns();
    this.columnsID = this.importDataService.CCC_ID_Columns();
    this.headerService.headers$.subscribe(headers => {
      this.headers = headers;
    });
    this.authentication.update();
  }

  isFormComplete(): boolean {
    if (!this.selectedTable) {
      return false;
    }

    else {
      return true;
    }
  }

  public async submitBR(): Promise<PeriodicElement[]> {
    const inputParameters: any[] = [];
    const csvData = this.csvDataService.csvData;
    const results: PeriodicElement[] = [];

    for (const csvRow of csvData) {
      const inputParameterName: any = {
        "Ident_Org": '',
        "City": '',
        "Description": ''
      };

      for (const column of this.columns) {
        const headerName = this.columnMapping[column];
        const columnIndex = this.headers.indexOf(headerName);
        let columnValue = csvRow[columnIndex];

        if (columnValue && typeof columnValue === 'string') {
          columnValue = columnValue.replace(/[\r\n]+/g, ''); // Remove line breaks
        }

        if (column === this.columns[0]) {
          inputParameterName['Ident_Org'] = columnValue;
        } else if (column === this.columns[1]) {
          inputParameterName['City'] = columnValue;
        } else if (column === this.columns[2]) {
          inputParameterName['Description'] = columnValue;
        }
      }

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


public async submitID(): Promise<PeriodicElement[]> {
  const inputParameters: any[] = [];
  const csvData = this.csvDataService.csvData;
  const results: PeriodicElement[] = [];

  for (const csvRow of csvData) {
    const inputParameterName: any = {
      "FirstName": '',
      "LastName": ''
    };

    for (const column of this.columnsID) {
      const headerName = this.columnMapping[column];
      const columnIndex = this.headers.indexOf(headerName);
      let columnValue = csvRow[columnIndex];

      if (columnValue && typeof columnValue === 'string') {
        columnValue = columnValue.replace(/[\r\n]+/g, ''); // Remove line breaks
      }

      if (column === this.columnsID[0]) {
        inputParameterName['FirstName'] = columnValue;
      } else if (column === this.columnsID[1]) {
        inputParameterName['LastName'] = columnValue;
      }
    }

    inputParameters.push(inputParameterName);
  }

  for (const inputParameter of inputParameters) {
    console.log(inputParameter);
    try {
      const data = await this.config.apiClient.processRequest(this.PostID(inputParameter));
      results.push(data);
    } catch (error) {
      console.error(`Error submitting CSV data: ${error}`);
    }
  }

  return results;
}

private PostID(inputParameterName: any): MethodDescriptor<PeriodicElement> {
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
