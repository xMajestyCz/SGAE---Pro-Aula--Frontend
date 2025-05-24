import { Component, OnInit } from '@angular/core';
import { IonCard } from "@ionic/angular/standalone";
import { ModalService } from '../../services/modal.service';

@Component({
  selector: 'app-academy-result',
  templateUrl: './academy-result.component.html',
  styleUrls: ['./academy-result.component.scss'],
  standalone:false
})
export class AcademyResultComponent  implements OnInit {

  constructor(private modalService: ModalService) { }

  ngOnInit() {}

   
async openModal() {
  const existingModal = await this.modalService.getTop();
  if (!existingModal){
    console.log('Abriendo modal...');
    await this.modalService.open(AcademyResultComponent, {}, 'modal-academy-result');
  }
}
async closeModal() {
  console.log('Cerrando modal...');
  await this.modalService.dismiss();

}

}
