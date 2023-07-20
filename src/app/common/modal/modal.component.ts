import {
  Component,
  Input,
  Output,
  EventEmitter,
  HostListener,
} from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})
export class ModalComponent {
  @Input() isOpen!: boolean;
  @Output() closeModal = new EventEmitter<void>();
  @Input() disableClose?: boolean;

  onModalClick(event: Event) {
    event.stopPropagation();
  }

  onCloseModal() {
    this.closeModal.emit();
  }
}
