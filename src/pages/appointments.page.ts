import { expect, type Locator, type Page } from '@playwright/test';

export class AppointmentsPage {
  constructor(private readonly page: Page) {}

  private async firstVisible(locators: Locator[]): Promise<Locator> {
    for (const locator of locators) {
      if (await locator.first().isVisible().catch(() => false)) return locator.first();
    }
    throw new Error('Could not find a visible appointment control.');
  }

  async expectAuthenticatedUser(email: string): Promise<void> {
    await expect(this.page).toHaveURL(/\/dashboard$/);
    await this.page.locator('a[href="/profile"]').click();
    await this.page.waitForURL(/\/profile$/);
    await expect(this.page.getByText(email, { exact: true })).toBeVisible();
  }

  async selectFirstDoctor(): Promise<void> {
    await this.page.getByRole('link', { name: 'Doctors', exact: true }).click();
    await this.page.waitForURL(/\/doctors$/);
    await expect(this.page.locator('a[href^="/doctors/"]').first()).toBeVisible();
    await this.page.locator('a[href^="/doctors/"]').first().click();
    await this.page.waitForURL(/\/doctors\/\d+$/);
  }

  async bookFirstAvailableSlot(): Promise<string> {
    await this.page.getByRole('link', { name: /Book Appointment/i }).click();
    await this.page.waitForURL(/\/appointments\/new$/);

    await this.page.locator('#doctor_id').selectOption({ index: 1 });
    const date = new Date();
    date.setDate(date.getDate() + 1);
    const tomorrow = [date.getFullYear(), date.getMonth() + 1, date.getDate()]
      .map((part) => String(part).padStart(2, '0'))
      .join('-');
    await this.page.locator('#appointment_date').fill(tomorrow);

    const timeSlot = this.page.locator('#time_slot');
    await expect(timeSlot.locator('option')).not.toHaveCount(1);
    await timeSlot.selectOption({ index: 1 });
    const time = await timeSlot.locator('option:checked').textContent();
    if (!time) throw new Error('The selected appointment time was not available.');
    await this.page.getByRole('button', { name: /Book Appointment/i }).click();

    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} • ${time.trim()}`;
  }

  async expectBookingSuccess(): Promise<void> {
    await expect(this.page.getByText('Appointment Booked!', { exact: true })).toBeVisible();
    await expect(this.page.getByText('Your appointment has been scheduled successfully.', { exact: true })).toBeVisible();
  }

  async openAppointments(): Promise<void> {
    await this.firstVisible([
      this.page.getByRole('link', { name: /View Appointments/i }),
      this.page.getByRole('link', { name: /appointments/i }),
      this.page.getByRole('button', { name: /appointments/i }),
      this.page.getByText('Appointments', { exact: true })
    ]).then((control) => control.click());
    await this.page.waitForLoadState('networkidle').catch(() => undefined);
  }

  async expectAppointmentListed(appointmentText: string): Promise<void> {
    await expect(this.page.getByText('Loading appointments...', { exact: true })).toBeHidden().catch(() => undefined);
    const [dateText, timeText] = appointmentText.split(' • ');
    const [day, month, year] = dateText.split('/');
    const escapedTime = timeText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const appointmentPattern = new RegExp(
      `0?${day}/0?${month}/${year}\\s*•\\s*${escapedTime}`
    );
    await expect(this.page.getByText(appointmentPattern)).toBeVisible();
  }
}