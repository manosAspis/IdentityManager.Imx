import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataExplorerPlusComponent } from './data-explorer-plus.component';

describe('DataExplorerPlusComponent', () => {
  let component: DataExplorerPlusComponent;
  let fixture: ComponentFixture<DataExplorerPlusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DataExplorerPlusComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DataExplorerPlusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
