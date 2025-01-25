class Calculator {
    constructor() {
        this.previousOperand = '';
        this.currentOperand = '0';
        this.operation = undefined;
        this.history = [];
        this.isRadians = false;
        this.parenthesesCount = 0;
    }

    clear() {
        this.previousOperand = '';
        this.currentOperand = '0';
        this.operation = undefined;
        this.parenthesesCount = 0;
    }

    delete() {
        if (this.currentOperand === '0') return;
        if (this.currentOperand.length === 1) {
            this.currentOperand = '0';
        } else {
            const deleted = this.currentOperand.slice(-1);
            if (deleted === '(') this.parenthesesCount--;
            if (deleted === ')') this.parenthesesCount++;
            this.currentOperand = this.currentOperand.slice(0, -1);
        }
    }

    appendNumber(number) {
        if (number === '.' && this.currentOperand.includes('.')) return;
        if (this.currentOperand.length >= 12) return;
        if (this.currentOperand === '0' && number !== '.') {
            this.currentOperand = number;
        } else {
            this.currentOperand += number;
        }
    }

    appendParenthesis(parenthesis) {
        if (parenthesis === '(') {
            if (this.currentOperand === '0') {
                this.currentOperand = '(';
            } else {
                this.currentOperand += '(';
            }
            this.parenthesesCount++;
        } else if (parenthesis === ')' && this.parenthesesCount > 0) {
            this.currentOperand += ')';
            this.parenthesesCount--;
        }
    }

    handleFunction(func) {
        const num = parseFloat(this.currentOperand);
        let result;

        switch (func) {
            case 'sin':
                result = this.isRadians ? Math.sin(num) : Math.sin(num * Math.PI / 180);
                break;
            case 'cos':
                result = this.isRadians ? Math.cos(num) : Math.cos(num * Math.PI / 180);
                break;
            case 'tan':
                result = this.isRadians ? Math.tan(num) : Math.tan(num * Math.PI / 180);
                break;
            case '√':
                if (num < 0) {
                    alert('Kan geen wortel trekken uit een negatief getal!');
                    return;
                }
                result = Math.sqrt(num);
                break;
        }

        this.currentOperand = result.toPrecision(12).toString();
    }

    handlePercentage() {
        const num = parseFloat(this.currentOperand);
        this.currentOperand = (num / 100).toString();
    }

    chooseOperation(operation) {
        if (this.currentOperand === '') return;
        if (operation === '%') {
            this.handlePercentage();
            return;
        }
        if (this.previousOperand !== '') {
            this.compute();
        }
        this.operation = operation;
        this.previousOperand = this.currentOperand;
        this.currentOperand = '';
    }

    compute() {
        let computation;
        const prev = parseFloat(this.previousOperand);
        const current = parseFloat(this.currentOperand);
        
        if (isNaN(prev) || isNaN(current)) return;

        switch (this.operation) {
            case '+':
                computation = prev + current;
                break;
            case '-':
                computation = prev - current;
                break;
            case '*':
                computation = prev * current;
                break;
            case '/':
                if (current === 0) {
                    alert('Kan niet delen door nul!');
                    return;
                }
                computation = prev / current;
                break;
            case '^':
                computation = Math.pow(prev, current);
                break;
            default:
                return;
        }

        this.currentOperand = computation.toString();
        this.operation = undefined;
        this.previousOperand = '';
    }

    addToHistory(calculation) {
        this.history.push(calculation);
        if (this.history.length > 10) {
            this.history.shift();
        }
        this.updateHistoryDisplay();
    }

    updateHistoryDisplay() {
        const historyContent = document.querySelector('.history-content');
        historyContent.innerHTML = this.history.map(calc => 
            `<div class="history-item">${calc}</div>`
        ).join('');
    }

    toggleMode() {
        this.isRadians = !this.isRadians;
        document.querySelector('.deg').classList.toggle('active');
        document.querySelector('.rad').classList.toggle('active');
    }

    getDisplayNumber(number) {
        const stringNumber = number.toString();
        const integerDigits = parseFloat(stringNumber.split('.')[0]);
        const decimalDigits = stringNumber.split('.')[1];
        let integerDisplay;
        
        if (isNaN(integerDigits)) {
            integerDisplay = '';
        } else {
            integerDisplay = integerDigits.toLocaleString('nl-NL', {
                maximumFractionDigits: 0
            });
        }

        if (decimalDigits != null) {
            return `${integerDisplay}.${decimalDigits}`;
        } else {
            return integerDisplay;
        }
    }

    updateDisplay() {
        document.querySelector('.current-operand').textContent = 
            this.getDisplayNumber(this.currentOperand);
        if (this.operation != null) {
            document.querySelector('.previous-operand').textContent =
                `${this.getDisplayNumber(this.previousOperand)} ${this.operation}`;
        } else {
            document.querySelector('.previous-operand').textContent = '';
        }
    }
}

const calculator = new Calculator();

// Event Listeners
document.querySelectorAll('.number').forEach(button => {
    button.addEventListener('click', () => {
        calculator.appendNumber(button.textContent);
        calculator.updateDisplay();
    });
});

document.querySelectorAll('.operator').forEach(button => {
    button.addEventListener('click', () => {
        calculator.chooseOperation(button.textContent);
        calculator.updateDisplay();
    });
});

document.querySelectorAll('.function').forEach(button => {
    button.addEventListener('click', () => {
        calculator.handleFunction(button.textContent);
        calculator.updateDisplay();
    });
});

document.querySelectorAll('.parenthesis').forEach(button => {
    button.addEventListener('click', () => {
        calculator.appendParenthesis(button.textContent);
        calculator.updateDisplay();
    });
});

document.querySelectorAll('.mode-btn').forEach(button => {
    button.addEventListener('click', () => {
        calculator.toggleMode();
    });
});

document.querySelector('.equals').addEventListener('click', () => {
    calculator.compute();
    calculator.updateDisplay();
});

document.querySelector('.clear').addEventListener('click', () => {
    calculator.clear();
    calculator.updateDisplay();
});

document.querySelector('.delete').addEventListener('click', () => {
    calculator.delete();
    calculator.updateDisplay();
});

// Keyboard support
document.addEventListener('keydown', (e) => {
    const key = e.key;
    const button = Array.from(document.querySelectorAll('button')).find(btn => 
        btn.textContent === key || 
        (key === 'Enter' && btn.textContent === '=') ||
        (key === 'Escape' && btn.textContent === 'AC') ||
        (key === 'Backspace' && btn.textContent === 'DEL')
    );

    if (button) {
        button.classList.add('active');
        setTimeout(() => button.classList.remove('active'), 100);
    }

    if (e.key >= '0' && e.key <= '9' || e.key === '.') {
        calculator.appendNumber(e.key);
    } else if (['+', '-', '*', '/', '%', '^'].includes(e.key)) {
        calculator.chooseOperation(e.key);
    } else if (e.key === 'Enter' || e.key === '=') {
        calculator.compute();
    } else if (e.key === 'Backspace') {
        calculator.delete();
    } else if (e.key === 'Escape') {
        calculator.clear();
    } else if (e.key === '(' || e.key === ')') {
        calculator.appendParenthesis(e.key);
    }
    calculator.updateDisplay();
});

// Klik handlers voor geschiedenis items
document.querySelector('.history-content').addEventListener('click', (e) => {
    if (e.target.classList.contains('history-item')) {
        const calculation = e.target.textContent;
        const result = calculation.split('=')[1].trim();
        calculator.currentOperand = result;
        calculator.updateDisplay();
    }
});