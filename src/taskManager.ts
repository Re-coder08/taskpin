import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export interface Task {
  id: string;
  file: string;
  line: number;
  task: string;
  title: string;
  priority: 'L' | 'M' | 'H';  // Changed to non-optional and ensured default
  createdDate: Date;
  tags: string[];
  starred: boolean;
  isComplete: boolean;
  isInProgress: boolean;
}

export class TaskManager {
  private tasks: Task[] = [];
  private readonly tasksFilePath: string;

  constructor() {
    const rootPath = vscode.workspace.rootPath;
    if (!rootPath) {
      throw new Error('No workspace folder found.');
    }
    this.tasksFilePath = path.join(rootPath, 'taskpins.txt');
    this.loadTasksFromFile();
  }

  private loadTasksFromFile() {
    if (fs.existsSync(this.tasksFilePath)) {
      const fileContent = fs.readFileSync(this.tasksFilePath, 'utf8');
      const lines = fileContent.split('\n');
      this.tasks = lines.map(line => {
        const parts = line.split(',');
        return {
          id: parts[0],
          file: parts[1],
          line: parseInt(parts[2]),
          task: parts[3],
          title: parts[4],
          priority: parts[5] as 'L' | 'M' | 'H',
          createdDate: new Date(parts[6]),
          tags: parts[7] ? parts[7].split(' ') : [],
          starred: parts[8] === 'true',
          isComplete: parts[9] === 'true',
          isInProgress: parts[10] === 'true'
        };
      });
    }
  }

  private saveTasksToFile() {
    const fileContent = this.tasks.map(task => [
      task.id,
      task.file,
      task.line,
      task.task,
      task.title,
      task.priority,
      task.createdDate.toISOString(),
      task.tags.join(' '),
      task.starred,
      task.isComplete,
      task.isInProgress
    ].join(',')).join('\n');
    fs.writeFileSync(this.tasksFilePath, fileContent);
  }

  async scanForTaskPins(): Promise<Task[]> {
    const rootPath = vscode.workspace.rootPath;
    if (!rootPath) {
      vscode.window.showErrorMessage('No workspace folder found.');
      return [];
    }

    console.log('Scanning for task pins in workspace:', rootPath);

    const files = await vscode.workspace.findFiles('**/*.{ts,js,tsx,jsx}');
    console.log('Files found:', files);

    const tasks: Task[] = [];

    for (const file of files) {
      console.log('Processing file:', file.fsPath);
      const document = await vscode.workspace.openTextDocument(file);
      const text = document.getText();
      const lines = text.split('\n');

      lines.forEach((line, index) => {
        const match = line.match(/\/\/\s*taskpin\s*:\s*(.*)/i);
        if (match) {
          const taskDescription = match[1].trim();
          const task = this.parseTask(taskDescription, file.fsPath, index + 1);
          if (task) {
            tasks.push(task);
          }
        }
      });
    }

    console.log('Tasks found:', tasks);

    this.tasks = tasks;
    this.saveTasksToFile();
    return tasks;
  }

  private parseTask(description: string, file: string, line: number): Task | null {
    const parts = description.split('|');
    if (parts.length < 1) {
      return null;
    }

    const title = parts[0].trim();
    let priority: 'L' | 'M' | 'H' = 'L';  // Set default priority to 'L'
    let tags: string[] = [];
    let starred = false;
    let isComplete = false;
    let isInProgress = false;

    parts.slice(1).forEach(part => {
      const trimmedPart = part.trim();
      if (['L', 'M', 'H'].includes(trimmedPart)) {
        priority = trimmedPart as 'L' | 'M' | 'H';
      } else if (trimmedPart.startsWith('#')) {
        tags.push(trimmedPart.substring(1));
      } else if (trimmedPart.toLowerCase() === 'starred') {
        starred = true;
      } else if (trimmedPart.toUpperCase() === 'C') {
        isComplete = true;
      } else if (trimmedPart.toUpperCase() === 'IP') {
        isInProgress = true;
      }
    });

    const task: Task = {
      id: this.generateId(),
      file,
      line,
      task: description,
      title,
      priority,
      createdDate: new Date(),
      tags,
      starred,
      isComplete,
      isInProgress
    };

    return task;
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  toggleStarred(id: string): Task | undefined {
    const task = this.tasks.find(t => t.id === id);
    if (task) {
      task.starred = !task.starred;
      this.saveTasksToFile();
    }
    return task;
  }

  updateTaskStatus(id: string, status: 'C' | 'IP'): Task | undefined {
    const task = this.tasks.find(t => t.id === id);
    if (task) {
      task.isComplete = status === 'C';
      task.isInProgress = status === 'IP';
      this.saveTasksToFile();
    }
    return task;
  }
}

export const taskManager = new TaskManager();
