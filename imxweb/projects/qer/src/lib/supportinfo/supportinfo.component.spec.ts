import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupportinfoComponent } from './supportinfo.component';

describe('SupportinfoComponent', () => {
  let component: SupportinfoComponent;
  let fixture: ComponentFixture<SupportinfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SupportinfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SupportinfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
