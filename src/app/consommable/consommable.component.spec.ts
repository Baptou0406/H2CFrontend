import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsommablesComponent } from './consommable.component';

describe('ConsommableComponent', () => {
  let component: ConsommablesComponent;
  let fixture: ComponentFixture<ConsommablesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConsommablesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ConsommablesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
