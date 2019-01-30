declare module 'negotiator/lib/language' {
  export function preferredLanguages(
    accept: string,
    provided: string[],
  ): string[];
}
