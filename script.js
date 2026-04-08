const canvas = document.getElementById('notebook-canvas');
const ctx = canvas.getContext('2d');
const display = document.getElementById('display');
const explanation = document.getElementById('explanation');
const historyDiv = document.getElementById('history');

// Configurações de alinhamento com o Grid de 25px do seu CSS
const GRID = 25;

function resizeCanvas() {
    canvas.width = canvas.parentElement.offsetWidth;
    canvas.height = canvas.parentElement.offsetHeight;
}
window.addEventListener('load', resizeCanvas);
window.addEventListener('resize', resizeCanvas);

// Função auxiliar para escrever cada caractere em um quadradinho
function escreverNoGrid(texto, col, lin, cor = "#1a1a1a", tamanho = "20px") {
    ctx.font = `bold ${tamanho} 'Courier New', monospace`;
    ctx.fillStyle = cor;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    let str = texto.toString();
    for (let i = 0; i < str.length; i++) {
        // Posiciona no centro do quadrado de 25x25
        let x = (col + i) * GRID + (GRID / 2);
        let y = lin * GRID + (GRID / 2);
        if (str[i] !== " ") {
            ctx.fillText(str[i], x, y);
        }
    }
}

// 1. MULTIPLICAÇÃO ARMADA (IGUAL À PRIMEIRA FOTO)
function desenharMultiplicacao(n1, n2, res) {
    let s1 = n1.toString();
    let s2 = n2.toString();
    let tam = Math.max(s1.length, s2.length) + 1;
    let c = 5, l = 3;

    // Números e Operador
    escreverNoGrid(s1.padStart(tam, ' '), c, l);
    escreverNoGrid(s2.padStart(tam, ' '), c, l + 1);
    escreverNoGrid("×", c, l + 1);

    // Linha horizontal principal
    ctx.beginPath();
    ctx.lineWidth = 2;
    ctx.moveTo(c * GRID, (l + 2) * GRID);
    ctx.lineTo((c + tam + 1) * GRID, (l + 2) * GRID);
    ctx.stroke();

    if (n2 > 9) {
        let p1 = (n1 * (n2 % 10)).toString();
        let p2 = (n1 * Math.floor(n2 / 10)).toString();
        
        // Resultados parciais
        escreverNoGrid(p1.padStart(tam, ' '), c, l + 2, "#666");
        escreverNoGrid(p2.padStart(tam - 1, ' '), c, l + 3, "#666"); 
        escreverNoGrid("+", c, l + 3);

        // Linha final
        ctx.moveTo(c * GRID, (l + 4) * GRID);
        ctx.lineTo((c + tam + 1) * GRID, (l + 4) * GRID);
        ctx.stroke();

        escreverNoGrid(res.toString().padStart(tam, ' '), c, l + 4, "#27ae60", "22px");
    } else {
        escreverNoGrid(res.toString().padStart(tam, ' '), c, l + 2, "#27ae60", "22px");
    }
}

// 2. DIVISÃO COM CHAVE (ALGORITMO DE EUCLIDES - IGUAL À FOTO)
function desenharDivisao(n1, n2) {
    let q = Math.floor(n1 / n2).toString();
    let r = (n1 % n2).toString();
    let s1 = n1.toString();
    let c = 4, l = 4;

    // Dividendo
    escreverNoGrid(s1, c, l);

    // Desenho da Chave
    ctx.beginPath();
    ctx.lineWidth = 2;
    let chaveX = (c + s1.length) * GRID + 5;
    ctx.moveTo(chaveX, (l - 0.5) * GRID);
    ctx.lineTo(chaveX, (l + 1) * GRID); // Vertical
    ctx.lineTo(chaveX + (4 * GRID), (l + 1) * GRID); // Horizontal
    ctx.stroke();

    // Divisor e Quociente
    escreverNoGrid(n2.toString(), c + s1.length + 1, l);
    escreverNoGrid(q, c + s1.length + 1, l + 1, "#27ae60");

    // Resto/Subtração
    let sub = (Math.floor(n1 / n2) * n2).toString();
    escreverNoGrid("-" + sub, c - 1, l + 1, "#e53e3e");
    
    ctx.beginPath();
    ctx.moveTo((c - 1) * GRID, (l + 2) * GRID);
    ctx.lineTo(chaveX, (l + 2) * GRID);
    ctx.stroke();

    escreverNoGrid(r, c + s1.length - r.length, l + 2, "#27ae60");
}

// 3. FRAÇÕES (IGUAL À SEGUNDA FOTO)
function desenharFracao(exp) {
    let [num, den] = exp.split('/');
    let c = 8, l = 6;
    
    escreverNoGrid(num, c, l);
    // Traço da fração
    ctx.fillRect(c * GRID + 5, (l + 1) * GRID - 2, GRID * num.length + 10, 2);
    escreverNoGrid(den, c, l + 1);
    
    explanation.innerText = "Professor: Representei sua divisão como uma fração no caderno!";
}

// FUNÇÕES DA CALCULADORA
function append(val) {
    if (display.innerText === "0") display.innerText = "";
    display.innerText += val;
}

function clearDisplay() {
    display.innerText = "0";
    historyDiv.innerHTML = "";
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    explanation.innerText = "Professor: Limpei o caderno. Vamos para a próxima?";
}

function calculate() {
    try {
        let exp = display.innerText;
        // Sanitização simples para eval
        let res = eval(exp.replace('×', '*').replace('÷', '/'));
        let resultadoFormatado = Number.isInteger(res) ? res : res.toFixed(2);

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        historyDiv.innerHTML += `<div>${exp} = ${resultadoFormatado}</div>`;

        // Decidir o que desenhar baseado no operador
        if (exp.includes('*')) {
            let [a, b] = exp.split('*');
            desenharMultiplicacao(Number(a), Number(b), resultadoFormatado);
            explanation.innerText = "Professor: Multiplicamos cada dígito e somamos os resultados parciais.";
        } 
        else if (exp.includes('/')) {
            let [a, b] = exp.split('/');
            // Se for número pequeno, desenha fração, se for grande, desenha a chave
            if (a.length > 2 || b.length > 2) {
                desenharDivisao(Number(a), Number(b));
                explanation.innerText = "Professor: Montei a conta de divisão com a chave para você.";
            } else {
                desenharFracao(exp);
            }
        } 
        else {
            // Desenho padrão para soma/subtração
            escreverNoGrid(`${exp} =`, 2, 4);
            escreverNoGrid(resultadoFormatado.toString(), 2, 6, "#27ae60", "30px");
            explanation.innerText = "Professor: O resultado está pronto no caderno!";
        }

        display.innerText = resultadoFormatado;
    } catch (e) {
        display.innerText = "Erro";
    }
}

// Atalhos de teclado
document.addEventListener("keydown", (e) => {
    if (!isNaN(e.key) || "+-*/().".includes(e.key)) append(e.key);
    if (e.key === "Enter") calculate();
    if (e.key === "Backspace") display.innerText = display.innerText.slice(0, -1) || "0";
});