import { Component, OnInit, Input, Output, EventEmitter, ViewChild, AfterViewInit } from '@angular/core';
import { EuiSidesheetService } from '@elemental-ui/core';
import { HeaderService } from './csvmapping/header.service';
import { CsvDataService } from './csvmapping/csvdata.service';
import { QerService } from '../qer.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'imx-csvsync',
  templateUrl: './csvsync.component.html',
  styleUrls: ['./csvsync.component.scss']
})
export class CsvsyncComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  csvDataSource: MatTableDataSource<any> = new MatTableDataSource();
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

  ngAfterViewInit() {
    this.csvDataSource.paginator = this.paginator;
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.processFile(file);
    }
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
      this.csvDataService.setCsvData(this.csvData);
      this.fileLoaded = true;
    };
    reader.readAsText(file);
  }

  onCellValueChange(event: any, rowIndex: number, cellIndex: number): void {
    this.csvData[rowIndex][cellIndex] = event.target.value;
  }

  validate() {}

  replaceCsv() {
    this.fileLoaded = false;
    this.csvData = [];
    this.headers = [];
    this.csvDataSource.data = [];
  }

  importToDatabase() {
    /*this.headerService.setHeaders(this.headers);
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
    });*/
  }
}
