import { Component, computed, Signal, signal, ViewChild, WritableSignal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { newUserRequest } from '../../interfaces/data.interface';
import { RequestsService } from '../../services/requests.service';
import { DialogService } from '../../services/dialog.service';
import { MobileService } from '../../services/mobile.service';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-request-list',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatExpansionModule,
    MatDividerModule,
    MatSidenavModule,
    MatButtonModule,
    MatTableModule,
    MatIconModule,
    CommonModule,
  ],
  templateUrl: './request-list.component.html',
  styleUrl: './request-list.component.scss'
})
export class RequestListComponent {

  @ViewChild('drawer') drawer!: MatSidenav;
  displayedColumns: string[] = ['date', 'user', 'phone', 'telegram', 'email'];

  // Constants
  readonly imgDefault = "https://res.cloudinary.com/dxunxtt1u/image/upload/userAvatarPlaceholder_ox0tj4.png";

  // Forms
  requestForm: FormGroup;

  // State as Signals
  selectedRequest: WritableSignal<newUserRequest | null> = signal(null); // Update selected user data

  // Signals from Services
  requests: Signal<newUserRequest[]> = computed(() => this.requestsService.requestsSig());

  constructor(
    private requestsService: RequestsService,
    private dialogService: DialogService,
    private mobileService: MobileService,
    private fb: FormBuilder,
  ) {
    // Initialize Display Form
    this.requestForm = this.fb.group({
      date: [{ value: '', disabled: true }],
      name: [{ value: '', disabled: true }],
      phone: [{ value: '', disabled: true }],
      telegram: [{ value: '', disabled: true }],
      email: [{ value: '', disabled: true }],
      message: [{ value: '', disabled: true }],
    });
  }

  ngOnInit(): void {
    // Load initial data
    this.requestsService.loadRequests();
  }

  selectRequest(req: newUserRequest): void {
    this.selectedRequest.set(req);
    this.populateRequestForm(req);
  }

  // Populates the display form with the Request user's data
  private populateRequestForm(req: newUserRequest): void {
    this.requestForm.patchValue({
      date: req?.date.toLocaleLowerCase(),
      name: req?.name,
      phone: req?.phone,
      telegram: req?.telegram,
      email: req?.email,
      message: req?.message,
    });
  }

  // Method to delete a Request forever
  deleteRequest(req: newUserRequest | null): void {
    this.dialogService.openDeleteRequestDialog(req);
    this.closeDrawer();
  }

  // Method to open the drawer and select a user
  openDrawer(req: newUserRequest): void {
    this.selectRequest(req);
    this.drawer.open();
  }

  // Optionally, close the drawer when needed
  closeDrawer(): void {
    this.drawer.close();
  }

  // Methods to handle table interaction events
  onTableInteractionStart(): void {
    this.mobileService.disableSwipeTracking();
  }

  onTableInteractionEnd(): void {
    this.mobileService.enableSwipeTracking();
  }

}