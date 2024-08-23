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
  private sections: string[] = ['home-section', 'about-section', 'contacts-section'];
  private currentSectionIndex: number = 0;

  constructor(private renderer: Renderer2) { }

  ngOnInit() {
    this.checkCurrentSection(); // Check section on initial load

    window.addEventListener('wheel', this.onWheelScroll.bind(this));
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.checkCurrentSection(); // Check section on scroll
  }

  checkCurrentSection() {
    const scrollPosition = window.pageYOffset + 150; // Offset for the header height

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

    // Handle the header transparency for the home section
    const homeSection = document.getElementById('home-section');
    if (homeSection) {
      const sectionTop = homeSection.offsetTop;
      const sectionHeight = homeSection.offsetHeight;

      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        this.renderer.addClass(document.body.querySelector('mat-toolbar'), 'semi-transparent');
      } else {
        this.renderer.removeClass(document.body.querySelector('mat-toolbar'), 'semi-transparent');
      }
    }
  }

  onWheelScroll(event: WheelEvent) {
    console.log('onWheelScroll', event);
    console.log('event.deltaY', event.deltaY);
    if (event.deltaY > 0) {
      this.scrollToNextSection();
    } else if (event.deltaY < 0) {
      this.scrollToPreviousSection();
    }
  }

  scrollToNextSection() {
    console.log('scrollToNextSection');
    console.log('currentSectionIndex', this.currentSectionIndex);
    if (this.currentSectionIndex < this.sections.length - 1) {
      this.currentSectionIndex++;
      this.scrollToSection(this.sections[this.currentSectionIndex]);
    }
  }

  scrollToPreviousSection() {
    console.log('scrollToPreviousSection');
    console.log('currentSectionIndex', this.currentSectionIndex);
    if (this.currentSectionIndex > 0) {
      this.currentSectionIndex--;
      this.scrollToSection(this.sections[this.currentSectionIndex]);
    }
  }

  scrollToSection(sectionId: string) {
    console.log('scrollToSection to sectionId', sectionId);
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
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