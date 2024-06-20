import * as vscode from 'vscode';
import { taskManager, Task } from './taskManager';
import * as path from 'path';
import * as fs from 'fs';

export function openTaskPanel(context: vscode.ExtensionContext) {
  const panel = vscode.window.createWebviewPanel(
    'taskpin',
    'TaskPin Manager',
    vscode.ViewColumn.One,
    {
      enableScripts: true,
      retainContextWhenHidden: true // This keeps the state of the webview when it is hidden
    }
  );

  panel.webview.html = getWebviewContent(context.extensionPath, panel.webview);

  panel.webview.onDidReceiveMessage(
    message => {
      switch (message.command) {
        case 'goToTask':
          goToTask(message.task);
          return;
        case 'starTask':
          starTask(message.task);
          return;
        case 'deleteTask':
          deleteTask(message.task);
          return;
      }
    },
    undefined,
    context.subscriptions
  );

  taskManager.scanForTaskPins().then(tasks => {
    panel.webview.postMessage({ command: 'updateTasks', tasks });
  });
}

function getWebviewContent(extensionPath: string, webview: vscode.Webview): string {
  const htmlPath = path.join(extensionPath, 'media', 'taskpinManager.html');
  const cssPath = webview.asWebviewUri(vscode.Uri.file(path.join(extensionPath, 'media', 'taskpinManager.css')));
  const jsPath = webview.asWebviewUri(vscode.Uri.file(path.join(extensionPath, 'media', 'taskpinManager.js')));
  let htmlContent = fs.readFileSync(htmlPath, 'utf8');
  htmlContent = htmlContent.replace('${cssUri}', cssPath.toString());
  htmlContent = htmlContent.replace('${jsUri}', jsPath.toString());
  return htmlContent;
}

function goToTask(task: Task) {
  vscode.workspace.openTextDocument(task.file).then(document => {
    vscode.window.showTextDocument(document, {
      selection: new vscode.Range(new vscode.Position(task.line - 1, 0), new vscode.Position(task.line - 1, 0))
    });
  });
}

function starTask(task: Task) {
  const updatedTask = taskManager.toggleStarred(task.id);
  vscode.window.showInformationMessage(`Task ${updatedTask?.starred ? 'starred' : 'unstarred'}: ${task.title}`);
  // Optionally, update the webview to reflect the change
}

function deleteTask(task: Task) {
  const success = taskManager.deleteTask(task.id);
  if (success) {
    vscode.window.showInformationMessage(`Task deleted: ${task.title}`);
    // Optionally, update the webview to reflect the change
  } else {
    vscode.window.showErrorMessage(`Failed to delete task: ${task.title}`);
  }
}
