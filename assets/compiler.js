// Initialize CodeMirror
let editor;
document.addEventListener('DOMContentLoaded', () => {
    editor = CodeMirror.fromTextArea(document.getElementById('codeEditor'), {
        mode: 'text/x-c',
        theme: 'monokai',
        lineNumbers: true,
        autoCloseBrackets: true,
        matchBrackets: true,
        indentUnit: 4,
        tabSize: 4,
        lineWrapping: true,
        autofocus: true
    });
});

// Task definitions
const tasks = {
    1: {
        title: "Hello World",
        description: `Write a C program that prints "Hello, World!" to the console.
        
Requirements:
- Use the printf function
- Add a newline character at the end
- The output should be exactly "Hello, World!"`,
        template: `#include <stdio.h>

int main() {
    // Your code here
    
    return 0;
}`,
        expectedOutput: "Hello, World!\n"
    },
    2: {
        title: "Sum of Numbers",
        description: `Write a C program that calculates the sum of two numbers entered by the user.
        
Requirements:
- Use scanf to get two integers from the user
- Print the result in the format "Sum: X" where X is the sum
- Handle integer inputs only`,
        template: `#include <stdio.h>

int main() {
    int num1, num2;
    // Your code here
    
    return 0;
}`,
        expectedOutput: `Enter two numbers: 5 3
Sum: 8\n`
    },
    3: {
        title: "Find Maximum",
        description: `Write a C program that finds the maximum number among three integers.
        
Requirements:
- Use scanf to get three integers from the user
- Use if-else statements to find the maximum
- Print the result in the format "Maximum: X" where X is the largest number`,
        template: `#include <stdio.h>

int main() {
    int a, b, c;
    // Your code here
    
    return 0;
}`,
        expectedOutput: `Enter three numbers: 10 5 8
Maximum: 10\n`
    }
};

// Load task details
function loadTask() {
    const taskId = document.getElementById('taskSelector').value;
    if (!taskId) {
        clearTask();
        return;
    }

    const task = tasks[taskId];
    document.getElementById('taskDescription').innerHTML = `
        <h3>${task.title}</h3>
        <p>${task.description}</p>
    `;
    document.getElementById('expectedOutput').textContent = task.expectedOutput;
    editor.setValue(task.template);
}

// Clear task details
function clearTask() {
    document.getElementById('taskDescription').innerHTML = '<p>Select a task to begin coding...</p>';
    document.getElementById('expectedOutput').textContent = '';
    editor.setValue('');
    document.getElementById('outputArea').textContent = '';
}

// Run the code
async function runCode() {
    const code = editor.getValue();
    const outputArea = document.getElementById('outputArea');
    
    try {
        // In a real implementation, this would send the code to a backend server
        // For demo purposes, we'll show a mock response
        outputArea.textContent = 'Compiling...\n';
        
        // Simulate compilation delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const taskId = document.getElementById('taskSelector').value;
        if (taskId && tasks[taskId]) {
            // Mock output based on the task
            outputArea.textContent = tasks[taskId].expectedOutput;
        } else {
            outputArea.textContent = 'Please select a task first.';
        }
    } catch (error) {
        outputArea.textContent = 'Error: ' + error.message;
    }
}
