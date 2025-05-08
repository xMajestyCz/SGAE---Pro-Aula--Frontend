import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(private router:Router){

  }

  canActivate(route: ActivatedRouteSnapshot): boolean {
  const expectedRole=route.data['role'];
  const UserRole= localStorage.getItem('UserRole');

  if (UserRole === expectedRole) {
    return true;
  } else {
    this.router.navigate(['/acceso-denegado']); 
    return false;
  }
      
  }
}
