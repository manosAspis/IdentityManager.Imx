import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { EuiSidesheetRef } from '@elemental-ui/core';
import { QerService } from '../../qer.service';
import { HeaderService } from './header.service';

@Component({
  selector: 'imx-csvmapping',
  templateUrl: './csvmapping.component.html',
  styleUrls: ['./csvmapping.component.scss']
})
export class CsvmappingComponent implements OnInit {

  tables: string[] = [];
  @Input() headers: string[];
  mockColumns: string[] = [];
  @Output() columnMappingUpdated = new EventEmitter<any>();

  csvData: any[] = [];
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
    private headerService: HeaderService
  ) { }

  ngOnInit(): void {
    this.tables = this.importDataService.getTables();
    this.mockColumns = this.importDataService.getMockColumns();
    this.headerService.headers$.subscribe(headers => {
      this.headers = headers;
    });
  }

  isFormComplete(): boolean {
    if (!this.selectedTable) {
      return false;
    }

    for (let header of this.headers) {
      if (!this.columnMapping[header]) {
        return false;
      }
    }

    return true;
  }

  submit(): void {
    // Implement logic to save changes to the database here.

    this.sideSheetRef.close();
  }


}
