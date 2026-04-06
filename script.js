// script.js
let currentInput = "";
let previousInput = "";
let operator = null;

const canvas = document.getElementById('sheet');
const ctx = canvas.getContext('2d');

// Ajuste inicial do Canvas
window.addEventListener('load', () => {
    canvas.width = canvas.parentElement.offsetWidth;
    canvas.height = canvas.parentElement.offsetHeight;
});

function addChar(char) {
    if (currentInput === "0") currentInput = char;
    else currentInput += char;
    document.getElementById('display').innerText = currentInput;
}

function setOp(op) {
    if (currentInput === "") return;
    operator = op;
    previousInput = currentInput;
    currentInput = "";
}

function clearAll() {
    currentInput = "";
    previousInput = "";
    operator = null;
    document.getElementById('display').innerText = "0";
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// Funções Científicas Instantâneas
function execSci(func) {
    if (currentInput === "") return;
    let val = parseFloat(currentInput);
    let res = 0;
    let label = "";

    switch(func) {
        case 'sqrt': res = Math.sqrt(val); label = `√(${val})`; break;
        case 'pow': res = Math.pow(val, 2); label = `${val}²`; break;
        case 'sin': res = Math.sin(val * Math.PI / 180); label = `sin(${val}°)`; break;
        case 'cos': res = Math.cos(val * Math.PI / 180); label = `cos(${val}°)`; break;
    }

    drawSciNote(label, res.toFixed(4));
    currentInput = res.toString();
    document.getElementById('display').innerText = currentInput;
}

function calculate() {
    if (currentInput === "" || previousInput === "") return;
    let n1 = parseFloat(previousInput);
    let n2 = parseFloat(currentInput);
    let res = 0;

    switch(operator) {
        case '+': res = n1 + n2; drawMathStep(n1, n2, res, '+'); break;
        case '-': res = n1 - n2; drawMathStep(n1, n2, res, '-'); break;
        case '*': res = n1 * n2; drawMathStep(n1, n2, res, '×'); break;
        case '/': res = n2 !== 0 ? n1 / n2 : "Erro"; drawMathStep(n1, n2, res, '÷'); break;
    }

    currentInput = res.toString();
    document.getElementById('display').innerText = currentInput;
    operator = null;
}

// --- DESENHOS NO CADERNO ---

function drawMathStep(n1, n2, res, sym) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = "35px 'Comic Sans MS'";
    ctx.fillStyle = "#333";
    
    // Desenha a conta armada
    ctx.fillText(n1, 150, 100);
    ctx.fillText(sym + " " + n2, 110, 150);
    
    ctx.beginPath();
    ctx.moveTo(100, 170);
    ctx.lineTo(250, 170);
    ctx.lineWidth = 3;
    ctx.stroke();
    
    ctx.fillStyle = "#2b6cb0";
    ctx.fillText(res, 150, 220);
}

function drawSciNote(label, res) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = "30px 'Comic Sans MS'";
    ctx.fillStyle = "#333";
    
    ctx.fillText("Cálculo Científico:", 50, 80);
    ctx.fillText(label + " =", 50, 150);
    
    ctx.fillStyle = "#2b6cb0";
    ctx.font = "bold 40px 'Comic Sans MS'";
    ctx.fillText(res, 80, 220);
}