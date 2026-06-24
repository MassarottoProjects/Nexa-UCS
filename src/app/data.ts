// ─── Lesson & Mission Data ────────────────────────────────────────────────────
// Extracted to keep App.tsx below proxy size limits

// ─── Module Content Data ─────────────────────────────────────────────────────

export interface ModuleData {
  title: string;
  xp: number;
  filename: string;
  explanations: { title: string; text: string; code?: string }[];
  starterCode: string;
  expectedOutput: string[];
  hint: string;
}

export const MODULES: Record<string, ModuleData> = {
  "1.1": {
    title: "Seu primeiro Olá mundo",
    xp: 50,
    filename: "hello.js",
    explanations: [
      {
        title: "Bem-vindo ao JavaScript! 🌐",
        text: "JavaScript é a linguagem de programação mais usada do mundo! Ela roda direto no navegador e também no servidor com `Node.js`. Com JS você cria sites interativos, apps, jogos e muito mais. Nesta missão você vai escrever seu primeiro programa — o clássico Hello World — e dar o primeiro passo da sua jornada como dev!",
      },
      {
        title: "console.log() — sua voz no código",
        text: "Em JavaScript, usamos `console.log()` para exibir mensagens no terminal. Pense nele como o \"falar\" do programa. Basta escrever `console.log(\"sua mensagem\")` e o texto aparece. Você pode usar aspas simples ou duplas — ambas funcionam.",
        code: `console.log("Olá, mundo!");
console.log('Funciona com aspas simples também!');
// Saída:
// Olá, mundo!
// Funciona com aspas simples também!`,
      },
      {
        title: "Sua missão 🚀",
        text: "Escreva uma linha de código que exibe `Olá mundo` no terminal. Parece simples — e é! Todo grande desenvolvedor começou exatamente assim. Quando estiver pronto, clique em Compilar e Executar.",
      },
    ],
    starterCode: `// Módulo 1.1: Seu primeiro "Olá mundo"

// escreva aqui a linha que exibe: Olá mundo
`,
    expectedOutput: [
      "$ node hello.js",
      "Olá mundo",
    ],
    hint: "Escreva: console.log(\"Olá mundo\") — atenção para as aspas e a acentuação!",
  },

  "1.2": {
    title: "Variáveis e Tipos de Dados",
    xp: 60,
    filename: "variaveis.js",
    explanations: [
      {
        title: "O que são variáveis? 📦",
        text: "Variável é uma caixinha com nome onde você guarda um valor. Em vez de escrever `\"Astronauta_Leo\"` em 50 lugares do código, você guarda o nome uma vez e usa a etiqueta da caixa em todo lugar. Se precisar mudar, muda em um lugar só e o código inteiro atualiza.",
        code: `const nome = "Astronauta_Leo";
console.log(nome); // Astronauta_Leo
console.log(nome); // Astronauta_Leo (mesma caixa, mesmo valor)`,
      },
      {
        title: "const ou let? 🔒",
        text: "Use `const` para valores que nunca vão mudar (nome, nível base, constantes do jogo). Use `let` para valores que vão ser atualizados ao longo do tempo (pontos, vidas, XP). Começar com `const` é sempre a escolha mais segura — troque para `let` só quando precisar.",
        code: `const nome = "Leo";   // ✓ nome não muda
let xp = 2200;        // ✓ XP vai aumentar

// nome = "Carlos";   // ✗ ERRO — const trava o valor
xp = 2500;            // ✓ let permite trocar`,
      },
      {
        title: "Atualizando uma variável 🔄",
        text: "Para somar algo a uma variável `let`, você lê o valor atual, faz a conta, e guarda o resultado de volta. A linha `xp = xp + 70` significa: pega o xp que está guardado, soma 70, e salva de volta no mesmo lugar.",
        code: `let xp = 2200;
xp = xp + 70;    // lê 2200, soma 70, guarda 2270
console.log(xp); // 2270`,
      },
      {
        title: "Tipos de dados 🔢",
        text: "Todo valor em JS tem um tipo. Os três mais comuns são: `string` (qualquer texto entre aspas), `number` (qualquer número, com ou sem vírgula) e `boolean` (só dois valores possíveis: `true` ou `false`). O operador `typeof` revela o tipo de qualquer variável.",
        code: `const nome = "Leo";
const nivel = 4;
const aprovado = true;

console.log(typeof nome);     // "string"
console.log(typeof nivel);    // "number"
console.log(typeof aprovado); // "boolean"`,
      },
      {
        title: "Sua missão 🚀",
        text: "O exemplo com `nome` já está pronto para você ver como funciona. Siga o mesmo padrão para `nivel` e `aprovado`: primeiro exiba o valor, depois o tipo com `typeof`. Por último, atualize o XP somando 10 e exiba o novo valor.",
      },
    ],
    starterCode: `// Módulo 1.2: Variáveis e Tipos de Dados

const nome = "Astronauta_Leo";
const nivel = 4;
let xp = 20;
const aprovado = true;

// Exemplo pronto — siga esse padrão:
console.log(nome);        // exibe o valor
console.log(typeof nome); // exibe o tipo

// TODO: faça o mesmo com 'nivel'


// TODO: faça o mesmo com 'aprovado'


// TODO: some 10 ao xp e exiba o novo valor
`,
    expectedOutput: [
      "$ node variaveis.js",
      "Astronauta_Leo",
      "string",
      "4",
      "number",
      "true",
      "boolean",
      "30",
    ],
    hint: "Para cada variável: console.log(variavel) na primeira linha, console.log(typeof variavel) na segunda. Para o XP: escreva xp = xp + 70 primeiro, depois console.log(xp).",
  },

  "1.3": {
  title: "Operadores e Expressões",
  xp: 70,
  filename: "operadores.js",
  explanations: [
    {
      title: "Operadores: a calculadora do código ➕",
      text: "Os operadores aritméticos funcionam igual à matemática: `+` soma, `-` subtrai, `*` multiplica, `/` divide. O JavaScript resolve a expressão inteira e exibe o resultado. Parênteses funcionam igual à matemática — o que está dentro é calculado primeiro.",
      code: `console.log(80 - 25);       // 55
console.log((9.0 + 7.0) / 2); // 8`,
    },
    {
      title: "Comparações: o código fazendo perguntas 🔍",
      text: "Operadores de comparação fazem uma pergunta e o JS responde com `true` (sim) ou `false` (não). Use `>` para maior, `>=` para maior ou igual, `===` para exatamente igual. Sempre prefira `===` ao invés de `==` — o `==` causa bugs silenciosos.",
      code: `console.log(930 > 800);    // true  → 930 é maior que 800?
console.log(930 === 1000); // false → 930 é igual a 1000?
console.log(930 >= 1000);  // false → 930 é maior ou igual a 1000?`,
    },
    {
      title: "E, OU, NÃO — combinando condições 🧠",
      text: "`&&` (E): os dois precisam ser `true`. `||` (OU): basta um ser `true`. `!` (NÃO): inverte o valor — `true` vira `false` e vice-versa.",
      code: `console.log(true && true);  // true  → os dois são true
console.log(true && false); // false → um deles é false
console.log(!true);         // false → inverte o true`,
    },
    {
      title: "Sua missão 🚀",
      text: "O Astronauta Leo terminou uma missão com 680 pontos e 250 de bônus. O `totalPontos` já foi calculado para você. Use `console.log()` com as expressões indicadas em cada TODO para responder às perguntas da missão.",
    },
  ],
  starterCode: `// Módulo 1.3: Operadores e Expressões

const pontosMissao = 680;
const bonus = 250;
const meta = 1000;
const totalPontos = pontosMissao + bonus; // já calculado: 930
const temConexao = true;

// ── ARITMÉTICA ──────────────────────────────────
// Exemplo pronto:
console.log(pontosMissao + bonus); // 930

// TODO: quantos pontos faltaram para bater a meta?
// escreva um console.log com a expressão: meta - totalPontos


// ── COMPARAÇÃO ──────────────────────────────────
// TODO: o jogador fez mais de 800 pontos?
// escreva um console.log com a expressão: totalPontos > 800


// TODO: o jogador bateu exatamente a meta?
// escreva um console.log com a expressão: totalPontos === meta


// ── LÓGICA ──────────────────────────────────────
// TODO: pode enviar o placar? precisa ter mais de 800 pontos E ter conexão
// escreva um console.log com a expressão: totalPontos > 800 && temConexao

`,
  expectedOutput: [
    "$ node operadores.js",
    "930",
    "70",
    "true",
    "false",
    "true",
  ],
  hint: "Cada TODO vira uma linha: console.log(expressão). Ex: console.log(meta - totalPontos). Só coloque a expressão dentro dos parênteses do console.log — o JS calcula o resultado e exibe.",
},

  "1.4": {
    title: "Criando Funções",
    xp: 75,
    filename: "funcoes.js",
    explanations: [
      {
        title: "O que é uma função? 🧩",
        text: "Uma função é como um botão que você mesmo cria e nomeia. Dentro desse botão você guarda quantas linhas de código quiser. Quando você 'aperta' o botão — digitando o nome dele com parênteses — o computador executa tudo de uma vez. O melhor: você pode apertar esse botão quantas vezes quiser!",
        code: `// Criando o botão:
function fazerCafe() {
  console.log("Aquecendo água...");
  console.log("Café pronto!");
}

// Apertando o botão 2 vezes:
fazerCafe(); // Aquecendo água... / Café pronto!
fazerCafe(); // Aquecendo água... / Café pronto!`,
      },
      {
        title: "Como criar uma função em JS? ✍️",
        text: "Uma função tem três partes: a palavra `function`, o nome que você escolhe, e as chaves `{ }` onde fica o código. O nome segue a mesma regra das variáveis: sem espaços, sem acento, sem começar com número.",
        code: `//  ↓ palavra mágica   ↓ nome que você escolhe
function ligarFoguete() {
  // tudo aqui dentro roda quando você chamar a função
  console.log("Foguete ligado");
}
//              ↑ parênteses sempre presentes`,
      },
      {
        title: "Sua missão 🚀",
        text: "A função `ligarFoguete()` já foi criada para você — mas ela está vazia! Escreva um `console.log` dentro dela com a mensagem `Foguete ligado`. O código já vai apertar esse botão duas vezes automaticamente.",
      },
    ],
    starterCode: `// Módulo 1.4: Criando Funções

function ligarFoguete() {
  // Escreva abaixo a linha que exibe: Foguete ligado
  
}

// Apertando o botão (chamando a função) — não altere:
ligarFoguete();
ligarFoguete();
`,
    expectedOutput: [
      "$ node funcoes.js",
      "Foguete ligado",
      "Foguete ligado",
    ],
    hint: "Dentro da função, digite exatamente: console.log(\"Foguete ligado\");",
  },

  "1.5": {
    title: "Decisões (if/else)",
    xp: 80,
    filename: "condicionais.js",
    explanations: [
      {
        title: "Se... Senão 🤔",
        text: "No videogame, se você tem moedas suficientes, compra o item. Se não tem, aparece 'Moedas insuficientes'. No código fazemos exatamente isso com `if` (se) e `else` (senão): o programa testa uma condição e toma um caminho ou o outro — nunca os dois ao mesmo tempo.",
        code: `const bateria = 15;

if (bateria < 20) {
  console.log("Bateria baixa! Conecte o carregador.");
} else {
  console.log("Bateria OK.");
}
// → Bateria baixa! Conecte o carregador.`,
      },
      {
        title: "Como ler um if/else? 👁️",
        text: "Dentro dos parênteses do `if` fica a pergunta — sempre uma expressão que resulta em `true` ou `false`. Se for `true`, o bloco de cima roda. Se for `false`, o bloco do `else` roda. O bloco que não rodar é completamente ignorado.",
        code: `if ( bateria < 20 ) {
//   ↑ a pergunta: "bateria é menor que 20?"
//   se SIM (true)  → entra aqui
} else {
//   se NÃO (false) → entra aqui
}`,
      },
      {
        title: "Sua missão 🚀",
        text: "O Astronauta Leo quer comprar uma skin que custa 50 moedas. Vamos completar o `if` que testa se o Leo consegue comprar com suas 30 moedas.",
      },
    ],
    starterCode: `// Módulo 1.5: Decisões

const moedas = 30;
console.log("Moedas atuais: " + moedas);

// Coloque uma condição dentro dos parênteses ("???") do 'if' testando se o Leo tem mais que 50 moedas

if ("???") {
  console.log("Compra realizada com sucesso!");
} else {
  // Escreva abaixo uma mensagem exibindo: Moedas insuficientes
  
}
`,
    expectedOutput: [
      "$ node condicionais.js",
      "Moedas atuais: 30",
      "Moedas insuficientes",
    ],
    hint: "Troque o \"???\" por moedas > 50. Dentro do else, adicione a linha: console.log(\"Moedas insuficientes\");",
  },

  "1.6": {
    title: "Repetições (Loops)",
    xp: 90,
    filename: "loops.js",
    explanations: [
      {
        title: "Deixe o computador trabalhar! 🔁",
        text: "Escrever `console.log` várias vezes é cansativo. O laço de repetição `for` serve para repetir linhas de código quantas vezes você mandar. Você diz onde começa, onde termina, e ele faz o trabalho pesado em um milissegundo.",
        code: `// Sem loop — chato e impossível de escalar:
console.log(1);
console.log(2);
console.log(3); // e por aí vai...

// Com loop — uma vez só:
for (let i = 1; i <= 3; i++) {
  console.log(i);
}
// Saída: 1  2  3`,
      },
      {
        title: "Anatomia do for 🔬",
        text: "O `for` tem três partes separadas por `;` dentro dos parênteses. A primeira define onde começa, a segunda diz até quando repetir, e a terceira atualiza o contador a cada volta. O `numero++` é um atalho para `numero = numero + 1`.",
        code: `for (let numero = 1; numero <= 5; numero++) {
//   ↑ começa em 1  ↑ repete enquanto ≤ 5  ↑ soma 1 a cada volta
  console.log(numero);
}
// 1ª volta: numero = 1 → exibe 1
// 2ª volta: numero = 2 → exibe 2
// ...
// 5ª volta: numero = 5 → exibe 5
// 6ª volta: numero = 6 → 6 > 5, para!`,
      },
      {
        title: "Sua missão 🚀",
        text: "Escreva um `for` que conta de 1 até 5 e exibe cada número com `console.log(numero)`. Use o modelo da explicação acima como guia — as 3 partes já estão nos comentários do código.",
      },
    ],
    starterCode: `// Módulo 1.6: Repetições
// O 'for' tem 3 partes:
// let numero = 1;   → começa em 1
// numero <= 5;      → repete enquanto for menor ou igual a 5
// numero++          → soma 1 a cada volta

console.log("--- Contando até 5 ---");

// Escreva seu for aqui:

`,
    expectedOutput: [
      "$ node loops.js",
      "--- Contando até 5 ---",
      "1",
      "2",
      "3",
      "4",
      "5",
    ],
    hint: "Lembre das 3 partes do 'for'! E não esqueça de usar um console.log(numero) dentro do laço.",
  },
};

