import type { Page } from '@playwright/test';
import { environment } from '../config/environment';

export class LoginPage {
  constructor(private readonly page: Page) {}

  async goto(): Promise<void> {
    await this.page.goto('/login');
  }

  async signIn(): Promise<void> {
    await this.page.getByLabel('Email').fill(environment.email);
    await this.page.getByLabel('Password').fill(environment.password);
    await this.page.getByRole('button', { name: /sign in/i }).click();
    await this.page.waitForLoadState('networkidle');
  }
}