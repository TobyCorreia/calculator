const buttonsContainer = document.querySelector('.numbersOperators');
const numberButtons = Array.from(buttonsContainer.querySelectorAll('button')).filter(button => /^\d$/.test(button.textContent));
const operatorButtons = Array.from(buttonsContainer.querySelectorAll('button')).filter(button => /[+\-x÷]/.test(button.textContent));
const decimalButton = document.querySelector('.decimal');
const equalsButton = document.querySelector('.equals');
const clearButton = document.getElementById("clear");
const deleteButton = document.getElementById("delete")
const firstRow = document.getElementById("firstRow")
const secondRow = document.getElementById("secondRow")

deleteButton.addEventListener('click', deleteLastChar);
clearButton.addEventListener('click', clear);
decimalButton.addEventListener('click', addDecimal);
equalsButton.addEventListener('click', equal);

// Add an event listener to each number button
numberButtons.forEach((button =>
    button.addEventListener('click', () => appendNumber(button.textContent))
))

operatorButtons.forEach((button =>
    button.addEventListener('click', () => appendOperator(button.textContent))))

function appendNumber(clickedNumber) {
    // Get the clicked number
    const showCalc = secondRow.textContent;

    // Check if it's the first click
    if (showCalc === '0') {
        // Replace the initial "0" with the clicked number
        firstRow.textContent = showCalc;
        secondRow.textContent = clickedNumber;
    } else {
        // Append the clicked number next to the previous number
        secondRow.textContent += clickedNumber;
    }
}

function appendOperator(clickedOperator) {
    let currentText = secondRow.textContent.trim(); // Remove leading and trailing spaces
    const lastCharacter = currentText.slice(-1);

    if (/[+\-x÷]/.test(lastCharacter)) {
        // If the last character is an operator, replace it
        currentText = currentText.slice(0, -1) + clickedOperator;
    } else {
        // Otherwise, append the clicked operator
        currentText += (' ' + clickedOperator + ' ');
    }

    secondRow.textContent = currentText;
}


function clear() {
    secondRow.textContent = '0'
    firstRow.textContent = ''
}

function deleteLastChar() {
    const currentText = secondRow.textContent;

    if (currentText.length > 1) {
        // If there are more than one character, delete the last one.
        secondRow.textContent = currentText.slice(0, -1);
    } else if (currentText.length === 1 && currentText !== '0') {
        // If there is one character and it's not '0', replace it with '0'.
        secondRow.textContent = '0';
    } // If there is one character and it's '0', do nothing.
}

function equal() {
    let currentText = secondRow.textContent.trim(); // Remove leading and trailing spaces
    const lastCharacter = currentText.slice(-1);

    if (/[+\-x÷]/.test(lastCharacter)) {
        // If the last character is an operator, replace it
        currentText = currentText.slice(0, -1) + '=';
    } else {
        currentText += ' ='
    }
    firstRow.textContent = currentText;
    secondRow.textContent = currentText;
    calculate()
}

function addDecimal() {
    secondRow.textContent += '.';
}

function calculate() {
    const inputArray = secondRow.textContent
        .split('')
        .filter((element) => element.trim() !== '');
    
    // Combine consecutive digits and decimals into a single item
    const modifiedArray = [];
    let currentItem = "";

    for (const item of inputArray) {
        if (!isNaN(item) || item === '.') {
        // If the item is a digit or a decimal, add it to the current item
        currentItem += item;
        } else {
        // If the item is not a digit or decimal, push the current item (if not empty) and the operator to the modified array
        if (currentItem !== "") {
        modifiedArray.push(currentItem);
        currentItem = "";
        }
    modifiedArray.push(item);
    }
    }

    // If there's a current item left (could be a number at the end), push it to the modified array
    if (currentItem !== "") {
    modifiedArray.push(currentItem);
    }

    // Call the calculate function to evaluate the expression.
const result = doCalculate(modifiedArray);

// Print the result.
console.log(result); // This will print the result of the expression

secondRow.textContent = result;
}

function doCalculate(expression) {
    // Define an array of supported operators.
    const operators = ['+', '-', 'x', '÷'];

    // Define operator precedence, which determines the order of operations.
    const operatorPrecedence = {
        '+': 1,
        '-': 1,
        'x': 2,
        '÷': 2
    };

    // Helper function to apply an operator.
    function applyOperator(operatorsStack, valuesStack) {
        const operator = operatorsStack.pop();
        const right = valuesStack.pop();
        const left = valuesStack.pop();

        // Perform the operation based on the operator.
        switch (operator) {
            case '+':
                valuesStack.push(left + right);
                break;
            case '-':
                valuesStack.push(left - right);
                break;
            case 'x':
                valuesStack.push(left * right);
                break;
            case '÷':
                valuesStack.push(left / right);
                break;
        }
    }

    // Initialize stacks for values and operators.
    const valuesStack = [];
    const operatorsStack = [];

    // Loop through each token in the expression.
    for (const token of expression) {
        if (!isNaN(parseFloat(token))) {
            // If the token is a number, push it onto the values stack.
            valuesStack.push(parseFloat(token));
        } else if (operators.includes(token)) {
            // If the token is an operator, handle operator precedence and apply operators.
            while (
                operatorsStack.length > 0 &&
                operatorPrecedence[operatorsStack[operatorsStack.length - 1]] >= operatorPrecedence[token]
            ) {
                applyOperator(operatorsStack, valuesStack);
            }
            operatorsStack.push(token);
        } else if (token === '=') {
            // If the token is "=", apply any remaining operators.
            while (operatorsStack.length > 0) {
                applyOperator(operatorsStack, valuesStack);
            }
        }
    }

    // The result will be the only value left in the values stack.
    return valuesStack[0];
}
