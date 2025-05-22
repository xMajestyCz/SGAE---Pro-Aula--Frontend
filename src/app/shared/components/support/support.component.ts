import { Component, OnInit } from '@angular/core';
import { ReportComponent } from '../report/report.component';
import { ModalService } from '../../services/modal.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-support',
  templateUrl: './support.component.html',
  styleUrls: ['./support.component.scss'],
  standalone: false
})
export class SupportComponent  implements OnInit {

  constructor(
        private modalService: ModalService, 
        private toastService: ToastService,
  ) { }

  ngOnInit() {}

  async openReportModal() {
      const modal = await this.modalService.open(
        ReportComponent,
        {},
        'report-modal'
      );
      
      modal.onDidDismiss().then((result: any) => {
        if (result.data?.success) {
          this.toastService.show(
            'Tu problema ha sido reportado exitosamente',
            'success',
            3000,
            'top'
          );
        }
      });
    }

}
