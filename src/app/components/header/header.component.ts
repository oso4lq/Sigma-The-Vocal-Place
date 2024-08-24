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

  constructor(private renderer: Renderer2) { }

  ngOnInit() {
    // Check section on initial load
    this.checkCurrentSection();
    // Add the wheel event listener as non-passive
    window.addEventListener('wheel', this.onWheelScroll.bind(this), { passive: false });
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    // Check section on scroll
    this.checkCurrentSection();
  }

  checkCurrentSection() {
    // Offset for the header height
    const scrollPosition = window.pageYOffset + 110;

    this.sections.forEach((sectionId, index) => {
      const sectionElement = document.getElementById(sectionId);
      if (sectionElement) {
        const sectionTop = sectionElement.offsetTop;
        const sectionHeight = sectionElement.offsetHeight;

        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
          this.currentSectionIndex = index;
          // console.log('currentSectionIndex is', this.currentSectionIndex);
          this.highlightMenuButton(sectionId);
        }
      }
    });

    // Handle the header transparency for the home section
    const homeSection = document.getElementById('home-section');
    if (homeSection) {
      const sectionTop = homeSection.offsetTop;
      const sectionHeight = homeSection.offsetHeight;

      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        // this.renderer.addClass(document.body.querySelector('mat-toolbar'), 'semi-transparent');
        this.renderer.addClass(document.body.querySelector('.menu'), 'semi-transparent');
      } else {
        // this.renderer.removeClass(document.body.querySelector('mat-toolbar'), 'semi-transparent');
        this.renderer.removeClass(document.body.querySelector('.menu'), 'semi-transparent');
      }
    }
  }

  onWheelScroll(event: WheelEvent) {
    // console.log('event.deltaY', event.deltaY);

    // Prevent the default scrolling behavior
    event.preventDefault();

    if (event.deltaY > 0) {
      this.scrollToNextSection();
    } else if (event.deltaY < 0) {
      this.scrollToPreviousSection();
    }
  }

  scrollToNextSection() {
    if (this.currentSectionIndex < this.sections.length - 1) {
      // console.log('scrollToNextSection');
      // console.log('currentSectionIndex', this.currentSectionIndex);
      this.currentSectionIndex++;
      // console.log('new currentSectionIndex', this.currentSectionIndex);
      this.scrollToSection(this.sections[this.currentSectionIndex]);
    }
  }

  scrollToPreviousSection() {
    if (this.currentSectionIndex > 0) {
      // console.log('scrollToPreviousSection');
      // console.log('currentSectionIndex', this.currentSectionIndex);
      this.currentSectionIndex--;
      this.scrollToSection(this.sections[this.currentSectionIndex]);
    }
  }

  scrollToSection(sectionId: string) {
    // console.log('scrollToSection to sectionId', sectionId);
    const section = document.getElementById(sectionId);
    if (section) {
      // console.log('section', section);

      // Enable smooth scrolling between the sections
      section.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" });

      this.highlightMenuButton(sectionId);
    }
  }

  highlightMenuButton(sectionId: string) {
    // console.log('highlightMenuButton', sectionId);
    const buttons = document.querySelectorAll('.menu button');
    buttons.forEach(button => {
      this.renderer.removeClass(button, 'highlighted');
      if (button.getAttribute('data-section') === sectionId) {
        this.renderer.addClass(button, 'highlighted');
      }
    });
  }
}