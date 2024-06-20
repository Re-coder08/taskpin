import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export interface Task {
  id: string;
  file: string;
  line: number;
  task: string;
  title: string;
  priority?: 'L' | 'M' | 'H';
  status: 'B' | 'IP' | 'C';
  createdDate: Date;
  tags: string[];
  starred: boolean;
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
          status: parts[6] as 'B' | 'IP' | 'C',
          createdDate: new Date(parts[7]),
          tags: parts[8] ? parts[8].split(' ') : [],
          starred: parts[9] === 'true',
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
      task.status,
      task.createdDate.toISOString(),
      task.tags.join(' '),
      task.starred,
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
    const parts = description.split(' ');
    if (parts.length < 1) {
      return null;
    }

    const title = parts[0];
    let priority: 'L' | 'M' | 'H' | undefined;
    let tags: string[] = [];
    let starred = false;

    parts.slice(1).forEach(part => {
      if (['L', 'M', 'H'].includes(part)) {
        priority = part as 'L' | 'M' | 'H';
      } else if (part.startsWith('#')) {
        tags.push(part.substring(1));
      } else if (part.toLowerCase() === 'starred') {
        starred = true;
      }
    });

    const task: Task = {
      id: this.generateId(),
      file,
      line,
      task: description,
      title,
      priority,
      status: 'B', // Default status to Backlog
      createdDate: new Date(),
      tags,
      starred,
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

  deleteTask(id: string): boolean {
    const index = this.tasks.findIndex(t => t.id === id);
    if (index !== -1) {
      this.tasks.splice(index, 1);
      this.saveTasksToFile();
      return true;
    }
    return false;
  }
}

export const taskManager = new TaskManager();
