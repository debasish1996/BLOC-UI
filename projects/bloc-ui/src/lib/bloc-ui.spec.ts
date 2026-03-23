import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlocUi } from './bloc-ui';

describe('BlocUi', () => {
  let component: BlocUi;
  let fixture: ComponentFixture<BlocUi>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlocUi],
    }).compileComponents();

    fixture = TestBed.createComponent(BlocUi);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
