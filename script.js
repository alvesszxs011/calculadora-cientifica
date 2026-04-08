function gerarPassos(expressao, resultado) {
    if (expressao.includes("log")) {
        const numero = expressao.match(/\d+/)[0];

        return `
        <b>Passo 1:</b> Identificamos a operação logarítmica<br>
        log(${numero})<br><br>

        <b>Passo 2:</b> Usamos log na base 10<br>
        log(${numero}) = log10(${numero})<br><br>

        <b>Passo 3:</b> Aplicamos a fórmula:<br>
        log(${numero}) ≈ ${resultado}<br>
        `;
    }

    if (expressao.includes("+")) {
        const [a, b] = expressao.split("+");

        return `
        <b>Passo 1:</b> Identificamos a soma<br>
        ${a} + ${b}<br><br>

        <b>Passo 2:</b> Somamos os valores<br>
        ${a} + ${b} = ${resultado}
        `;
    }

    if (expressao.includes("√")) {
        const numero = expressao.replace("√", "");

        return `
        <b>Passo 1:</b> Identificamos a raiz quadrada<br>
        √${numero}<br><br>

        <b>Passo 2:</b> Procuramos o número que multiplicado por ele mesmo dá ${numero}<br><br>

        <b>Passo 3:</b> Resultado:<br>
        √${numero} = ${resultado}
        `;
    }

    return "Passos não disponíveis para essa operação ainda.";
}