import { Component } from '@angular/core';
import { BoundingBoxComponent } from './bounding-box/bounding-box.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [BoundingBoxComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'image-bounding-box-app';
}
