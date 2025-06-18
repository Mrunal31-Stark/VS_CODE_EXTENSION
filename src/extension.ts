import * as vscode from 'vscode';
import * as cp from 'child_process';
import * as path from 'path';

/**
 * Class responsible for analyzing Python functions in selected folders.
 */
class PythonFunctionAnalyzer {
  private context: vscode.ExtensionContext;

  constructor(context: vscode.ExtensionContext) {
    this.context = context;
    this.registerCommands();
  }

  /**
   * Registers all extension commands.
   */
  private registerCommands() {
    const disposable = vscode.commands.registerCommand(
      'extension.analyzePythonFunctions',
      () => this.handleAnalyzeCommand()
    );

    this.context.subscriptions.push(disposable);
  }

  /**
   * Handles the execution flow when the command is triggered.
   */
  private async handleAnalyzeCommand() {
    const folderUri = await vscode.window.showOpenDialog({
      canSelectFolders: true,
      openLabel: "Select Folder to Analyze"
    });

    if (!folderUri || folderUri.length === 0) {
      vscode.window.showWarningMessage("No folder selected.");
      return;
    }

    const folderPath = folderUri[0].fsPath;
    const scriptPath = this.context.asAbsolutePath(path.join('pythonFiles', 'analyze_functions.py'));

    this.runPythonScript(scriptPath, folderPath);
  }

  /**
   * Runs the Python script and processes its output.
   */
  private runPythonScript(scriptPath: string, folderPath: string) {
    const process = cp.spawn('python', [scriptPath, folderPath]);

    let output = '';
    let errorOutput = '';

    process.stdout.on('data', (chunk) => output += chunk);
    process.stderr.on('data', (err) => errorOutput += err);

    process.on('close', () => {
      if (errorOutput) {
        console.error("Python Error:", errorOutput);
        vscode.window.showErrorMessage("Python script failed. Check the console.");
        return;
      }

      try {
        const result = JSON.parse(output.trim());
        this.showResultsInWebview(result);
      } catch (err) {
        console.error("Parsing Error:", err);
        vscode.window.showErrorMessage("Failed to parse Python output.");
      }
    });
  }

  /**
   * Renders the results into a WebView panel.
   */
  private showResultsInWebview(result: Record<string, number>) {
    const panel = vscode.window.createWebviewPanel(
      'functionAnalyzer',
      'Function Count Analysis',
      vscode.ViewColumn.One,
      {}
    );

    const htmlList = Object.entries(result)
      .map(([file, count]) => `<li><code>${file}</code>: ${count} function${count !== 1 ? 's' : ''}</li>`)
      .join('');

    panel.webview.html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <style>
          body { font-family: sans-serif; padding: 1rem; }
          h2 { color: #007acc; }
          ul { padding-left: 1.2rem; }
          li { margin-bottom: 4px; }
        </style>
      </head>
      <body>
        <h2>📊 Function Count Analysis</h2>
        <ul>${htmlList}</ul>
      </body>
      </html>
    `;
  }
}

/**
 * This method is called when the extension is activated.
 */
export function activate(context: vscode.ExtensionContext) {
  new PythonFunctionAnalyzer(context);
}

/**
 * This method is called when the extension is deactivated.
 */
export function deactivate() {
  // Cleanup if needed
}
