import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { RoleGuard } from './core/guards/role.guard';
import { ChangePasswordComponent } from './shared/components/change-password/change-password.component';
import { NoAuthGuard } from './core/guards/noauth.guard';

const routes: Routes = [

  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'student',
    canActivate: [AuthGuard, RoleGuard],
    data: { role: 'student' },
    loadChildren: () => import('./pages/student/student.module').then( m => m.StudentPageModule)
  },
  {
    path: 'teacher',
    canActivate: [AuthGuard, RoleGuard],
    data: { role: 'teacher' },
    loadChildren: () => import('./pages/teacher/teacher.module').then( m => m.TeacherPageModule)
  },
  {
    path: 'secretary',
    canActivate: [AuthGuard, RoleGuard],
    data: { role: 'secretary' },
    loadChildren: () => import('./pages/secretary/secretary.module').then( m => m.SecretaryPageModule)
  },
  {
    path: 'admin',
    canActivate: [AuthGuard, RoleGuard],
    data: { role: 'admin' },
    loadChildren: () => import('./pages/admin/admin.module').then( m => m.AdminPageModule)
  },
  {
    path: 'change-password',
    component:ChangePasswordComponent
  },
  {
    path: 'coordinator',
    canActivate: [AuthGuard, RoleGuard],
    data: { role: 'coordinator' },
    loadChildren: () => import('./pages/coordinator/coordinator.module').then( m => m.CoordinatorPageModule)
  }



];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
