import { Component, OnInit, Input } from '@angular/core';
import { EuiLoadingService, EuiSidesheetService } from '@elemental-ui/core';
import { QerService } from '../qer.service';
import { CsvmappingComponent } from './csvmapping/csvmapping.component';
import { HeaderService } from './csvmapping/header.service';

@Component({
  selector: 'imx-csvsync',
  templateUrl: './csvsync.component.html',
  styleUrls: ['./csvsync.component.scss']
})
export class CsvsyncComponent implements OnInit {
  csvData: any[] = [];
  fileLoaded: boolean = false;
  tables: string[] = [];
  selectedTable: string = '';
  columnMapping: { [key: string]: string } = {};
  mockColumns: string[] = [];
  @Input() headers: string[] = [];


  public noDataText = '#LDS#No data';
  public noDataIcon = 'table';

  constructor(
    private importDataService: QerService,
    private readonly sideSheet: EuiSidesheetService,
    private readonly busyService: EuiLoadingService,
    private headerService: HeaderService) {}


  ngOnInit() {}

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
      };
      reader.readAsText(file);
      this.fileLoaded = true;
    }
  }

  /*isMappingComplete() {
    for (let header of this.headers) {
      if (!this.columnMapping[header]) {
        return false;
      }
    }
    return true;
  }*/

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
        headers: this.headers // Pass the headers array here
      }
    });

    sideSheetRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.columnMapping = result.columnMapping;
      }
    });
  }
}
