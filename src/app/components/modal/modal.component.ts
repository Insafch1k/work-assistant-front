import { Component } from '@angular/core';
import { SubscriptionService } from '../../services/subscription.service';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent {
  constructor(public subscriptionService: SubscriptionService) {}

  closeModal() {
    this.subscriptionService.closeModal();
  }

  openChannel() {
    this.subscriptionService.openChannel();
  }
}