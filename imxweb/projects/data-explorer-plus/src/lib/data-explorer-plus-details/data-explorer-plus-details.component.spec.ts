import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataExplorerPlusDetailsComponent } from './data-explorer-plus-details.component';

describe('DataExplorerPlusDetailsComponent', () => {
  let component: DataExplorerPlusDetailsComponent;
  let fixture: ComponentFixture<DataExplorerPlusDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DataExplorerPlusDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DataExplorerPlusDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
