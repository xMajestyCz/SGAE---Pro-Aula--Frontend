import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class NoAuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      return true; // Permite el acceso si NO hay token
    } else {
      this.router.navigate(['/']); // Redirige a la página principal si ya hay token
      return false;
    }
  }
}import { CanActivateFn } from '@angular/router';

export const noauthGuard: CanActivateFn = (route, state) => {
  return true;
};
