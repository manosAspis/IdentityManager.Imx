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
    this.headerService.headers$.subscribe(headers => {
      this.headers = headers;
    });
    this.authentication.update();
  }

  isFormComplete(): boolean {
    if (!this.selectedTable) {
      return false;
    }

    /*for (let header of this.headers) {
      if (!this.columnMapping[header]) {
        return false;
      }
    }

    return true;*/
  }


  public async submit(): Promise<PeriodicElement[]> {
    const inputParameters: any[] = [];
    const csvData = this.csvDataService.csvData;
    const results: PeriodicElement[] = [];

    for (const csvRow of csvData) {
      const inputParameterName: any = {
        "Ident_Org": '',
        "City": '',
        "Description": ''
      };

      for (const header of this.headers) {
        const columnIndex = this.headers.indexOf(header);
        const columnName = this.columns[columnIndex];
        const columnValue = csvRow[columnIndex];

        if (columnName === this.columns[0]) {
          inputParameterName['Ident_Org'] = columnValue;
        } else if (columnName === this.columns[1]) {
          inputParameterName['City'] = columnValue;
        } else if (columnName === this.columns[2]) {
          inputParameterName['Description'] = columnValue;
        }
      }

      inputParameters.push(inputParameterName);
    }

    for (const inputParameter of inputParameters) {
      try {
        const data = await this.config.apiClient.processRequest(this.PostCsv(inputParameter));
        results.push(data);
      } catch (error) {
        console.error(`Error submitting CSV data: ${error}`);
      }
    }

    return results;
  }

private PostCsv(inputParameterName: any): MethodDescriptor<PeriodicElement> {
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
