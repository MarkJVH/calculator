function add(num1, num2) {
    return num1 + num2;
}

function subtract(num1, num2) {
    return num1 - num2;
}

function multiply(num1, num2) {
    return num1 * num2;
}

function divide(num1, num2) {
    if (num2 == 0) {
        return "Why u do dis? :("
    } else {
        return num1 / num2;
    }
}

function operate() {
    switch (operator) {
        case "+":
            result = add(num1, num2);
            addToDisplay(result);
            break;
        case "-":
            result = subtract(num1, num2);
            addToDisplay(result);
            break;
        case "*":
            result = multiply(num1, num2);
            addToDisplay(result);
            break;
        case "/":
            result = divide(num1, num2);
            addToDisplay(result);
            break;
        default:
            break;
    }
}

function clearCalculator() {
    num1 = null, num2 = null, result = 0, operator = "";
    const display = document.querySelector(".display");
    display.textContent = "";
}

/* Numbers are being added to the display, until an operator is clicked. */
function addToDisplay(text) {
    const display = document.querySelector(".display");
    display.textContent += text;
}

/* When operator is clicked, store the current number and operator.
 * Refresh the display and when the next operator is clicked, calculate the result.
 */
function operatorButtonClick(operatorButton) {
    const display = document.querySelector(".display");

    if (num1 == null) {
        num1 = Number(display.textContent);
        operator = operatorButton.textContent;
        display.textContent = "";
    }  else if (num1 != null) {
        num2 = Number(display.textContent);
        display.textContent = "";
        operate();

        num2 = null;
        num1 = result;
    }
}


let num1 = null, num2 = null, result = 0, operator = "";

const numberButtons = document.querySelectorAll(".number");
numberButtons.forEach(button => {
    button.addEventListener("click", () => addToDisplay(button.textContent));
});

const operatorButtons = document.querySelectorAll(".operator");
operatorButtons.forEach(button => {
    button.addEventListener("click", () => operatorButtonClick(button));
});

const clearButton = document.querySelector(".clear");
clearButton.addEventListener("click", () => clearCalculator());