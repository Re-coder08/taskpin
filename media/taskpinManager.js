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
    taskText.textContent = `${task.title} (${task.file.split('/').pop()}: ${task.line}) - ${task.priority}`;

    const actions = document.createElement('div');
    actions.className = 'task-actions';

    const goButton = document.createElement('button');
    goButton.textContent = '🔗';
    goButton.onclick = () => vscode.postMessage({ command: 'goToTask', task });

    const starButton = document.createElement('button');
    starButton.innerHTML = task.starred ? '⭐' : '☆';
    starButton.style.color = task.starred ? 'gold' : 'grey';
    starButton.onclick = () => {
      vscode.postMessage({ command: 'starTask', task });
      // Optimistically update the UI
      task.starred = !task.starred;
      starButton.innerHTML = task.starred ? '⭐' : '☆';
      starButton.style.color = task.starred ? 'gold' : 'grey';
    };

    const completeButton = document.createElement('button');
    completeButton.textContent = 'Complete';
    completeButton.style.color = task.isComplete ? 'green' : 'black';
    completeButton.onclick = () => {
      console.log(`Complete button clicked for task: ${task.title}`);
      if (!task.isComplete) {
        task.isComplete = true;
        task.isInProgress = false;
        vscode.postMessage({ command: 'updateStatus', task, status: 'C' });
      }
    };

    const inProgressButton = document.createElement('button');
    inProgressButton.textContent = 'In Progress';
    inProgressButton.style.color = task.isInProgress ? 'blue' : 'black';
    inProgressButton.onclick = () => {
      console.log(`In Progress button clicked for task: ${task.title}`);
      if (!task.isInProgress) {
        task.isInProgress = true;
        task.isComplete = false;
        vscode.postMessage({ command: 'updateStatus', task, status: 'IP' });
      }
    };

    actions.appendChild(goButton);
    actions.appendChild(starButton);
    actions.appendChild(completeButton);
    actions.appendChild(inProgressButton);

    li.appendChild(taskText);
    li.appendChild(actions);

    taskList.appendChild(li);
  });
}
