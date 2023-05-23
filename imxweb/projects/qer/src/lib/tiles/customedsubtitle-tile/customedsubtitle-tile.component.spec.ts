import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomedsubtitleTileComponent } from './customedsubtitle-tile.component';

describe('CustomedsubtitleTileComponent', () => {
  let component: CustomedsubtitleTileComponent;
  let fixture: ComponentFixture<CustomedsubtitleTileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomedsubtitleTileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomedsubtitleTileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
