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
  private isScrolling: boolean = false;

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

  private updateSwiperForSection(sectionId: string): void {
    const sectionMapping: { [key: string]: number } = {
      'classes-section': 0,
      'tutor-section': 1,
      'studio-section': 2
    };

    const index = sectionMapping[sectionId];
    this.sectionIndexSubject.next(index);
  }


  // Helper for onWindowScroll
  checkCurrentSection(): void {
    console.log('checkCurrentSection');
    // Offset for the header height
    const scrollPosition = window.pageYOffset + 80;

    this.sections.forEach((sectionId, index) => {
      const sectionElement = document.getElementById(sectionId);
      if (sectionElement) {
        const sectionTop = sectionElement.offsetTop;
        const sectionHeight = sectionElement.offsetHeight;

        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
          this.currentSectionIndex = index;
          this.highlightMenuButton(sectionId);
        }
      }
    });
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

  // Listen mouse wheel up/down
  private onWheelScroll(event: WheelEvent): void {
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

  // Helper for onWheelScroll/onKeyDown
  scrollToSection(sectionId: string): void {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" });

      setTimeout(() => {
        this.isScrolling = false;
      }, 500);

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
}
