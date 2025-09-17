import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './shared/components/navbar/navbar/navbar.component';
import { FooterComponent } from './shared/components/footer/footer/footer.component';

@Component({
  selector: 'app-root',
  standalone: true, // 🔑 muy importante en modo standalone
  imports: [RouterOutlet, NavbarComponent, FooterComponent],
  templateUrl: './app.html',
  styleUrls: ['./app.css'] // plural
})
export class App {
  protected readonly title = signal('todo-app');
}
