// Lightweight tracing wrapper — integrate with OpenTelemetry or other APM later
export function traceSpan<T>(name: string, fn: () => Promise<T>): Promise<T> {
  const start = Date.now();
  return fn().finally(() => {
    const dur = Date.now() - start;
    // Hook point for APM: send { name, duration }
    console.debug(`[trace] ${name} ${dur}ms`);
  });
}
