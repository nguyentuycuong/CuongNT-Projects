// ====================================================
// More Templates: https://www.ebenmonney.com/templates
// Email: support@ebenmonney.com
// ====================================================

import { AppPage } from './app.po';

describe('oHoob App', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  });

  it('should display application title: oHoob', () => {
    page.navigateTo();
    expect(page.getAppTitle()).toEqual('oHoob');
  });
});
