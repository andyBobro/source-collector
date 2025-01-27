#!/usr/bin/env node
import { FileCollector } from './fileCollector';
import path from 'path';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';



(async () => {
  const rootDir = process.cwd();
  const argv = await yargs(hideBin(process.argv))
    .option('includeDirs', {
      type: 'array',
      description: 'Directories to include',
    })
    .option('excludeDirs', {
      type: 'array',
      default: ['node_modules'],
      description: 'Directories to exclude',
    })
    .option('outputFormat', {
      type: 'string',
      choices: ['txt', 'json'],
      default: 'json',
      description: 'Output file format',
    })
    .option('outputPath', {
      type: 'string',
      default: 'output.txt',
      description: 'Path to save the output file',
    })
    .demandCommand(0)
    .help()
    .argv;

  console.log(argv);
    
  const collector = new FileCollector(rootDir, {
    includeDirs: argv.includeDirs as string[],
    excludeDirs: argv.excludeDirs as string[],
    outputFormat: argv.outputFormat as 'txt' | 'json',
  });
  await collector.saveOutput(path.resolve(argv.outputPath as string));
})();
