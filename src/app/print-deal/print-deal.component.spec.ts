import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintDealComponent } from './print-deal.component';

describe('PrintDealComponent', () => {
  let component: PrintDealComponent;
  let fixture: ComponentFixture<PrintDealComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrintDealComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintDealComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
