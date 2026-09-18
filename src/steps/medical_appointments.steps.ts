import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { environment } from '../config/environment';
import { AppointmentsPage } from '../pages/appointments.page';
import { LoginPage } from '../pages/login.page';
import { CustomWorld } from '../support/world';

const appointments = (world: CustomWorld) => new AppointmentsPage(world.page);

Given('I am on the MedAppoint login page', async function (this: CustomWorld) {
  await new LoginPage(this.page).goto();
  await expect(this.page).toHaveURL(/\/login$/);
});

When('I sign in with my configured credentials', async function (this: CustomWorld) {
  await new LoginPage(this.page).signIn();
});

Then('I should see the authenticated user email', async function (this: CustomWorld) {
  await appointments(this).expectAuthenticatedUser(environment.expectedEmail ?? environment.email);
});

When('I select the first available doctor', async function (this: CustomWorld) {
  await appointments(this).selectFirstDoctor();
});

When('I book the first available appointment slot', async function (this: CustomWorld) {
  this.bookedAppointmentText = await appointments(this).bookFirstAvailableSlot();
});

Then('the appointment should be booked successfully', async function (this: CustomWorld) {
  await appointments(this).expectBookingSuccess();
});

When('I open the Appointments section', async function (this: CustomWorld) {
  await appointments(this).openAppointments();
});

Then('I should see the appointment booked for the selected date', async function (this: CustomWorld) {
  if (!this.bookedAppointmentText) {
    throw new Error('No appointment date was stored for the current scenario.');
  }
  await appointments(this).expectAppointmentListed(this.bookedAppointmentText);
});