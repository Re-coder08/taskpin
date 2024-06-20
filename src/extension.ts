import * as vscode from 'vscode';
import { taskManager } from './taskManager';
import { openTaskPanel } from './webviewUtils';

export function activate(context: vscode.ExtensionContext) {
  console.log('Congratulations, your extension "taskpin" is now active!');

  // Register command to manually trigger taskpin scan
  let disposable = vscode.commands.registerCommand('extension.scanTaskPins', () => {
    taskManager.scanForTaskPins().then(tasks => {
      console.log('Manual scan completed', tasks);
    }).catch(err => {
      console.error('Error during manual scan:', err);
    });
  });

  context.subscriptions.push(disposable);

  // Register command to open Task Management Panel
  let taskPanelDisposable = vscode.commands.registerCommand('extension.openTaskPanel', () => {
    openTaskPanel(context);
  });

  context.subscriptions.push(taskPanelDisposable);

  // Run scan on extension activation
  taskManager.scanForTaskPins().then(tasks => {
    console.log('Automatic scan completed', tasks);
  }).catch(err => {
    console.error('Error during automatic scan:', err);
  });

  // Set up file system watcher to automatically scan on file changes
  const watcher = vscode.workspace.createFileSystemWatcher('**/*.{ts,js,tsx,jsx}');
  watcher.onDidChange(() => {
    taskManager.scanForTaskPins().then(tasks => {
      console.log('Scan on file change completed', tasks);
    }).catch(err => {
      console.error('Error during scan on file change:', err);
    });
  });
  watcher.onDidCreate(() => {
    taskManager.scanForTaskPins().then(tasks => {
      console.log('Scan on file create completed', tasks);
    }).catch(err => {
      console.error('Error during scan on file create:', err);
    });
  });
  watcher.onDidDelete(() => {
    taskManager.scanForTaskPins().then(tasks => {
      console.log('Scan on file delete completed', tasks);
    }).catch(err => {
      console.error('Error during scan on file delete:', err);
    });
  });

  context.subscriptions.push(watcher);
}

export function deactivate() {}
