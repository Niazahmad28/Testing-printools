class PreAuthPage {
  constructor(page) {
    this.page = page;
  }

  passwordInput() {
    return this.page.getByRole('textbox', { name: 'Password' });
  }

  accessButton() {
    return this.page.getByRole('button', { name: 'Access Page' });
  }

  async enterPassword(password) {
    await this.passwordInput().fill(password);
    await this.accessButton().click();
    await this.page.waitForLoadState('networkidle');
  }
}

module.exports = PreAuthPage;