// ─── Code Execution Sandbox ───────────────────────────────────────────────────


// ─── Final Mission Screen ─────────────────────────────────────────────────────

export interface FinalStage {
  label: string;
  emoji: string;
  filename: string;
  description: string;
  hint: string;
  starterCode: string;
  expectedOutput: string[];
  objectives: string[];
}

export const FINAL_STAGES: FinalStage[] = [
  {
    label: "Variáveis",
    emoji: "📦",
    filename: "etapa-1.js",
    description: "Vamos construir um verificador de notas da turma! Antes de qualquer coisa, exiba as variáveis disponíveis para entender o que temos para trabalhar.",
    hint: "Use console.log('notaMinima:', notaMinima) para exibir o nome e o valor juntos. Repita o padrão para cada variável.",
    starterCode: `const notaMinima = 7;
const nota1 = 8;
const nota2 = 5;
const nota3 = 10;

// Etapa 1: exiba as 4 variáveis acima com console.log
// Formato esperado → notaMinima: 7
`,
    expectedOutput: [
      "$ node etapa-1.js",
      "notaMinima: 7",
      "nota1: 8",
      "nota2: 5",
      "nota3: 10",
    ],
    objectives: [
      "Exiba notaMinima com console.log",
      "Exiba nota1 com console.log",
      "Exiba nota2 com console.log",
      "Exiba nota3 com console.log",
    ],
  },
  {
    label: "Condicionais",
    emoji: "🔀",
    filename: "etapa-2.js",
    description: "Ótimo! Agora use if/else para verificar se cada aluno foi aprovado ou reprovado. A nota mínima é 7 — você já sabe fazer isso!",
    hint: "if (nota1 >= notaMinima) { console.log('Aluno 1: Aprovado'); } else { console.log('Aluno 1: Reprovado'); } — repita o padrão para nota2 e nota3.",
    starterCode: `const notaMinima = 7;
const nota1 = 8;
const nota2 = 5;
const nota3 = 10;

// Etapa 2: use if/else para verificar cada aluno
// Formato esperado → Aluno 1: Aprovado
`,
    expectedOutput: [
      "$ node etapa-2.js",
      "Aluno 1: Aprovado",
      "Aluno 2: Reprovado",
      "Aluno 3: Aprovado",
    ],
    objectives: [
      "Use if/else para verificar nota1",
      "Use if/else para verificar nota2",
      "Use if/else para verificar nota3",
    ],
  },
  {
    label: "Loop",
    emoji: "🔁",
    filename: "etapa-3.js",
    description: "Hora do poder final! Aqui você vai conhecer o array — uma lista de valores onde notas[0] é o primeiro item, notas[1] o segundo e assim por diante. Use o for que você aprendeu para percorrer a lista e contar os aprovados automaticamente.",
    hint: "O for vai de i=0 até i<3. Dentro dele: if (notas[i] >= notaMinima) { aprovados = aprovados + 1; console.log('Aluno ' + (i+1) + ': Aprovado'); } else { console.log('Aluno ' + (i+1) + ': Reprovado'); } — depois do loop: console.log('Total de aprovados: ' + aprovados).",
    starterCode: `const notaMinima = 7;
const notas = [8, 5, 10]; // notas[0]=8  notas[1]=5  notas[2]=10
let aprovados = 0;

// Etapa 3: use um for que vai de i=0 até i<3
// Dentro do loop, notas[i] acessa a nota de cada aluno
// Use aprovados = aprovados + 1 para contar os aprovados
`,
    expectedOutput: [
      "$ node etapa-3.js",
      "Aluno 1: Aprovado",
      "Aluno 2: Reprovado",
      "Aluno 3: Aprovado",
      "Total de aprovados: 2",
    ],
    objectives: [
      "Use um for de i=0 até i<3",
      "Acesse cada nota com notas[i] dentro do loop",
      "Use if/else para verificar aprovação de cada aluno",
      "Some aprovados = aprovados + 1 para os aprovados",
      "Exiba o total de aprovados ao final",
    ],
  },
];

