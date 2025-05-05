import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss'],
  standalone: false
})
export class AdminPage implements OnInit {
  selectedRole: string = '';
  showForm: boolean = false;
  roleNames: {[key: string]: string} = {
    'acudiente': 'Acudiente',
    'coordinador': 'Coordinador',
    'estudiante': 'Estudiante',
    'profesor': 'Profesor',
    'rector': 'Rector',
    'secretaria': 'Secretaria'
  };

  constructor(private menuCtrl: MenuController) { }

  ngOnInit() {
  }

  async selectRole(role: string) {
    this.selectedRole = role;
    this.showForm = true;
    await this.menuCtrl.close();
  }

  getRoleTitle(): string {
    return this.selectedRole ? this.roleNames[this.selectedRole] : 'Bienvenido';
  }
}
