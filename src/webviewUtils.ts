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
        case 'updateStatus':
          updateStatus(message.task, message.status, panel);
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

function updateStatus(task: Task, status: 'C' | 'IP', panel: vscode.WebviewPanel) {
  console.log(`Updating task status for task: ${task.title}, new status: ${status === 'C' ? 'Completed' : 'In Progress'}`);

  vscode.workspace.openTextDocument(task.file).then(document => {
    vscode.window.showTextDocument(document).then(editor => {
      const line = editor.document.lineAt(task.line - 1);
      let updatedComment = line.text.replace(/\s*[C|IP]$/, '').trim(); // Remove existing status tags if present
      updatedComment += ` | ${status}`;

      editor.edit(editBuilder => {
        editBuilder.replace(line.range, updatedComment);
      }).then(() => {
        vscode.window.showInformationMessage(`Task status updated to ${status === 'C' ? 'Completed' : 'In Progress'}: ${task.title}`);
        const updatedTask = taskManager.updateTaskStatus(task.id, status);
        taskManager.scanForTaskPins().then(tasks => {
          panel.webview.postMessage({ command: 'updateTasks', tasks });
        });
      });
    });
  });
}
