import { DockerUiPage } from './app.po';

describe('docker-ui App', function() {
  let page: DockerUiPage;

  beforeEach(() => {
    page = new DockerUiPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
