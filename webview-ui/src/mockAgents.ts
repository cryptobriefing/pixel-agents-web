/**
 * Mock-agent demo (browser runtime only).
 *
 * Synthetic agentCreated / agentToolStart / agentToolDone messages so the
 * static Vercel deploy isn't an empty office. Replaced in v1 by a real
 * WebSocket client subscribing to the office-bridge daemon.
 *
 * Tree-shaken from VS Code webview runtime — only main.tsx imports this
 * when isBrowserRuntime is true.
 */

const AGENT_NAMES = ['archie', 'john', 'han', 'cb-impact-monitor', 'cb-news-curator'];

const TOOL_CYCLE = [
  { toolName: 'Write', status: 'Writing src/handler.ts' },
  { toolName: 'Read', status: 'Reading config/prod.yaml' },
  { toolName: 'Bash', status: 'Running tests' },
  { toolName: 'Grep', status: 'Searching for callers' },
  { toolName: 'WebFetch', status: 'Fetching cryptobriefing.com/news' },
];

function dispatch(data: unknown): void {
  window.dispatchEvent(new MessageEvent('message', { data }));
}

let nextToolId = 1;

function pickTool(): { toolName: string; status: string } {
  return TOOL_CYCLE[Math.floor(Math.random() * TOOL_CYCLE.length)];
}

function startTool(agentId: number): string {
  const toolId = `mock-${nextToolId.toString()}`;
  nextToolId++;
  const { toolName, status } = pickTool();
  dispatch({
    type: 'agentToolStart',
    id: agentId,
    toolId,
    toolName,
    status,
  });
  return toolId;
}

function endTool(agentId: number, toolId: string): void {
  dispatch({ type: 'agentToolDone', id: agentId, toolId });
}

function spawnAgent(id: number, folderName: string): void {
  dispatch({
    type: 'agentCreated',
    id,
    folderName,
    isTeammate: false,
  });
}

/**
 * Kick off the demo. Spawns AGENT_NAMES.length characters at staggered
 * intervals; each then cycles through random tool activity every few
 * seconds. Returns a teardown function that stops the cycle.
 */
export function startMockAgentDemo(): () => void {
  const timeouts: number[] = [];
  const intervals: number[] = [];

  AGENT_NAMES.forEach((name, idx) => {
    const id = idx + 1;
    const spawnDelay = 800 + idx * 600;

    timeouts.push(
      window.setTimeout(() => {
        spawnAgent(id, name);

        // After spawn, start a tool, end it ~2s later, repeat every 3-6s.
        const tick = (): void => {
          const toolId = startTool(id);
          const dur = 1500 + Math.random() * 2500;
          timeouts.push(
            window.setTimeout(() => {
              endTool(id, toolId);
            }, dur),
          );
        };

        tick();
        const period = 3500 + Math.random() * 2500;
        intervals.push(window.setInterval(tick, period));
      }, spawnDelay),
    );
  });

  return () => {
    timeouts.forEach((t) => {
      window.clearTimeout(t);
    });
    intervals.forEach((i) => {
      window.clearInterval(i);
    });
  };
}
