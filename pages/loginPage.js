const { expect } = require('@playwright/test');

class LoginPage {
  constructor(page) {
    this.page = page;
  }

  emailInput() {
    return this.page.getByRole('textbox', { name: 'Email Address' });
  }

  passwordInput() {
    return this.page.getByRole('textbox', { name: 'Password' });
  }

  submitButton() {
    return this.page.getByRole('button', { name: 'LOG IN' });
  }

  dashboardLink() {
    return this.page.getByRole('link', { name: 'Go to Dashboard' });
  }

  async goToDashboard() {
    await this.dashboardLink().click();
    await this.page.waitForLoadState('networkidle');
  }

  async login(username, password) {
    await this.emailInput().fill(username);
    await this.passwordInput().fill(password);
    await this.submitButton().click();
  }

  async isLoginFormVisible() {
    return await this.emailInput().isVisible();
  }
}

module.exports = LoginPage;
