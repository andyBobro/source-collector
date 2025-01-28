#!/usr/bin/env node
import { FileCollector } from './fileCollector';
import path from 'path';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

(async () => {
  try {
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
        description: 'Path to save the output file',
        demandOption: true, // Make this option required
      })
      .check((argv) => {
        if (!argv.outputPath) {
          throw new Error('`--outputPath` is required to specify the output file location.');
        }
        if (argv.includeDirs && !Array.isArray(argv.includeDirs)) {
          throw new Error('`--includeDirs` must be an array of strings.');
        }
        if (argv.excludeDirs && !Array.isArray(argv.excludeDirs)) {
          throw new Error('`--excludeDirs` must be an array of strings.');
        }
        return true;
      })
      .help()
      .argv;
    const collector = new FileCollector(rootDir, {
      includeDirs: argv.includeDirs as string[],
      excludeDirs: argv.excludeDirs as string[],
      outputFormat: argv.outputFormat as 'txt' | 'json',
    });
    await collector.saveOutput(path.resolve(argv.outputPath as string));
    console.log(`File collection completed! Output saved to ${argv.outputPath}`);
  } catch (error: any) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
})();
