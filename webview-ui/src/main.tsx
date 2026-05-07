import './index.css';

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import App from './App.tsx';
import { isBrowserRuntime } from './runtime';

async function main() {
  if (isBrowserRuntime) {
    const { initBrowserMock } = await import('./browserMock.js');
    await initBrowserMock();
  }
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
  if (isBrowserRuntime) {
    const onLayoutLoaded = (e: MessageEvent): void => {
      const data = e.data as { type?: string } | null;
      if (data?.type !== 'layoutLoaded') return;
      window.removeEventListener('message', onLayoutLoaded);
      setTimeout(() => {
        void import('./mockAgents.js').then(({ startMockAgentDemo }) => {
          console.log('[mockAgents] starting demo');
          startMockAgentDemo();
        });
      }, 800);
    };
    window.addEventListener('message', onLayoutLoaded);
  }
}

main().catch(console.error);
