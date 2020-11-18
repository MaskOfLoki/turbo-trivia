import { MainboardPreviewPage, MobilePreviewMode, MobilePreviewPage } from '../common';

const queryParams = new URLSearchParams(window.location.search);

export function getQueryParam(name: string) {
  return queryParams.get(name);
}

export function isPreview(): boolean {
  return queryParams.has('previewPage') || queryParams.has('previewMode');
}

export function getPreviewPage(): MobilePreviewPage {
  return parseInt(queryParams.get('previewPage'));
}

export function getMainboardPreviewPage(): MainboardPreviewPage {
  return parseInt(queryParams.get('previewPage'));
}

export function getPreviewMode(): MobilePreviewMode {
  return parseInt(queryParams.get('previewMode'));
}
