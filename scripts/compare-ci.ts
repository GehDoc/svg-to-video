import { execFileSync } from 'child_process';
import { fileURLToPath } from 'url';

interface Step {
  name: string;
  number: number;
  status: string;
  conclusion: string;
  startedAt?: string;
  completedAt?: string;
}

interface Job {
  databaseId: number;
  name: string;
  status: string;
  conclusion: string;
  startedAt?: string;
  completedAt?: string;
  steps: Step[];
}

interface WorkflowRunInfo {
  databaseId: number;
  headSha: string;
  headBranch?: string;
  status: string;
  conclusion: string;
  createdAt: string;
  updatedAt: string;
  jobs?: Job[];
}

function runGh(args: string[]): string {
  try {
    return execFileSync('gh', args, {
      encoding: 'utf-8',
      stdio: ['ignore', 'pipe', 'pipe'],
    }).trim();
  } catch (error: unknown) {
    const err = error as { stderr?: string; message?: string };
    const stderr = err.stderr
      ? String(err.stderr).trim()
      : err.message || String(error);
    throw new Error(`gh ${args.join(' ')} failed: ${stderr}`, { cause: error });
  }
}

function ghJson<T>(args: string[]): T {
  const stdout = runGh(args);
  return JSON.parse(stdout) as T;
}

function parseIso(ts?: string): number {
  if (!ts) return 0;
  return new Date(ts).getTime();
}

function diffSecs(start?: string, end?: string): number {
  if (!start || !end) return 0;
  return Math.max(0, Math.round((parseIso(end) - parseIso(start)) / 1000));
}

function formatDuration(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = Math.round(totalSeconds % 60);
  return `${m}m ${s.toString().padStart(2, '0')}s`;
}

function formatDelta(delta: number, pct: number): string {
  const sign = delta > 0 ? '+' : '';
  return `${sign}${Math.round(delta)}s (${sign}${pct.toFixed(1)}%)`;
}

function getCurrentGitSha(): string {
  try {
    return execFileSync('git', ['rev-parse', 'HEAD'], {
      encoding: 'utf-8',
    }).trim();
  } catch {
    return '';
  }
}

function getCurrentGitBranch(): string {
  try {
    return execFileSync('git', ['rev-parse', '--abbrev-ref', 'HEAD'], {
      encoding: 'utf-8',
    }).trim();
  } catch {
    return '';
  }
}

function getRunDetails(runId: number): WorkflowRunInfo {
  return ghJson<WorkflowRunInfo>([
    'run',
    'view',
    String(runId),
    '--json',
    'databaseId,headSha,headBranch,status,conclusion,createdAt,updatedAt,jobs',
  ]);
}

