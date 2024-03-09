import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-auth-layout',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <main
      class="flex items-center justify-center w-full h-full min-h-screen bg-slate-100 overflow-auto py-8"
    >
      <router-outlet />
    </main>
  `,
})
export class AuthLayoutComponent {}
