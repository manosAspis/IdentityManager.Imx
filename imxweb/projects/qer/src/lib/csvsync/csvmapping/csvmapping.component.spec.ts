import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CsvmappingComponent } from './csvmapping.component';

describe('CsvmappingComponent', () => {
  let component: CsvmappingComponent;
  let fixture: ComponentFixture<CsvmappingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CsvmappingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CsvmappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
