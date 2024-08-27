import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ScrollingService {
  private renderer: Renderer2;
  private sections: string[] = ['home-section', 'about-section', 'classes-section', 'contacts-section'];
  private currentSectionIndex: number = 0;
  private isScrolling: boolean = false;

  constructor(rendererFactory: RendererFactory2) {
    this.renderer = rendererFactory.createRenderer(null, null);
    this.initScrollListeners();
  }

  private initScrollListeners(): void {
    window.addEventListener('wheel', this.onWheelScroll.bind(this), { passive: false });
    window.addEventListener('keydown', this.onKeyDown.bind(this));
    window.addEventListener('scroll', this.onWindowScroll.bind(this));
  }

  // Listen on window scrolling
  private onWindowScroll(): void {
    // Check section on scroll
    this.checkCurrentSection();
    // Make header semi-transparent on the home section
    this.handleHeaderTransparency();
  }

  // Helper for checkCurrentSection for onWindowScroll
  // Highlight the button depending on the active section
  private highlightMenuButton(sectionId: string): void {
    const buttons = document.querySelectorAll('.menu button');
    buttons.forEach(button => {
      this.renderer.removeClass(button, 'highlighted');
      if (button.getAttribute('data-section') === sectionId) {
        this.renderer.addClass(button, 'highlighted');
      }
    });
  }

  // Helper for onWindowScroll
  checkCurrentSection(): void {
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

    if (homeSection && menu) {
      // Offset for the header height
      const scrollPosition = window.pageYOffset + 80;
      const sectionTop = homeSection.offsetTop;
      const sectionHeight = homeSection.offsetHeight;

      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        this.renderer.addClass(menu, 'semi-transparent');
      } else {
        this.renderer.removeClass(menu, 'semi-transparent');
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
