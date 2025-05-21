import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-enrollment',
  templateUrl: './enrollment.component.html',
  styleUrls: ['./enrollment.component.scss'],
  standalone:false
})
export class EnrollmentComponent  implements OnInit {

  selectedTab: any;

  constructor() { }

  ngOnInit() {}
  
    onSegmentChanged(event: any) {
    this.selectedTab = event.detail.value;
  }

}
