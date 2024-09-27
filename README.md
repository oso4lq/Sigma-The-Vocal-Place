# Sigma The Vocal Place

This frontend project showcases the real vocal studio ΣΙΓΜΑ, highlighting its features and facilitating seamless communication between students and tutors. Featuring a cross-platform adaptive UI and advanced logic, the application efficiently manages requests from both new and existing students to sign up for classes and more.

*Pages: Main, Account, Privacy Policy*

**Main Page:**
The Main page is organized into multiple sections that highlight the tutor and her studio. Visitors can easily appreciate the benefits of choosing ΣΙΓΜΑ by viewing the studio’s description, photos, reviews, and the tutor’s background.

**Account Page:**
The Account page presents the user’s details, membership points, and class information. Classes are categorized by their status (Pending, Confirmed, Cancelled, Executed) allowing users to monitor their progress and plan their schedules effectively. The class list updates in real-time. Users can also sign up for new classes or cancel classes directly from this page. Refund policy is presented.

For tutor/admin, the Account page includes two additional sections: Admin Timeline and User List. Utilizing Angular Signals (subscriptions), the data management ensures accurate time slot displays and minimizes potential errors or misunderstandings. Tutor/admin can update class statuses, delete classes, adjust students’ membership points as needed, and manage new student requests.

**Admin Timeline:**
The Admin Timeline visually presents the class schedule with rows indicating free and occupied time slots for each day. Tutor/admin can view detailed information about each occupied slot, including the attending student and any messages they may have left. By default, the schedule displays a one-week range from the current date, but tutor/admin can adjust the date range as desired.

**User List:**
The User List features all registered users, with a search bar to filter by name and view detailed student information in an associated form. In the mobile version, the form fields are interactive, enabling one-click contact with users. Below the main list, a wrapper contains new student requests, with the header displaying the number of new requests to save page space by avoiding unnecessary wrapper expansions.

**Additional Features:**
User-friendly pop-ups enhance the user experience, incorporating custom components like date pickers and timelines to provide comprehensive information about the app’s functionality and available actions.

**Backend:**
The project’s backend is hosted on Google Firebase.

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 18.1.2.

=========================================

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
