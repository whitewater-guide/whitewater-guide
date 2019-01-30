declare module 'cron-parser' {
  interface CronParser {
    parseExpression: (value: any) => void;
  }

  const cronParser: CronParser;

  export default cronParser;
}
