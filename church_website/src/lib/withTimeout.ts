export async function withTimeout<T>(promise: Promise<T>, ms: number, message: string): Promise<T> {
  return await Promise.race([
    promise,
    new Promise<never>((_, reject) => {
      globalThis.setTimeout(() => reject(new Error(message)), ms)
    }),
  ])
}
