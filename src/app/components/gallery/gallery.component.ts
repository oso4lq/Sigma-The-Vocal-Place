import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import EmblaCarousel, { EmblaCarouselType } from 'embla-carousel';

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [],
  templateUrl: './gallery.component.html',
  styleUrl: './gallery.component.scss'
})
export class EmblaGalleryComponent implements AfterViewInit {
  @ViewChild('embla') emblaRef!: ElementRef;
  private emblaCarousel!: EmblaCarouselType;

  ngAfterViewInit() {
    this.emblaCarousel = EmblaCarousel(this.emblaRef.nativeElement, {
      loop: false,
      containScroll: 'trimSnaps'
    });
  }

  ngOnDestroy() {
    this.emblaCarousel?.destroy();
  }
}