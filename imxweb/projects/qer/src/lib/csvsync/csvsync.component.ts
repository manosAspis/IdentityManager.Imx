import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { EuiSidesheetService } from '@elemental-ui/core';
import { CsvmappingComponent } from './csvmapping/csvmapping.component';

import { HeaderService } from './csvmapping/header.service';
import { CsvDataService } from './csvmapping/csvdata.service';
import { QerService } from '../qer.service';

@Component({
  selector: 'imx-csvsync',
  templateUrl: './csvsync.component.html',
  styleUrls: ['./csvsync.component.scss']
})
export class CsvsyncComponent implements OnInit {
  @Input() csvData: any[] = [];
  fileLoaded: boolean = false;
  columnMapping: { [key: string]: string } = {};
  @Input() headers: string[] = [];
  @Output() csvDataUpdated = new EventEmitter<any[]>();
  CsvImporter: boolean;



  public noDataText = '#LDS#No data';
  public noDataIcon = 'table';

  constructor(
    private readonly sideSheet: EuiSidesheetService,

    private csvDataService: CsvDataService,
    private headerService: HeaderService,
    private qerService: QerService) {}


  ngOnInit() {
    this.CsvImporter = this.qerService.getCsvImporter();
    console.log(this.CsvImporter)
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
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
        this.csvDataService.setCsvData(this.csvData);
        this.fileLoaded = true;
      };
      reader.readAsText(file);

    }
  }


  onCellValueChange(event: any, rowIndex: number, cellIndex: number): void {
    this.csvData[rowIndex][cellIndex] = event.target.value;
  }


  importToDatabase() {
    this.headerService.setHeaders(this.headers);
    const sideSheetRef = this.sideSheet.open(CsvmappingComponent, {
      title: 'Column Mapping',
      headerColour: 'iris-blue',
      panelClass: 'imx-sidesheet',
      padding: '0',
      width: '600px',
      testId: 'csv-mapping-sidesheet',
      data: {
        headers: this.headers, // Pass the headers array here
        csvData: this.csvDataService.csvData
      }
    });

    sideSheetRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.columnMapping = result.columnMapping;
      }
    });
  }
}
