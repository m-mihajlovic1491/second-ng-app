import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateHeroForm } from './create-hero-form';

describe('CreateHeroForm', () => {
  let component: CreateHeroForm;
  let fixture: ComponentFixture<CreateHeroForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateHeroForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateHeroForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
