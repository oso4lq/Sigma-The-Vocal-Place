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
import { AppComponent } from '../../app.component';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    SocialMediaComponent,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    CommonModule,
    RouterModule,
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
    private parent: AppComponent,
    private renderer: Renderer2,

    private router: Router,
    private route: ActivatedRoute,
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

    // Listen for route changes and scroll to the section if applicable
    this.router.events.subscribe(() => {
      this.route.queryParams.subscribe(params => {
        const section = params['section'];
        if (section) {
          this.scrollToSection(section);
        }
      });
    });

    // Listen for route changes and scroll to the section if applicable
    // this.router.events.subscribe(() => {
    //   this.route.queryParams.subscribe(params => {
    //     const section = params['section'];
    //     if (section) {
    //       // Scroll to section based on the ID set in the component
    //       const element = document.getElementById(section);
    //       if (element) {
    //         element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    //       }
    //     }
    //   });
    // });
  }

  ngAfterViewInit() {
    Swiper.use([Navigation, Pagination]);
    this.swiperSections = new Swiper('.swiper-sections', this.swiperSectionsConfig);
  }

  // Display the current section name inside the #swiper-button
  updateSwiperSection(index: number) {
    if (this.swiperSections) {
      this.swiperSections.slideTo(index - 1);
      this.swiperSectionID = index;

      // Update the custom property based on the current section index
      const swiperButton = document.getElementById('swiper-button');
      if (swiperButton) {
        swiperButton.style.setProperty('--swiper-section-index', (index - 1).toString());
      }
    }
  }

  scrollToSection(id: string) {
    if (this.mobileService.isMobile) {
      this.closeMenu(); // Close menu after selection
    }
    this.scrollingService.scrollToSection(id);
  }

  toggleMenu() {
    // Prevent opening the menu if the image viewer is open
    if (this.parent.isDialogOpen) {
      return;
    }

    this.isMenuOpen = !this.isMenuOpen;

    if (this.isMenuOpen) {
      const logo = document.body.querySelector('.logo');
      this.scrollingService.restrictBodyScrolling();
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
    this.isMenuOpen = false;
    this.scrollingService.enableBodyScrolling();
    // Reset logo opacity based on section
    this.scrollingService.handleHeaderTransparency();
    // Remove the menu and the backdrop
    this.renderer.removeClass(document.querySelector('.dropdown-background'), 'show');
    this.renderer.removeClass(document.querySelector('.menu-dropdown'), 'show');
    // Wait till the end of the animation and disable the backdrop div (none)
    setTimeout(() => this.renderer.removeClass(document.querySelector('.dropdown-background'), 'flex'), 300);
  }

  openForm() {
    this.closeMenu();
    this.parent.openForm();
  }

}
