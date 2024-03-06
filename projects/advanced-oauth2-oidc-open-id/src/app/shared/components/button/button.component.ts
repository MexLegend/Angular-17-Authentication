import {
  ChangeDetectionStrategy,
  Component,
  Input,
  booleanAttribute,
} from '@angular/core';
import { LoadingIconComponent } from '@shared/advanced-auth/icons/loading-icon.component';

type ButtonType = 'button' | 'menu' | 'submit' | 'reset';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [LoadingIconComponent],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonComponent {
  @Input({ required: true }) label!: string;
  @Input() buttonType: ButtonType = 'button';
  @Input() customClasses?: string;
  @Input({ transform: booleanAttribute }) disableButton = false;
  @Input({ transform: booleanAttribute }) isLoading = false;
}
