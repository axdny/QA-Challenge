import { After, Before, setDefaultTimeout, Status } from '@cucumber/cucumber';
import { chromium } from '@playwright/test';
import { environment } from '../config/environment';
import { CustomWorld } from './world';

setDefaultTimeout(30000);

Before(async function (this: CustomWorld) {
  console.log('before: launching browser');
  this.browser = await chromium.launch({ headless: environment.headless });
  console.log('before: browser launched');

  console.log('before: creating context');
  this.context = await this.browser.newContext({ baseURL: environment.baseUrl });
  console.log('before: context created');

  console.log('before: creating page');
  this.page = await this.context.newPage();
  console.log('before: page created');

  this.page.setDefaultTimeout(10000);
});

After(async function (this: CustomWorld, scenario) {
  if (scenario.result?.status === Status.FAILED && this.page) {
    await this.page.screenshot({
      path: `test-results/${scenario.pickle.name.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}.png`,
      fullPage: true
    });
  }
  await this.context?.close();
  await this.browser?.close();
});