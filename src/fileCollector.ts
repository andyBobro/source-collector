import fs from 'fs';
import path from 'path';

export interface Options {
  includeDirs?: string[];
  excludeDirs?: string[];
  outputFormat?: 'txt' | 'json';
}

export class FileCollector {
  private rootDir: string;
  private includeDirs: string[];
  private excludeDirs: string[];
  private outputFormat: 'txt' | 'json';

  constructor(rootDir: string, options: Options = {}) {
    this.rootDir = rootDir;
    this.includeDirs = options.includeDirs || [];
    this.excludeDirs = ['node_modules', '.git', ...options.excludeDirs || []];
    this.outputFormat = options.outputFormat || 'json';
  }

  private async collectFiles(dir: string): Promise<string[]> {
    const files: string[] = [];
    const entries = await fs.promises.readdir(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        const relativePath = path.relative(this.rootDir, fullPath);
        if (
          !this.excludeDirs.includes(relativePath)
        ) {
          files.push(...(await this.collectFiles(fullPath)));
        }
      } else {
        files.push(fullPath);
      }
    }
    return files;
  }

  private async generateTxt(files: string[]): Promise<string> {
    return files
      .map((file) => {
        const content = fs.readFileSync(file, 'utf-8');
        const relativePath = path.relative(this.rootDir, file);
        
        return `__FILE_PATH__\n${relativePath}\n__FILE_CONTENT__\n${content}\n__END_OF_FILE__`;
      })
      .join('\n');
  }

  private async generateJson(files: string[]): Promise<Record<string, { path: string; content: string }>> {
    const output: Record<string, { path: string; content: string }> = {};
    for (const file of files) {
      const content = fs.readFileSync(file, 'utf-8');
      
      const relativePath = path.relative(this.rootDir, file);
      output[relativePath] = { path: relativePath, content };
    }
    return output;
  }

  public async generateOutput(): Promise<string | Record<string, any>> {
    const files = await this.collectFiles(this.rootDir);
    if (this.outputFormat === 'txt') {
      return this.generateTxt(files);
    } else {
      return this.generateJson(files);
    }
  }

  public async saveOutput(outputPath: string): Promise<void> {
    const output = await this.generateOutput();
    
    if (this.outputFormat === 'txt') {
      fs.writeFileSync(outputPath, output as string, 'utf-8');
    } else {
      fs.writeFileSync(outputPath, JSON.stringify(output, null, 2), 'utf-8');
    }
  }
}
