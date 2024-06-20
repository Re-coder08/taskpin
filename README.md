Sure! Here is the `README.md` content in markdown format that you can copy and paste:

```markdown
# TaskPin

TaskPin is a VS Code extension designed to help developers manage their tasks seamlessly within the editor. It allows you to pin and manage tasks directly in your code comments, providing a convenient way to keep track of what needs to be done. The extension supports various task attributes, including priority, tags, status, and starring important tasks.

## Features

- Pin tasks directly in your code comments.
- Assign priorities, tags, and statuses to tasks.
- Easily navigate to task locations within the code.
- Manage task statuses with "Complete" and "In Progress" buttons.
- Highlight starred tasks for quick identification.

## Installation

To install TaskPin, follow these steps:

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/your-username/taskpin.git
   cd taskpin
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Build the Extension:**
   ```bash
   npm run compile
   ```

4. **Open the Extension in VS Code:**
   - Open VS Code.
   - Open the `taskpin` directory in VS Code.
   - Press `F5` to start debugging the extension.

## Usage

1. **Add Task Comments:**
   Add task comments in your code using the following format:
   ```typescript
   // taskpin: <Title> | <Priority> | <Tags> | <Status>
   ```
   Examples:
   ```typescript
   // taskpin: Implement authentication | H | #auth #login
   // taskpin: Fix bugs in payment processing | H | #bug #payment #urgent | starred
   // taskpin: Update documentation for new API endpoints | L | #documentation #api | C
   ```

2. **Open Task Management Panel:**
   - Open the Command Palette (`Ctrl+Shift+P` on Windows/Linux or `Cmd+Shift+P` on Mac).
   - Run the `TaskPin: Open Task Management Panel` command.

3. **Manage Tasks:**
   - The Task Management Panel will display a list of all tasks with `taskpin:` comments.
   - Click the "Go" button to navigate to the corresponding line in the source file.
   - Use the "Complete" and "In Progress" buttons to update the task status.
   - Star important tasks by clicking the star button.

## Contributing

TaskPin is an open-source project, and we welcome contributions from the community. There are many ways you can help:

- **Add New Features:** Suggest and implement new features to enhance the functionality of TaskPin.
- **Improve Language Compatibility:** Extend TaskPin to support more programming languages.
- **Fix Bugs:** Report and fix bugs to improve the stability and performance of the extension.
- **Improve Documentation:** Help us keep the documentation up-to-date and comprehensive.

To contribute, follow these steps:

1. **Fork the Repository:**
   - Go to the TaskPin repository on GitHub and fork it.

2. **Clone Your Fork:**
   ```bash
   git clone https://github.com/your-username/taskpin.git
   cd taskpin
   ```

3. **Create a Branch:**
   ```bash
   git checkout -b feature/your-feature-name
   ```

4. **Make Your Changes:**
   - Implement your changes in the codebase.

5. **Commit and Push:**
   ```bash
   git add .
   git commit -m "Add your commit message here"
   git push origin feature/your-feature-name
   ```

6. **Create a Pull Request:**
   - Go to the TaskPin repository on GitHub and create a pull request from your forked repository.

We appreciate your contributions and look forward to collaborating with you to improve TaskPin!

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
```
