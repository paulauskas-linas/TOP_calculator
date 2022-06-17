//Get DOM elements
const lowerDisplay = document.querySelector('.lower-display');
const upperDisplay = document.querySelector('.upper-display');
const warning = document.querySelector('.warning');
const buttons = document.querySelectorAll('.button');
//Set variables for buttons
let buttonValue = "value";
let buttonType = "type";
//Set variables for calculation
let a = "";
let b = "";
let operator = "";
let temp = "";
let result = "";
//Set toggles for calculation
let isEqualPressed = false;
let isDigitPressed = false;
let isOperationPressed = false;
// Listen for clicks and keyboard activity
buttons.forEach(button => {
    button.addEventListener("click", (e) => {
        buttonValue = e.target.dataset.value;
        buttonType = e.target.dataset.role;
        clearButtonValue = buttonValue;
        filterInput();
        log();
    })
});
window.addEventListener('keydown', filterKeyboardInput)
// Filter keyboard input
function filterKeyboardInput(e){
    let key = e.key;
    switch(key){
        case "0":
        case "1":
        case "2":
        case "3":
        case "4":
        case "5":
        case "6":
        case "7":
        case "8":
        case "9":
            buttonValue = key;
            buttonType = 'digit';
            filterInput();
            break;
        case "+":
        case "-":
        case "*":
        case "/":
            buttonValue = key;
            buttonType = 'operation';
            filterInput();
            break;
        case ".":
            buttonValue = key;
            buttonType = 'decimal';
            filterInput();
            break;
        case "=":
        case "Enter":
            buttonValue = "=";
            buttonType = 'equal'
            filterInput();
            break;
        case "Backspace":
        case "Delete":
            buttonType = "clear";
            clearButtonValue = "CE";
            filterInput();
            break;
        case "Escape":
            buttonType = "clear";
            clearButtonValue = "AC";
            filterInput();
            break;
        default:
            break;

    }
}
// Filter input by button type and toggles
function filterInput(){
    if (buttonType === 'digit'){
        if(isEqualPressed && temp == result){
            isEqualPressed = false;
            temp = "";
            b = "";
            result = "";
            storeNumbersInT(buttonValue, buttonType);
            lowerDisplay.textContent = `${temp}`;
            isDigitPressed = true;
        } else if(isEqualPressed){
            isEqualPressed = false;
            temp = "";
            b = "";
            storeNumbersInT(buttonValue, buttonType);
            lowerDisplay.textContent = `${temp}`;
            isDigitPressed = true;
        } else {
            if(isOperationPressed){
                temp = "";
                isOperationPressed = false;
                storeNumbersInT(buttonValue, buttonType);
                showNumbersInDisplay();
                lowerDisplay.textContent = `${temp}`;
                isDigitPressed = true;
            } else {
                isDigitPressed = true;
                storeNumbersInT(buttonValue, buttonType);
                showNumbersInDisplay();
                lowerDisplay.textContent = `${temp}`;
            }
        }
    } else if (buttonType === 'operation') {
        isOperationPressed = true;
        if(warning.textContent != ''){
            warning.textContent = ''
        }
        if(a && operator && !temp){
            operator = buttonValue;
            showNumbersInDisplay();
        } else if(!a && operator && !temp && result){
            operator = buttonValue;
            a = result;
            result = "";
            showNumbersInDisplay();
        } else if(isEqualPressed){
            operator = buttonValue;
            a = result;
            result = "";
            temp = "";
            b = "";
            isEqualPressed = false;
            showNumbersInDisplay();
        } else {
            isDigitPressed = false;
            isEqualPressed = false;
            if(b !=""){
                a = result;
                b = "";
                return;
            }
            storeValuesInOperands();
            execute();
            operator = buttonValue;
            temp = "";
            showNumbersInDisplay();
        }
    } else if (buttonType === 'decimal') {
        storeNumbersInT(buttonValue, buttonType);
        isOperationPressed = false;
        showNumbersInDisplay();
        lowerDisplay.textContent = `${temp}`;
    } else if(buttonType === 'equal'){
        isEqualPressed = true;
        execute();
        lowerDisplay.textContent = `${temp}`;
    } else if(buttonType === 'clear'){
        clear(clearButtonValue);
    }
}
// Store input into temporary variable
function storeNumbersInT(buttonValue, buttonType){
    if(temp === "0" && buttonType != 'decimal'){
        temp = "";
        return temp += buttonValue;
    } else if(buttonType === 'decimal' && temp.toString().includes(".") === true){
        return;
    } else if(buttonType === 'decimal' && temp === ""){
        return temp = "0."
    } else if (overflowDisplay()){
        return temp;
    } return temp += buttonValue;
}
// Check if value overflows display
function overflowDisplay(){
    if (temp.toString().length > 12 && isDigitPressed){
        warning.textContent = "Entered value exceeds calculator limit(12)";
        return true;
    } else {
        return false;
    }
} 
// Store values in appropriate operands
function storeValuesInOperands(){
    if(temp != ""){
        if(a === ""){
            a = temp;
        } else {
            b = temp;
        }
    } else {
        operator = buttonValue;
    }
}
// Execute calculation based on operands and toggles position
function execute(){
    if(a !="" && b != "" && operator != "" && isEqualPressed){
        result = operate(a, b, operator);
        checkResult();
        temp = result;
        showNumbersInDisplay();
        operator = "";
        lowerDisplay.textContent = `${temp}`;
        a = "";
        b = "";
    } else if(a !="" && b != "" && operator != ""){
        result = operate(a, b, operator);
        checkResult();
        temp = result;
        showNumbersInDisplay();
        lowerDisplay.textContent = `${temp}`;
        a = result;
        b = "";
    } else if (a != "" && operator !="" && isEqualPressed && !isDigitPressed){
        b = a;
        result = operate(a, b, operator);
        checkResult();
        temp = result;
        showNumbersInDisplay();
        a = "";
    } else if(a == "" && b != "" && isEqualPressed) {
        a = temp;
        result = operate(a, b, operator);
        checkResult();
        showNumbersInDisplay();
        a = "";
        temp = result;
    } else if(a == "" && isEqualPressed && operator) {
        a = result;
        execute();
    } else if(a != "" && operator != "" && isDigitPressed){
        storeValuesInOperands();
        isDigitPressed = false;
        execute();
    } 
}
function checkResult(){
    if(result.toString().length > 12){
        result = result.toExponential(2);
        warning.textContent = "Result exceeds calculator limit(12). It is shown in exponential notation"; 
    }
}
// Mathematical functions to execute on
function operate(a, b, operator){
    if(operator == "+"){
        return add(a, b);
    } else if(operator == "-"){
        return subtract(a, b);
    } else if(operator == "*"){
        return multiply(a, b);
    } else if(operator == "/"){
        return divide(a, b);
    }
}
// Mathematical functions to operate on
function add(a, b){
    return Number(a) + Number(b);
}
function subtract(a, b){
    return Number(a) - Number(b);
}
function multiply(a, b){
    return Number(a) * Number(b);
}
function divide(a, b){
    return b === "0" ? "No" : Number(a) / Number(b);
}
// Set variables for display
const historyArray = [];
historyArray[3] = "=";
// Function for updating upper display
function showNumbersInDisplay(){
    if(operator === ""){
        historyArray[1] = "";
    } else {
        historyArray[1] = operator;
    }
    if(a === ""){
        historyArray[0] = temp;
        upperDisplay.textContent = `${historyArray[0]} ${historyArray[1]}`
    } else {
        historyArray[0] = a;
        upperDisplay.textContent = `${historyArray[0]} ${historyArray[1]}`
        if(b === ""){
            if(temp === "" && isOperationPressed){
                historyArray[2] = "";
                upperDisplay.textContent = `${historyArray[0]} ${historyArray[1]} ${historyArray[2]}`
            } else {
                historyArray[2] = temp;
                upperDisplay.textContent = `${historyArray[0]} ${historyArray[1]} ${historyArray[2]}`
            }
        } else {
            historyArray[2] = b;
            historyArray[3] = "=";
            historyArray[4] = temp;
            upperDisplay.textContent = `${historyArray[0]} ${historyArray[1]} ${historyArray[2]} ${historyArray[3]} ${historyArray[4]}`
        }
    }
}
// Set variables for clearing display
let clearButtonValue = "";
// Functions to either clear one character or all values
function clearValues(){
    a = "";
    b = "";
    operator = "";
    temp = "";
    result = "";
    isDigitPressed = false;
    isEqualPressed = false;
    isOperationPressed = false;
    warning.textContent = "";
} 
function clearEntry(){
    temp = temp.toString().slice(0, -1);
    lowerDisplay.textContent = `${temp}`;
    showNumbersInDisplay();
    isEqualPressed = false;
}
function clear(clearButtonValue){
    if(clearButtonValue == "AC"){
        clearValues();
        showNumbersInDisplay();
        lowerDisplay.textContent =`${temp}`;
    } else if(clearButtonValue = "CE"){
        if(temp.toString() === "" && !operator == ""){
            operator = "";
            showNumbersInDisplay;
            return;
        }
        if (temp.toString() === "" && operator == ""){
            temp = a;
            a = "";
            clearEntry();
        }
        if (temp.toString() === "" && operator == "" && a ==""){
            clearValues();
        }
        if (temp.toString() !== "" ){
            clearEntry();

        }
    }
}
function log(){
    console.log(`
    a = ${a}
    b = ${b}
    operator = ${operator}
    result = ${result}
    temp = ${temp}
    equal = ${isEqualPressed}
    digit = ${isDigitPressed}
    operation = ${isOperationPressed}
    `)
}
