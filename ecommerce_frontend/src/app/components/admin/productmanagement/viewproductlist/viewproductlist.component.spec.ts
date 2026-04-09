import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewproductlistComponent } from './viewproductlist.component';
import { beforeEach, describe, it } from 'node:test';

describe('ViewproductlistComponent', () => {
  let component: ViewproductlistComponent;
  let fixture: ComponentFixture<ViewproductlistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewproductlistComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewproductlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
