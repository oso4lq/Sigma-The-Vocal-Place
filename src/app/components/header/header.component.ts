import { Component, OnInit, Renderer2 } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { SocialMediaComponent } from '../social-media/social-media.component';
import { ScrollingService } from '../../services/scrolling.service';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MobileService } from '../../services/mobile.service';
import { skip } from 'rxjs';
import Swiper from 'swiper';
import { Navigation, Pagination } from 'swiper/modules';
import { SwiperOptions } from 'swiper/types';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    CommonModule,
    SocialMediaComponent,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {

  isMenuOpen = false;
  swiperSections!: Swiper;
  swiperSectionID: number = 0;

  swiperSectionsConfig: SwiperOptions = {
    direction: 'vertical',
    slidesPerView: 1,
    freeMode: false,
    grabCursor: false,
    loop: false,
    centeredSlides: true,
    initialSlide: 0,
    slideToClickedSlide: false,
    resistanceRatio: 0.5,
    speed: 500,
    autoHeight: true,
  };

  constructor(
    private scrollingService: ScrollingService,
    private mobileService: MobileService,
    private renderer: Renderer2,
  ) { }

  ngOnInit() {
    if (this.mobileService.isMobile) {
      this.mobileService.swipeRight$.pipe(skip(1)).subscribe(() => {
        if (!this.isMenuOpen) this.toggleMenu();
      });

      this.mobileService.swipeLeft$.pipe(skip(1)).subscribe(() => {
        if (this.isMenuOpen) this.toggleMenu();
      });
    }

    this.scrollingService.sectionIndex$.subscribe(index => {
      this.updateSwiperSection(index);
    });
  }

  ngAfterViewInit() {
    Swiper.use([Navigation, Pagination]);

    this.swiperSections = new Swiper('.swiper-sections', this.swiperSectionsConfig);

    this.swiperSections.on('slideChange', () => {
      console.log('Slide changed swiperSections');
    });
  }

  // Display the current section name inside the #swiper-button
  updateSwiperSection(index: number) {
    if (this.swiperSections) {
      console.log('swiper section ', index);
      this.swiperSections.slideTo(index);
      this.swiperSectionID = index;

      // Update the custom property based on the current section index
      const swiperButton = document.getElementById('swiper-button');
      if (swiperButton) {
        swiperButton.style.setProperty('--swiper-section-index', index.toString());
      }
    }
  }

  scrollToSection(id: string) {
    console.log('scrollToSection');
    if (this.mobileService.isMobile) {
      this.closeMenu(); // Close menu after selection
    }
    this.scrollingService.scrollToSection(id);
  }

  toggleMenu() {
    console.log('toggleMenu');
    this.isMenuOpen = !this.isMenuOpen;
    const logo = document.body.querySelector('.logo');

    if (this.isMenuOpen) {
      // Disable scrolling the page
      this.renderer.addClass(document.body, 'no-scroll');
      // Make logo fully opaque
      this.renderer.setStyle(logo, 'opacity', '1');
      // Enable the backdrop div (flex)
      this.renderer.addClass(document.querySelector('.dropdown-background'), 'flex');
      // Wait 10ms and apply animation to the backdrop and menu
      setTimeout(() => {
        this.renderer.addClass(document.querySelector('.dropdown-background'), 'show');
        this.renderer.addClass(document.querySelector('.menu-dropdown'), 'show');
      },
        10);
    } else {
      this.closeMenu();
    }
  }

  closeMenu() {
    console.log('closeMenu');
    this.isMenuOpen = false;
    // Disable scrolling the page
    this.renderer.removeClass(document.body, 'no-scroll');
    // Reset logo opacity based on section
    this.scrollingService.handleHeaderTransparency();
    // Remove the menu and the backdrop
    this.renderer.removeClass(document.querySelector('.dropdown-background'), 'show');
    this.renderer.removeClass(document.querySelector('.menu-dropdown'), 'show');
    // Wait till the end of the animation and disable the backdrop div (none)
    setTimeout(() => this.renderer.removeClass(document.querySelector('.dropdown-background'), 'flex'), 300);
  }
}
