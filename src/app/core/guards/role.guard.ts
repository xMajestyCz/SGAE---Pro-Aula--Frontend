import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router } from "@angular/router";
import { AlertService } from "src/app/shared/services/alert.service";

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor( private alertService: AlertService) {

  }

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const expectedRole = route.data['role'];
    const UserRole = localStorage.getItem('UserRole');

    if (UserRole === expectedRole) {
      return true;
    } else {
      this.alertService.showAccessDeniedAlert();
      return false;
    }
  }
}
