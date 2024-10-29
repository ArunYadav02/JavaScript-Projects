let currentInput = '';
let previousInput = '';
let operator = null;
let lastOperator = null;
let lastOperand = null; // To store the last operand for repeating the operation
const display = document.getElementById('display');

// Function to update the display
function updateDisplay() {
  let displayValue = currentInput || previousInput || '0';
  
  // If an operator is selected and no new number is entered, display the operator with the previous input
  if (operator && !currentInput) {
    displayValue = previousInput + ' ' + operator;
  }

  if (currentInput.length > 12 || displayValue.length > 12) {
    display.style.fontSize = '20px'; // Reduce font size if the number is too long
  } else {
    display.style.fontSize = '24px'; // Default font size
  }

  // Limit the length of the number/operator displayed to avoid overflow
  display.textContent = displayValue.slice(0, 15);
}

// Function to display an error
function displayError() {
  display.textContent = 'Error!'; // Set error text
  display.style.color = 'red'; // Change font color to red
  setTimeout(() => {
    clearInput(); // Automatically clear the input after 2 seconds
  }, 2000);
}

// Clear input
function clearInput() {
  currentInput = '';
  previousInput = '';
  operator = null;
  lastOperator = null;
  lastOperand = null;
  display.style.color = 'white'; // Reset font color back to white after clearing
  updateDisplay();
}

// Handle operator input
function handleOperator(op) {
  if (currentInput === '' && previousInput === '') return;

  if (previousInput !== '' && currentInput !== '') {
    calculateResult();
  }

  operator = op;
  lastOperator = op; // Store the operator to repeat the operation
  previousInput = currentInput;
  currentInput = '';
  updateDisplay(); // Update display to show the operator
}

// Calculate the result
function calculateResult(repeat = false) {
  let prev = parseFloat(previousInput);
  let current = parseFloat(currentInput);

  if (repeat) {
    current = lastOperand; // Use the last operand for repeated operations
  } else {
    lastOperand = current; // Store the operand for future repeat operations
  }

  if (isNaN(prev) || isNaN(current)) {
    displayError(); // Display error if the input is invalid
    return;
  }

  let result;

  switch (operator) {
    case '+':
      result = prev + current;
      break;
    case '-':
      result = prev - current;
      break;
    case '*':
      result = prev * current;
      break;
    case '/':
      if (current === 0) {
        displayError(); // Display error for division by zero
        return;
      }
      result = prev / current;
      break;
    default:
      return;
  }

  // Limit the result to 15 characters, round if necessary
  currentInput = result.toString().slice(0, 15);
  operator = null;
  previousInput = currentInput;
  updateDisplay();
}

// Repeat the last operation when `=` or `Enter` is pressed again
function repeatLastOperation() {
  if (lastOperator && lastOperand !== null) {
    operator = lastOperator;
    calculateResult(true); // Repeat the calculation using the last operand
  }
}

// Handle keyboard input
function handleKeyboardInput(event) {
  const key = event.key;

  if (!isNaN(key) || key === '.') {
    // If it's a number or a decimal point, append it to the current input
    if (key === '.' && currentInput.includes('.')) return; // Prevent multiple decimals
    currentInput += key;
    updateDisplay();
  } else if (key === 'Escape') {
    // Clear on 'Escape'
    clearInput();
  } else if (key === 'Enter' || key === '=') {
    // Repeat the last operation or calculate the result
    if (currentInput === '' && lastOperator && lastOperand !== null) {
      repeatLastOperation(); // Repeat the last operation if there is no new input
    } else {
      calculateResult();
    }
  } else if (['+', '-', '*', '/'].includes(key)) {
    handleOperator(key);
  } else if (key === '%') {
    if (currentInput) {
      currentInput = (parseFloat(currentInput) / 100).toString();
      updateDisplay();
    }
  } else if (key === 'Backspace') {
    // Remove last character
    currentInput = currentInput.slice(0, -1);
    updateDisplay();
  }
}

// Event listener for button clicks
document.querySelectorAll('button').forEach(button => {
  button.addEventListener('click', () => {
    const action = button.getAttribute('data-action');
    const value = button.textContent;

    if (button.hasAttribute('data-number')) {
      if (value === '.' && currentInput.includes('.')) return; // Prevent multiple decimals
      currentInput += value;
      updateDisplay();
    } else if (action === 'clear') {
      clearInput();
    } else if (action === 'operator') {
      handleOperator(button.getAttribute('data-operator'));
    } else if (action === 'calculate') {
      if (currentInput === '' && lastOperator && lastOperand !== null) {
        repeatLastOperation(); // Repeat the last operation if there is no new input
      } else {
        calculateResult();
      }
    } else if (action === 'negate') {
      if (currentInput) {
        currentInput = (parseFloat(currentInput) * -1).toString();
        updateDisplay();
      }
    } else if (action === 'percent') {
      if (currentInput) {
        currentInput = (parseFloat(currentInput) / 100).toString();
        updateDisplay();
      }
    }
  });
});

// Event listener for keyboard input
window.addEventListener('keydown', handleKeyboardInput);

// Initialize display
updateDisplay();
