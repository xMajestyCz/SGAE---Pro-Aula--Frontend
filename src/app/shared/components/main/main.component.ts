import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
  standalone: false
})
export class MainComponent  implements OnInit {
  @Input() label: string = '';
  isLoaded = false;

  constructor() { }

  ngOnInit() {
    this.cargarDatos();
  }

  async cargarDatos() {
    await new Promise(resolve => setTimeout(resolve, 1500));
    this.isLoaded = true;
  }
}
