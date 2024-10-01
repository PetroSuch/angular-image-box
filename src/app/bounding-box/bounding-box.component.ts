import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, HostListener, inject, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-bounding-box',
  templateUrl: './bounding-box.component.html',
  styleUrls: ['./bounding-box.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class BoundingBoxComponent {
  @ViewChild('imageWrapperEl') imageWrapperEl!: ElementRef;
  public uploadedImage: string | ArrayBuffer | null = null;
  public isDragging = false;
  public dragging = false;
  public dragStart = { x: 0, y: 0 };
  public initialPosition = { x: 0, y: 0 };
  public boundingBox = {
    x: 0,
    y: 0,
    width: 100,
    height: 100
  };

  private readonly cdr = inject(ChangeDetectorRef);

  public get maxWidth(): number {
    if (!this.imageWrapperEl) return 100;
    return this.imageWrapperEl.nativeElement.clientWidth;
  }

  public get maxHeight(): number {
    if (!this.imageWrapperEl) return 100;
    return this.imageWrapperEl.nativeElement.clientHeight;
  }

  ngAfterViewInit() {
    this.cdr.detectChanges();
  }

  public onImageUpload(event: any) {
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.uploadedImage = e.target.result;
        this.cdr.detectChanges();
      };
      reader.readAsDataURL(file);
    }
  }

  public validateBoundingBox() {
    const imgElement = this.imageWrapperEl.nativeElement;
    const imgWidth = imgElement.clientWidth;
    const imgHeight = imgElement.clientHeight;

    if (this.boundingBox.x < 0) this.boundingBox.x = 0;
    if (this.boundingBox.y < 0) this.boundingBox.y = 0;
    if (this.boundingBox.x + this.boundingBox.width > imgWidth) {
      this.boundingBox.x = imgWidth - this.boundingBox.width;
    }
    if (this.boundingBox.y + this.boundingBox.height > imgHeight) {
      this.boundingBox.y = imgHeight - this.boundingBox.height;
    }
  }

  public onBoxMouseDown(event: MouseEvent): void {
    this.dragging = true;
    this.dragStart = { x: event.clientX, y: event.clientY };
    this.initialPosition = { x: this.boundingBox.x, y: this.boundingBox.y };
  }

  public onBoxMouseUp(): void {
    this.dragging = false;
  }

  public onBoxMouseMove(event: MouseEvent): void {
    if (this.dragging) {
      const deltaX = event.clientX - this.dragStart.x;
      const deltaY = event.clientY - this.dragStart.y;

      this.boundingBox.x = this.initialPosition.x + deltaX;
      this.boundingBox.y = this.initialPosition.y + deltaY;
      this.validateBoundingBox();
    }
  }

  onBoxTouchStart(event: TouchEvent) {
    this.dragging = true;
    this.dragStart = { x: event.touches[0].clientX, y: event.touches[0].clientY };
    event.preventDefault();
  }

  onBoxTouchMove(event: TouchEvent) {
    if (this.dragging) {
      const touch = event.touches[0];
      const deltaX = touch.clientX - this.dragStart.x;
      const deltaY = touch.clientY - this.dragStart.y;

      this.boundingBox.x = this.initialPosition.x + deltaX;
      this.boundingBox.y = this.initialPosition.y + deltaY;
      this.validateBoundingBox();
      event.preventDefault();
    }
  }

  onBoxTouchEnd(event: TouchEvent) {
    this.dragging = false;
    event.preventDefault();
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    if (this.dragging) {
      this.onBoxMouseMove(event);
    }
  }

  @HostListener('document:mouseup')
  onMouseUp(): void {
    if (this.dragging) this.onBoxMouseUp();
  }
}