import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { MobileService } from './mobile.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ScrollingService {

  private renderer: Renderer2;
  private sections: string[] = [
    'home-section',
    'about-section',
    'classes-section',
    'tutor-section',
    'studio-section',
    'contacts-section',
  ];

  private currentSectionIndex: number = 0;
  private isMainPage: boolean = true;
  private isScrolling: boolean = false;
  private isScrollingRestricted: boolean = false;

  private sectionIndexSubject = new BehaviorSubject<number>(0);
  sectionIndex$ = this.sectionIndexSubject.asObservable();

  constructor(
    private rendererFactory: RendererFactory2,
    private mobileService: MobileService,
  ) {
    this.renderer = rendererFactory.createRenderer(null, null);
    this.initScrollListeners();
  }

  private initScrollListeners(): void {
    // Disable jump-scrolling on mobile devices
    if (!this.mobileService.isMobile) {
      window.addEventListener('wheel', this.onWheelScroll.bind(this), { passive: false });
      window.addEventListener('keydown', this.onKeyDown.bind(this));
    }
    // Track events when navigating the page
    window.addEventListener('scroll', this.onWindowScroll.bind(this));
  }

  // Listen on window scrolling
  private onWindowScroll(): void {
    // Check section on scroll
    this.checkCurrentSection();
    // Make header semi-transparent on the home section
    this.handleHeaderTransparency();
  }

  // Helper for checkCurrentSection for onWindowScroll: highlight the button (active section)
  private highlightMenuButton(sectionId: string): void {
    const buttons = document.querySelectorAll('.menu button, .menu-dropdown button');
    buttons.forEach(button => {
      this.renderer.removeClass(button, 'highlighted');
      if (button.getAttribute('data-section') === sectionId) {
        this.renderer.addClass(button, 'highlighted');
      }
    });

    if (sectionId === 'classes-section' || sectionId === 'tutor-section' || sectionId === 'studio-section') {
      this.renderer.addClass(document.getElementById('swiper-button'), 'highlighted');
      this.updateSwiperForSection(sectionId);
    }
  }

  // Helper for highlightMenuButton for checkCurrentSection for onWindowScroll: 
  // highlight the section inside the swiper button (active section)
  private updateSwiperForSection(sectionId: string): void {
    const sectionMapping: { [key: string]: number } = {
      'default': 0, // Default state for non-swiper sections
      'classes-section': 1,
      'tutor-section': 2,
      'studio-section': 3
    };
    // Default to 0 if no match
    const index = sectionMapping[sectionId] || 0;
    this.sectionIndexSubject.next(index);
  }

  // Helper for onWindowScroll
  // Check the current section and update the header elements
  checkCurrentSection(): void {
    // console.log('checkCurrentSection');
    // Offset for the header height
    const scrollPosition = window.pageYOffset + 80;
    let matchedSection = false;

    this.sections.forEach((sectionId, index) => {
      const sectionElement = document.getElementById(sectionId);
      if (sectionElement) {
        const sectionTop = sectionElement.offsetTop;
        const sectionHeight = sectionElement.offsetHeight;

        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
          this.currentSectionIndex = index;
          this.highlightMenuButton(sectionId);
          matchedSection = true;

          // Update the swiper state if we are in a swiper section
          if (sectionId === 'classes-section' || sectionId === 'tutor-section' || sectionId === 'studio-section') {
            this.updateSwiperForSection(sectionId);
          } else {
            this.updateSwiperForSection('default');  // Non-swiper sections
          }
        }
      }
    });
    // If no section matched, set the default swiper state
    if (!matchedSection) {
      this.updateSwiperForSection('default');
    }
  }

  // Helper for onWindowScroll
  handleHeaderTransparency(): void {
    const homeSection = document.getElementById('home-section');
    const menu = document.body.querySelector('.menu');
    const logo = document.body.querySelector('.logo');

    if (homeSection && menu) {
      // Offset for the header height
      const scrollPosition = window.pageYOffset + 80;
      const sectionTop = homeSection.offsetTop;
      const sectionHeight = homeSection.offsetHeight;

      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        this.renderer.addClass(menu, 'semi-transparent');
        // Apply opacity to logo for mobile version
        if (this.mobileService.isMobile && logo) {
          this.renderer.setStyle(logo, 'opacity', '0');
        }
      } else {
        this.renderer.removeClass(menu, 'semi-transparent');
        // Remove opacity from logo for mobile version
        if (this.mobileService.isMobile && logo) {
          this.renderer.setStyle(logo, 'opacity', '1');
        }
      }
    }
  }

  // Remove all highlights from buttons when navigating to non-section pages
  removeAllButtonHighlights(): void {
    const buttons = document.querySelectorAll('.menu button, .menu-dropdown button');
    buttons.forEach(button => {
      this.renderer.removeClass(button, 'highlighted');
    });
    // Also remove highlight from the swiper button
    this.renderer.removeClass(document.getElementById('swiper-button'), 'highlighted');
  }

  // Reset header transparency for non-section pages
  resetHeaderTransparency(): void {
    const menu = document.body.querySelector('.menu');
    const logo = document.body.querySelector('.logo');

    if (menu) {
      this.renderer.removeClass(menu, 'semi-transparent');
    }
    // Ensure logo is fully opaque for mobile
    if (this.mobileService.isMobile && logo) {
      this.renderer.setStyle(logo, 'opacity', '1');
    }
  }

  // Set whether the user is on the main page
  setMainPage(isMain: boolean): void {
    this.isMainPage = isMain;
  }

  // Listen mouse wheel up/down
  private onWheelScroll(event: WheelEvent): void {

    // Restrict listening to the mouse when outside the Main Page or the Image Viewer is opened
    if (!this.isMainPage || this.isScrollingRestricted) {
      return
    }

    event.preventDefault();
    if (this.isScrolling) return;
    this.isScrolling = true;

    if (event.deltaY > 0) {
      this.scrollToNextSection();
    } else if (event.deltaY < 0) {
      this.scrollToPreviousSection();
    }
  }

  // Listen arrow up/down keys
  private onKeyDown(event: KeyboardEvent): void {

    // Restrict listening to the keys when outside the Main Page or the Image Viewer is opened
    if (!this.isMainPage || this.isScrollingRestricted) {
      return
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      if (this.isScrolling) return;
      this.isScrolling = true;
      this.scrollToNextSection();
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      if (this.isScrolling) return;
      this.isScrolling = true;
      this.scrollToPreviousSection();
    }
  }

  // Helper for onWheelScroll/onKeyDown and is used throughout the App
  scrollToSection(sectionId: string): void {
    const section = document.getElementById(sectionId);
    if (section) {
      setTimeout(() => {
        section.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
      }, 10);
      setTimeout(() => {
        this.isScrolling = false;
      }, 500);  // Add a slight delay to ensure DOM is rendered before scrolling
      this.highlightMenuButton(sectionId);
    }
  }

  // Helper for onWheelScroll/onKeyDown
  private scrollToNextSection(): void {
    if (this.currentSectionIndex < this.sections.length - 1) {
      this.currentSectionIndex++;
      this.scrollToSection(this.sections[this.currentSectionIndex]);
    } else {
      this.isScrolling = false;
    }
  }

  // Helper for onWheelScroll/onKeyDown
  private scrollToPreviousSection(): void {
    if (this.currentSectionIndex > 0) {
      this.currentSectionIndex--;
      this.scrollToSection(this.sections[this.currentSectionIndex]);
    } else {
      this.isScrolling = false;
    }
  }

  // Disable scrolling the page
  restrictBodyScrolling(): void {
    this.isScrollingRestricted = true;
    this.renderer.addClass(document.body, 'no-scroll');
  }

  // Disable scrolling the page
  enableBodyScrolling(): void {
    this.isScrollingRestricted = false;
    this.renderer.removeClass(document.body, 'no-scroll');
  }
}
