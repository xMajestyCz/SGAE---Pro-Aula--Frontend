import { Component, OnInit, Input } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-log-user',
  templateUrl: './log-user.component.html',
  styleUrls: ['./log-user.component.scss'],
  standalone: false
})
export class LogUserComponent  implements OnInit {
  niveles: number[] = Array.from({ length: 11 }, (_, i) => i + 1);
  @Input() isInModal: boolean = false;
  @Input() titulo: string = '';

  constructor(private toastController: ToastController) { }

  ngOnInit() {}

  async presentToast(mensaje: string, color: string = 'primary') {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2000,
      color: color,
      position: 'top',
      cssClass: 'custom-toast'
    });
    await toast.present();
  }
  
  datosEstudiante = {
    nombre: '',
    apellido: '',
    documento: '',
    fechaNacimiento: '',
    lugarNacimiento: '',
    discapacidad:'',
    telefono: '',
    foto: '',
    direccion: '',
    email: '',
    nombreAcudiente: '',
    apellidoAcudiente: '',
    telefonoAcudiente: '',
    documentoAcudiente: '',
    ocupacionAcudiente: '',
    estadoCivilAcudiente: '',
    escuelaAnterior: '',
    gradoAnterior: '',
    promedioAnterior: '',
    gradoACursar: '',
  };
  guardarDatos(formulario: NgForm) {
    if (formulario.invalid) {
      this.presentToast('Por favor, completa todos los campos requeridos.', 'new3');
      return;
    }
  
    this.presentToast('Datos guardados correctamente.', 'new');
    formulario.resetForm();
  }
}
