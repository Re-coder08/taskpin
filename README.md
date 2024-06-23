
# TaskPin

TaskPin is a VS Code extension that allows you to pin and manage your tasks seamlessly within the editor. It helps you keep track of your to-dos directly in your code, making it easier to manage and prioritize tasks without leaving the coding environment.

## Features

- **Pin Tasks:** Use specific syntax in comments to pin tasks in your code.
- **Task Manager:** View and manage all pinned tasks through the TaskPin Manager.
- **Priority and Tags:** Assign priority levels and tags to tasks.
- **Starred Tasks:** Mark important tasks with a star.
- **Track Status:** Update tasks as In Progress or Completed.

## Installation

1. Open VS Code.
2. Go to the Extensions view by clicking the Extensions icon in the Activity Bar or by pressing `Ctrl+Shift+X`.
3. Search for `TaskPin` and click Install.

## Usage

### Open TaskPin Manager

1. Open the command palette (`Ctrl+Shift+P` or `Cmd+Shift+P` on macOS).
2. Type `TaskPin: Open TaskPin Manager` and select the command.
3. The TaskPin Manager will open in a new panel where you can view and manage your tasks.

### Adding Tasks

To create a task, use the following syntax in your comments:

// taskpin: <Title> | <Priority> | <Tags> | <Starred>

Examples:
// taskpin: Update documentation | H | #docs | starred
// taskpin: Refactor code | M | #refactor
// taskpin: Fix bug | L

### Task Syntax Details

- **Title:** A short, descriptive title for the task.
- **Priority:** The priority level of the task (L for low, M for medium, H for high). Default is L.
- **Tags:** A list of tags or labels for categorizing the task (optional).
- **Starred:** Indicate if the task is starred (optional).

### Managing Tasks

- **Star/Unstar:** Click the star icon next to a task to mark it as important or remove the star.
- **Update Status:** Click the "Complete" or "In Progress" button to update the task status.
- **Go to Task:** Click on a task to navigate to the line in the code where the task is defined.
- **Remove Task:** Click the remove button to delete a task and its associated comment from the code.

## Troubleshooting

### Common Issues

1. **Tasks Not Appearing:**
   - Ensure you are using the correct task syntax in your comments.
   - Open the TaskPin Manager and click the refresh button to reload tasks.

### Error Handling

- If you encounter any issues or errors, check the VS Code output panel for error messages.
- Enable logging in the TaskPin settings to get more detailed error logs.

## Contributing

We welcome contributions to improve TaskPin. Here's how you can contribute:

1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Make your changes and commit them with descriptive commit messages.
4. Push your changes to your fork.
5. Submit a pull request to the main repository.

### Development Setup

1. Clone the repository: `git clone https://github.com/your-username/taskpin.git`
2. Install dependencies: `npm install`
3. Open the project in VS Code.
4. Start the development environment: `npm run compile` and `npm run watch`
5. Launch the extension: Press `F5` to open a new VS Code window with the extension loaded.

### Code Style

- Follow the existing code style and conventions.
- Run `npm run lint` to ensure your code adheres to the linting rules.

## License

This project is licensed under the MIT License. See the LICENSE file for details.

## Feedback

We'd love to hear your feedback! Please open an issue on GitHub if you have any suggestions, bug reports, or general comments.

## Acknowledgements

Thanks to all the contributors and the open-source community for making this project possible.
