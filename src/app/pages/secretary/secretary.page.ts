import { Component, OnInit } from '@angular/core';
import { EnrollmentComponent } from 'src/app/shared/components/enrollment/enrollment.component';
import { ModalService } from 'src/app/shared/services/modal.service';



@Component({
  selector: 'app-secretary',
  templateUrl: './secretary.page.html',
  styleUrls: ['./secretary.page.scss'],
  standalone: false
})
export class SecretaryPage implements OnInit {

  selectedTab: string = 'first'; 

  constructor(private modalService: ModalService) { }

  

  ngOnInit() {
  }
  async openEnrollmentModal() {
    const currentTab = this.selectedTab;
    const modal = await this.modalService.open(
      EnrollmentComponent,
      {},
      'enrollment-modal'
    );

    await modal.present();
    const { data, role } = await modal.onWillDismiss();

    this.selectedTab = currentTab; // Restaurar el segmento seleccionado
  }



}