export function compareCi(options: {
  target?: string;
  baseBranch?: string;
  runCount?: number;
  workflow?: string;
}) {
  const workflow = options.workflow || 'CI';
  const baseBranch = options.baseBranch || 'main';
  const runCount =
    options.runCount && options.runCount > 0 ? options.runCount : 2;

  let targetInput = options.target?.trim();
  if (!targetInput) {
    targetInput = getCurrentGitSha() || getCurrentGitBranch();
  }

  // Handle PR number (e.g. 256 or #256)
  if (/^#?\d+$/.test(targetInput)) {
    const prNumber = targetInput.replace('#', '');
    const prJson = ghJson<{ headRefOid: string; headRefName: string }>([
      'pr',
      'view',
      prNumber,
      '--json',
      'headRefOid,headRefName',
    ]);
    targetInput = prJson.headRefOid || prJson.headRefName;
  }

  // Find target workflow run
  const recentRuns = ghJson<WorkflowRunInfo[]>([
    'run',
    'list',
    '--workflow',
    workflow,
    '--limit',
    '50',
    '--json',
    'databaseId,headSha,headBranch,status,conclusion,createdAt,updatedAt',
  ]);

  // Try matching headSha prefix or headBranch
  const targetRun = recentRuns.find(
    (r) =>
      r.headSha.toLowerCase().startsWith(targetInput.toLowerCase()) ||
      (r.headBranch && r.headBranch.toLowerCase() === targetInput.toLowerCase())
  );

  if (!targetRun) {
    throw new Error(
      `Could not find a workflow run for '${targetInput}' in workflow '${workflow}'. Ensure the CI run has been dispatched or completed.`
    );
  }

  const targetFull = getRunDetails(targetRun.databaseId);

  // Find base branch successful runs
  const baseRunsList = ghJson<WorkflowRunInfo[]>([
    'run',
    'list',
    '--workflow',
    workflow,
    '--branch',
    baseBranch,
    '--limit',
    String(runCount * 3),
    '--json',
    'databaseId,headSha,headBranch,status,conclusion,createdAt,updatedAt',
  ]);

  const baseCompleted = baseRunsList.filter(
    (r) => r.status === 'completed' && r.conclusion === 'success'
  );
  const selectedBaseRuns = baseCompleted
    .slice(0, runCount)
    .map((r) => getRunDetails(r.databaseId));

  if (selectedBaseRuns.length === 0) {
    throw new Error(`No successful runs found on base branch '${baseBranch}'.`);
  }

  // Calculate Overall Durations
  const targetWallClock = diffSecs(targetFull.createdAt, targetFull.updatedAt);
  const baseWallClocks = selectedBaseRuns.map((r) =>
    diffSecs(r.createdAt, r.updatedAt)
  );
  const avgBaseWallClock =
    baseWallClocks.reduce((a, b) => a + b, 0) / baseWallClocks.length;
  const wallClockDelta = targetWallClock - avgBaseWallClock;
  const wallClockPct = (wallClockDelta / avgBaseWallClock) * 100;

  // Collect all unique job names
  const allJobNames = Array.from(
    new Set([
      ...(targetFull.jobs || []).map((j) => j.name),
      ...selectedBaseRuns.flatMap((r) => (r.jobs || []).map((j) => j.name)),
    ])
  ).sort();

  console.log(
    `\n### ⏱️ CI Duration Benchmark: Target vs. ${baseBranch} (Avg of ${selectedBaseRuns.length} runs)\n`
  );
  console.log(
    `- **Target Run**: [#${targetFull.databaseId}](https://github.com/GehDoc/svg-to-video/actions/runs/${targetFull.databaseId}) (${targetFull.headSha.slice(0, 7)}${targetFull.headBranch ? ` - ${targetFull.headBranch}` : ''})`
  );
  console.log(
    `- **Base Runs (${baseBranch})**: ` +
      selectedBaseRuns
        .map(
          (r) =>
            `[#${r.databaseId}](https://github.com/GehDoc/svg-to-video/actions/runs/${r.databaseId}) (${r.headSha.slice(0, 7)})`
        )
        .join(', ') +
      '\n'
  );

  // Table 1: Overall and Per-Job Durations
  const baseHeaders = selectedBaseRuns
    .map((_, idx) => `Base #${idx + 1}`)
    .join(' | ');
  console.log(
    `| Job / Workflow Metric | ${baseHeaders} | Base AVG | Target | Delta |`
  );
  console.log(
    `| :--- | ${selectedBaseRuns.map(() => ':---:').join(' | ')} | :---: | :---: | :---: |`
  );

  const baseClockCells = baseWallClocks
    .map((s) => formatDuration(s))
    .join(' | ');
  console.log(
    `| **Total Workflow Wall-Clock** | ${baseClockCells} | **${formatDuration(avgBaseWallClock)}** | **${formatDuration(targetWallClock)}** | **${formatDelta(wallClockDelta, wallClockPct)}** |`
  );

  for (const jName of allJobNames) {
    const targetJob = (targetFull.jobs || []).find((j) => j.name === jName);
    const targetDur = targetJob
      ? diffSecs(targetJob.startedAt, targetJob.completedAt)
      : 0;

    const baseDurs = selectedBaseRuns.map((r) => {
      const j = (r.jobs || []).find((x) => x.name === jName);
      return j ? diffSecs(j.startedAt, j.completedAt) : 0;
    });

    const avgBaseDur = baseDurs.reduce((a, b) => a + b, 0) / baseDurs.length;
    const delta = targetDur - avgBaseDur;
    const pct = avgBaseDur > 0 ? (delta / avgBaseDur) * 100 : 0;

    const baseCells = baseDurs.map((d) => `${d}s`).join(' | ');
    console.log(
      `| ${jName} | ${baseCells} | ${Math.round(avgBaseDur)}s | ${targetDur}s | ${formatDelta(delta, pct)} |`
    );
  }

  // Table 2: Step-Level Breakdown (Setup & Docker Build steps)
  console.log('\n#### 🔍 Key Steps Breakdown (Setup & Docker Build)\n');
  console.log(`| Job (Step Name) | Base AVG | Target | Delta |`);
  console.log(`| :--- | :---: | :---: | :---: |`);

  for (const jName of allJobNames) {
    const targetJob = (targetFull.jobs || []).find((j) => j.name === jName);
    const stepsToCheck = ['Setup', 'Build and load Docker image'];

    for (const stepName of stepsToCheck) {
      const targetStep = targetJob?.steps?.find((s) => s.name === stepName);
      const baseStepDurs = selectedBaseRuns
        .map((r) => {
          const j = (r.jobs || []).find((x) => x.name === jName);
          const s = j?.steps?.find((step) => step.name === stepName);
          return s ? diffSecs(s.startedAt, s.completedAt) : undefined;
        })
        .filter((d): d is number => typeof d === 'number');

      if (!targetStep && baseStepDurs.length === 0) continue;

      const targetStepDur = targetStep
        ? diffSecs(targetStep.startedAt, targetStep.completedAt)
        : 0;
      const avgBaseStepDur =
        baseStepDurs.length > 0
          ? baseStepDurs.reduce((a, b) => a + b, 0) / baseStepDurs.length
          : 0;
      const delta = targetStepDur - avgBaseStepDur;
      const pct = avgBaseStepDur > 0 ? (delta / avgBaseStepDur) * 100 : 0;

      console.log(
        `| ${jName} (${stepName}) | ${Math.round(avgBaseStepDur)}s | ${targetStepDur}s | ${formatDelta(delta, pct)} |`
      );
    }
  }
  console.log('');
}

// CLI entry point
const isMain =
  Boolean(process.argv[1]) &&
  (fileURLToPath(import.meta.url) === process.argv[1] ||
    process.argv[1].endsWith('compare-ci.ts'));

if (isMain) {
  const args = process.argv.slice(2);
  let target: string | undefined;
  let baseBranch = 'main';
  let runCount = 2;
  let workflow = 'CI';

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--base' || arg === '-b') {
      baseBranch = args[++i];
    } else if (arg === '--runs' || arg === '-r') {
      runCount = parseInt(args[++i], 10);
    } else if (arg === '--workflow' || arg === '-w') {
      workflow = args[++i];
    } else if (!arg.startsWith('-') && !target) {
      target = arg;
    }
  }

  try {
    compareCi({ target, baseBranch, runCount, workflow });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`Error: ${message}`);
    process.exit(1);
  }
}
