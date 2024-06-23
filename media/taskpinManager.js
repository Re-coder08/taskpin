const vscode = acquireVsCodeApi();

window.addEventListener('message', event => {
    const message = event.data;
    console.log('Webview: message received', message);
    if (message.command === 'updateTasks') {
        updateTaskList(message.tasks);
    }
});

function updateTaskList(tasks) {
    console.log('Webview: updating task list', tasks);
    const taskList = document.getElementById('task-list');
    taskList.innerHTML = '';

    tasks.forEach(task => {
        const taskItem = document.createElement('div');
        taskItem.className = 'task-item';
        taskItem.setAttribute('data-id', task.id);

        const taskText = document.createElement('p');
        taskText.textContent = `${task.title} (${task.file.split('/').pop()}: ${task.line}) - ${task.priority}`;

        const actions = document.createElement('div');
        actions.className = 'task-actions';

        const goButton = document.createElement('button');
        goButton.textContent = 'Go';
        goButton.onclick = () => vscode.postMessage({ command: 'goToTask', task });

        const starButton = document.createElement('button');
        starButton.innerHTML = task.starred ? '⭐' : '☆';
        starButton.className = task.starred ? 'starred' : '';
        starButton.onclick = () => {
            vscode.postMessage({ command: 'starTask', task });
            task.starred = !task.starred;
            starButton.innerHTML = task.starred ? '⭐' : '☆';
            starButton.className = task.starred ? 'starred' : '';
        };

        const completeButton = document.createElement('button');
        completeButton.textContent = 'Complete';
        completeButton.className = task.isComplete ? 'complete' : '';
        completeButton.onclick = () => {
            if (!task.isComplete) {
                task.isComplete = true;
                task.isInProgress = false;
                vscode.postMessage({ command: 'updateStatus', task, status: 'C' });
            }
        };

        const inProgressButton = document.createElement('button');
        inProgressButton.textContent = 'In Progress';
        inProgressButton.className = task.isInProgress ? 'in-progress' : '';
        inProgressButton.onclick = () => {
            if (!task.isInProgress) {
                task.isInProgress = true;
                task.isComplete = false;
                vscode.postMessage({ command: 'updateStatus', task, status: 'IP' });
            }
        };

        const removeButton = document.createElement('button');
        removeButton.textContent = 'Remove';
        removeButton.className = 'remove';
        removeButton.onclick = () => vscode.postMessage({ command: 'removeTask', task });

        actions.appendChild(goButton);
        actions.appendChild(starButton);
        actions.appendChild(completeButton);
        actions.appendChild(inProgressButton);
        actions.appendChild(removeButton);

        taskItem.appendChild(taskText);
        taskItem.appendChild(actions);

        taskList.appendChild(taskItem);
    });

    // Initialize SortableJS on the task list
    new Sortable(taskList, {
        animation: 150,
        onEnd: function (evt) {
            const item = evt.item;
            const order = Array.from(taskList.children).map(child => child.getAttribute('data-id'));
            vscode.postMessage({ command: 'reorderTasks', order });
        }
    });
}
