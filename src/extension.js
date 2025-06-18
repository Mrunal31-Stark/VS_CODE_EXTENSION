"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = require("vscode");
const cp = require("child_process");
const path = require("path");
/**
 * Class responsible for analyzing Python functions in selected folders.
 */
class PythonFunctionAnalyzer {
    constructor(context) {
        this.context = context;
        this.registerCommands();
    }
    /**
     * Registers all extension commands.
     */
    registerCommands() {
        const disposable = vscode.commands.registerCommand('extension.analyzePythonFunctions', () => this.handleAnalyzeCommand());
        this.context.subscriptions.push(disposable);
    }
    /**
     * Handles the execution flow when the command is triggered.
     */
    async handleAnalyzeCommand() {
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
    runPythonScript(scriptPath, folderPath) {
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
            }
            catch (err) {
                console.error("Parsing Error:", err);
                vscode.window.showErrorMessage("Failed to parse Python output.");
            }
        });
    }
    /**
     * Renders the results into a WebView panel.
     */
    showResultsInWebview(result) {
        const panel = vscode.window.createWebviewPanel('functionAnalyzer', 'Function Count Analysis', vscode.ViewColumn.One, {});
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
function activate(context) {
    new PythonFunctionAnalyzer(context);
}
exports.activate = activate;
/**
 * This method is called when the extension is deactivated.
 */
function deactivate() {
    // Cleanup if needed
}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map