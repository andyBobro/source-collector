# File Collector

`source-collector` is a utility for collecting the contents of sources from a specified project directory. It offers flexible options for included/excluded directories and output formats. It is both a Node.js module and a CLI tool.

## Features

- Collect the content of all sources in a project directory.
- Flexible options to include or exclude specific directories.
- Output the results in either:
  - **TXT format** with source paths and contents.
  - **JSON format** as a structured object.
- Use it programmatically in Node.js or directly via CLI.

---

## Installation

### From NPM (Global Install)

```bash
npm install -g source-collector
```

## Local Development (Without Publishing to NPM)

- Clone the repository or set up the package locally.
- Compile the TypeScript sources:

```bash
npm run build
```

- Link the package globally:

```bash
npm link
```

## Development

### Prerequisites

- Install Node.js and npm.
- Clone the repository:

```bash
git clone https://github.com/andyBobro/source-collector.git
cd source-collector
```

### Install Dependencies

Install the required dependencies for development:

```bash
npm install
```

### Compile TypeScript

Compile the TypeScript source code into JavaScript:

```bash
npm run build
```
---

## Usage

### CLI Usage

After installation or linking, you can run the source-collector command from your terminal.

#### Basic Command

```bash
source-collector --outputPath output.json
```

### Options

| Option           | Type       | Default           | Required | Description                                        |
| ---------------- | ---------- | ----------------- | -------- | -------------------------------------------------- |
| `--includeDirs`  | `string[]` | `All directories` | No       | List of directories to include (relative to root). |
| `--excludeDirs`  | `string[]` | `node_modules`    | No       | List of directories to exclude (relative to root). |
| `--outputFormat` | `string`   | `json`            | No       | Output format: `txt` or `json`.                    |
| `--outputPath`   | `string`   | None              | Yes      | Path to save the output file.                      |

### Node.js Usage

#### Basic usage

```typescript
import { FileCollector } from 'source-collector';

(async () => {
  const collector = new FileCollector(process.cwd(), {
    includeDirs: ['src', 'test'], // Directories to include
    excludeDirs: ['dist', 'node_modules'], // Directories to exclude
    outputFormat: 'json', // Output format: json or txt
  });

  // Generate the output as JSON or TXT
  const output = await collector.generateOutput();
  console.log(output);

  // Save the output to a source
  await collector.saveOutput('output.json');
})();
```

#### API

| Method                     | Parameters                                                                                     | Returns                              | Description                                                                 |
|----------------------------|-----------------------------------------------------------------------------------------------|--------------------------------------|-----------------------------------------------------------------------------|
| `constructor`              | `rootDir: string` - The root directory to start collecting sources.                              | `FileCollector` instance            | Creates an instance of `FileCollector` with the given root directory and options. |
|                            | `options: { includeDirs?: string[], excludeDirs?: string[], outputFormat?: 'txt' | 'json' }`                            |                                      | Includes options for directory inclusion, exclusion, and output format.    |
| `generateOutput`           | None                                                                                          | `Promise<string>` or `Promise<Record<string, { path: string; content: string }>>` | Collects source content and generates the output in memory as JSON or TXT.   |
| `saveOutput`               | `sourcePath: string` - The path where the output will be saved.                                  | `Promise<void>`                     | Saves the generated output (JSON or TXT) to the specified source path.        |




#### Options

| Option           | Type         | Default           | Required | Description                                         |
|-------------------|--------------|-------------------|----------|-----------------------------------------------------|
| `includeDirs`     | `string[]`   | `All directories` | No       | List of directories to include (relative to root). |
| `excludeDirs`     | `string[]`   | `node_modules`    | No       | List of directories to exclude (relative to root). |
| `outputFormat`    | `string`     | `json`            | No       | Output format: `txt` or `json`.                   |


