import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UploadedImageItem } from '../../../interface/workspace.interface';

@Component({
  selector: 'app-uploaded-image',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './uploaded-image.component.html',
  styleUrl: './uploaded-image.component.scss',
})
export class UploadedImageComponent {
  @Input({ required: true }) image!: UploadedImageItem;
}
