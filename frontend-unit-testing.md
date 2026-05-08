# Frontend Unit Testing Guide (Angular)

This guide documents the baseline testing pattern for `second-ng-app` components, especially standalone components that call APIs.

## Core Pattern
- Keep tests next to the component: `component.ts`, `component.html`, `component.scss`, `component.spec.ts`.
- Configure standalone component tests with `imports: [YourComponent]`.
- For HTTP calls, use `provideHttpClient()` and `provideHttpClientTesting()`.
- Assert visible behavior/state (signals, rendered text, request payloads), not logs.

## Recommended Test Cases For New Components
1. Component creates successfully.
2. Validation behavior (missing/invalid user input).
3. Successful API call (method, URL, payload, user feedback).
4. Failed API call (error feedback path).

## Example Test Setup
```ts
await TestBed.configureTestingModule({
  imports: [CreateWeaponForm],
  providers: [provideZonelessChangeDetection(), provideHttpClient(), provideHttpClientTesting()]
}).compileComponents();

const fixture = TestBed.createComponent(CreateWeaponForm);
const component = fixture.componentInstance;
const httpMock = TestBed.inject(HttpTestingController);
```

## Example Assertions For API Form Components
```ts
component.nameControl.setValue('Sword');
component.damageControl.setValue('15');
component.createWeapon();

const req = httpMock.expectOne('https://localhost:7098/api/Weapon/Weapon');
expect(req.request.method).toBe('POST');
expect(req.request.body).toEqual({ name: 'Sword', damage: 15 });
req.flush('ok');
expect(component.message()).toBe('Weapon created successfully.');
```

## Running Tests
- Run all tests: `npm run test -- --watch=false --browsers=ChromeHeadless`
- Run a focused spec:  
  `npm run test -- --watch=false --browsers=ChromeHeadless --include="src/app/components/create-weapon-form/create-weapon-form.spec.ts"`

## Notes For This Repository
- Existing components currently call API endpoints with explicit localhost URLs.
- Keep tests deterministic by mocking HTTP with `HttpTestingController`.
- If full suite fails due unrelated legacy specs, document the failing spec path and still add passing focused tests for your changed component.
