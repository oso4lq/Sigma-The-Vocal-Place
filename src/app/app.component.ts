import { Component, OnInit } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { HomeComponent } from './components/home/home.component';
import { AboutComponent } from './components/about/about.component';
import { ContactsComponent } from './components/contacts/contacts.component';
import { ClassesComponent } from './components/classes/classes.component';
import { ScrollingService } from './services/scrolling.service';
import { StudioComponent } from './components/studio/studio.component';
import { TutorComponent } from './components/tutor/tutor.component';


// import { HttpClientModule, HttpClient } from '@angular/common/http';
// import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
// import { TranslateHttpLoader } from '@ngx-translate/http-loader';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    HeaderComponent,
    HomeComponent,
    AboutComponent,
    ClassesComponent,
    TutorComponent,
    StudioComponent,
    ContactsComponent,
    RouterOutlet,

    // RouterModule.forRoot(routes),
    // TranslateModule.forRoot({
    //   loader: {
    //     provide: TranslateLoader,
    //     useFactory: HttpLoaderFactory,
    //     deps: [HttpClient]
    //   }
    // })

  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'sigma-vocal-place';

  constructor(private scrollingService: ScrollingService) { }

  ngOnInit() {
    // Check section on app load
    this.scrollingService.checkCurrentSection(); 
    // Make header semi-transparent on the home section
    this.scrollingService.handleHeaderTransparency();
  }

}
