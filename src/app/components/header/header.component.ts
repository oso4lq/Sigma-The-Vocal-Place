import { Component, HostListener, OnInit, Renderer2 } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatButtonModule,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {
  private sections: string[] = ['home-section', 'about-section', 'classes-section', 'contacts-section'];
  private currentSectionIndex: number = 0;
  private isScrolling: boolean = false;

  constructor(private renderer: Renderer2) { }

  ngOnInit() {
    this.checkCurrentSection(); // Check section on initial load
    window.addEventListener('wheel', this.onWheelScroll.bind(this), { passive: false });
    window.addEventListener('keydown', this.onKeyDown.bind(this));
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    setTimeout(() => {
      this.checkCurrentSection(); // Check section on scroll
    }, 500);
  }

  checkCurrentSection() {
    const scrollPosition = window.pageYOffset + 110; // Offset for the header height

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

    const homeSection = document.getElementById('home-section');
    if (homeSection) {
      const sectionTop = homeSection.offsetTop;
      const sectionHeight = homeSection.offsetHeight;

      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        this.renderer.addClass(document.body.querySelector('.menu'), 'semi-transparent');
      } else {
        this.renderer.removeClass(document.body.querySelector('.menu'), 'semi-transparent');
      }
    }
  }

  manageScrolling(event: WheelEvent | KeyboardEvent) {
    // Prevent default scrolling
    event.preventDefault();
    // Ignore if already scrolling
    if (this.isScrolling) return;
    // Set the flag to indicate scrolling is in progress
    this.isScrolling = true;
  }

  onWheelScroll(event: WheelEvent) {

    event.preventDefault();
    if (this.isScrolling) return;
    this.isScrolling = true;
    // this.manageScrolling(event);

    if (event.deltaY > 0) {
      this.scrollToNextSection();
    } else if (event.deltaY < 0) {
      this.scrollToPreviousSection();
    }
  }

  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'ArrowDown') {

      event.preventDefault();
      if (this.isScrolling) return;
      this.isScrolling = true;
      // this.manageScrolling(event);

      this.scrollToNextSection();
    } else if (event.key === 'ArrowUp') {

      event.preventDefault();
      if (this.isScrolling) return;
      this.isScrolling = true;
      // this.manageScrolling(event);

      this.scrollToPreviousSection();
    }
  }

  scrollToNextSection() {
    if (this.currentSectionIndex < this.sections.length - 1) {
      this.currentSectionIndex++;
      this.scrollToSection(this.sections[this.currentSectionIndex]);
    } else {
      this.isScrolling = false;  // Reset the flag if no more sections to scroll
    }
  }

  scrollToPreviousSection() {
    if (this.currentSectionIndex > 0) {
      this.currentSectionIndex--;
      this.scrollToSection(this.sections[this.currentSectionIndex]);
    } else {
      this.isScrolling = false;  // Reset the flag if no more sections to scroll
    }
  }

  scrollToSection(sectionId: string) {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" });

      // Estimate when the scrolling is likely to be done
      setTimeout(() => {
        this.isScrolling = false;  // Reset the flag after the scroll is likely to have completed
      }, 500); // Adjust this value if necessary

      this.highlightMenuButton(sectionId);
    }
  }

  highlightMenuButton(sectionId: string) {
    const buttons = document.querySelectorAll('.menu button');
    buttons.forEach(button => {
      this.renderer.removeClass(button, 'highlighted');
      if (button.getAttribute('data-section') === sectionId) {
        this.renderer.addClass(button, 'highlighted');
      }
    });
  }
}