import * as vscode from 'vscode';
import * as path from 'path';

export function getWebviewContent(extensionUri: vscode.Uri, webview: vscode.Webview): string {
  const scriptUri = webview.asWebviewUri(
    vscode.Uri.joinPath(extensionUri, 'media', 'taskpinManager.js')
  );
  const styleUri = webview.asWebviewUri(
    vscode.Uri.joinPath(extensionUri, 'media', 'taskpinManager.css')
  );

  return `<!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>TaskPin Manager</title>
      <link rel="stylesheet" href="${styleUri}">
    </head>
    <body>
      <header>
        <h1>TaskPin Manager</h1>
      </header>
      <section id="task-list" class="sortable-list">
        <!-- Task items will be dynamically inserted here -->
      </section>
      <script src="${scriptUri}"></script>
    </body>
    </html>`;
}
