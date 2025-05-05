import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
  standalone: false
})
export class MainComponent  implements OnInit {
  @Input() ionLabel1 = '';
  @Input() ionLabel2 = '';
  @Input() ionLabel3 = '';
  @Input() ionCardTitle1 = '';
  @Input() ionCardTitle2 = '';
  @Input() ionCardTitle3 = '';
  isLoaded = false;

  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {
    this.cargarDatos();
  }

  async cargarDatos() {
    await new Promise(resolve => setTimeout(resolve, 1500));
    this.isLoaded = true;
  }
}
