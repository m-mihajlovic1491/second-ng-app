import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './components/header/header';
import { HeroTableComponent } from './components/body/body';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header],
  template: `
    <h1>Welcome to {{ title() }}!</h1>
    <button (click)="resetCounter()">Reset counter</button>
    <button (click)="increaseCounter()">Increase counter</button>
    <p>number of clicks: {{counter}}</p>

    <app-header/>
    <router-outlet/>    
  `,
  styles: [
    `button {
      background-color: red;
    }`
  ],
})
export class App {
  protected readonly title = signal('second-ng-app');
   counter: number = 0;

  resetCounter() {
    this.counter = 0   
  }
  increaseCounter() {
    this.counter++    
  }
}
