function add(a, b){
    return a + b;
}
function subtract(a, b){
    return a - b;
}
function multiply(a, b){
    return a * b;
}
function divide(a, b){
    return b === "0" ? "No" : a / b;
}

function operate(a, b, operator){
    if(operator == "+"){
       return add(a, b);
    } else if(operator == "-"){
        return subtract(a, b);
    } else if(operator == "*"){
        return multiply(a, b);
    } else if(operator == "/"){
        return divide(a, b);
    } else if(operator == "AC"){
        allClear();
    } else if(operator = "CE"){
        clearEntry();
    }
}
let a = null;
let b = null;
let operator = null;

// CE (and delete, and backspace) removes one digit at a time
// the moment operator or equal is pressed, save that number into a variable
// display that variable as first value in upper display (use it for calculations)
// 

const lowerDisplay = document.querySelector('.lower-display');
const upperDisplay = document.querySelector('.upper-display');
const buttons = document.querySelectorAll('.button');
let buttonValue = "value";
let buttonType = "type";

//Get button's digit or operation
buttons.forEach(button => {
    button.addEventListener("click", (e) => {
        buttonValue = e.target.dataset.value;
        buttonType = e.target.dataset.role;
        if (buttonType === 'digit'){
            console.log("number")
            addToDisplay(buttonValue);
        } else if (buttonType === 'operation') {
            console.log("function")
            operator = buttonValue;
            // find a way to discern functions and equal
            //execute(buttonValue);
        } else if (buttonType === 'decimal') {
            addToDisplay(buttonValue, buttonType);
        }
    })
});

function addToDisplay(buttonValue, buttonType){
    if(lowerDisplay.textContent === "0" && buttonType != 'decimal'){
        lowerDisplay.textContent = "";
        return lowerDisplay.textContent += buttonValue;
    } else if(buttonType === 'decimal' && lowerDisplay.textContent.includes(".") === true){
        return;
    } return lowerDisplay.textContent += buttonValue;
} 

function execute(){
    if(a && b && operator){
        let result = operate(a, b, operator);
        clearValues();
        lowerDisplay.textContent = result;
        execute();
    } else if (a){
        b = lowerDisplay.textContent;
    } else {
        a = lowerDisplay.textContent;
    }
}

function clearValues(){
    a = null;
    b = null;
    operator = null;
} 
function clearEntry(){
    // deletes one number at a time, if it reaches end removes first value if there is one
}

function allClear(){
    // resets all values (just refresh page?)
}

function updateHistory(){
    if(!operator){
        upperDisplay.textContent = `${a} ${operator} ${b} = ${lowerDisplay.textContent}`
    } upperDisplay.textContent = `${a} ${operator} ${b}`
    //on every button click update upper display with number and last clicked operation
}