const vscode = acquireVsCodeApi();

window.addEventListener('message', event => {
  const message = event.data;
  switch (message.command) {
    case 'updateTasks':
      updateTaskList(message.tasks);
      break;
  }
});

function updateTaskList(tasks) {
  const taskList = document.getElementById('task-list');
  taskList.innerHTML = '';
  tasks.forEach(task => {
    const li = document.createElement('li');
    li.className = 'task-item';

    const taskText = document.createElement('p');
    taskText.textContent = `Title: ${task.title}, Priority: ${task.priority}, Tags: ${task.tags.join(', ')}, Starred: ${task.starred}`;

    const actions = document.createElement('div');
    actions.className = 'task-actions';

    const goButton = document.createElement('button');
    goButton.textContent = 'Go';
    goButton.onclick = () => vscode.postMessage({ command: 'goToTask', task });

    const starButton = document.createElement('button');
    starButton.textContent = 'Star';
    starButton.onclick = () => vscode.postMessage({ command: 'starTask', task });

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.onclick = () => vscode.postMessage({ command: 'deleteTask', task });

    actions.appendChild(goButton);
    actions.appendChild(starButton);
    actions.appendChild(deleteButton);

    li.appendChild(taskText);
    li.appendChild(actions);

    taskList.appendChild(li);
  });
}
