import * as vscode from 'vscode';
import { taskManager } from './taskManager';
import { getWebviewContent } from './webviewUtils';

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand('taskpin.openTaskPanel', () => {
      const column = vscode.window.activeTextEditor ? vscode.window.activeTextEditor.viewColumn : undefined;
      const panel = vscode.window.createWebviewPanel(
        'taskpin',
        'TaskPin Manager',
        column || vscode.ViewColumn.One,
        {
          enableScripts: true,
          retainContextWhenHidden: true
        }
      );

      panel.webview.html = getWebviewContent(context.extensionUri, panel.webview);

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
            case 'removeTask':
              removeTask(message.task, panel);
              return;
            case 'reorderTasks':
              taskManager.reorderTasks(message.order);
              return;
          }
        },
        undefined,
        context.subscriptions
      );

      taskManager.scanForTaskPins().then(tasks => {
        panel.webview.postMessage({ command: 'updateTasks', tasks });
      });
    })
  );
}

function goToTask(task: any) {
  vscode.workspace.openTextDocument(task.file).then(document => {
    vscode.window.showTextDocument(document, {
      selection: new vscode.Range(new vscode.Position(task.line - 1, 0), new vscode.Position(task.line - 1, 0))
    });
  });
}

function starTask(task: any) {
  const updatedTask = taskManager.toggleStarred(task.id);
  vscode.window.showInformationMessage(`Task ${updatedTask?.starred ? 'starred' : 'unstarred'}: ${task.title}`);
}

function updateStatus(task: any, status: 'C' | 'IP', panel: vscode.WebviewPanel) {
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
        taskManager.updateTaskStatus(task.id, status);
        taskManager.scanForTaskPins().then(tasks => {
          panel.webview.postMessage({ command: 'updateTasks', tasks });
        });
      });
    });
  });
}

function removeTask(task: any, panel: vscode.WebviewPanel) {
  console.log(`Removing task: ${task.title}`);

  taskManager.removeTask(task).then(() => {
    taskManager.scanForTaskPins().then(tasks => {
      panel.webview.postMessage({ command: 'updateTasks', tasks });
    });
  });
}
