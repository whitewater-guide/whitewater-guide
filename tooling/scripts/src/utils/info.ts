import chalk from 'chalk';

export const info = (text: string) => {
  console.info(`${chalk.bgMagenta.black('[WW-META]')} ${text}`);
};
