// ─── Lesson & Mission Data ────────────────────────────────────────────────────
// Módulos: console.log · variáveis · funções

// ─── Module Content Data ─────────────────────────────────────────────────────

export interface ModuleData {
  title: string;
  xp: number;
  filename: string;
  explanations: { title: string; text: string; code?: string }[];
  starterCode: string;
  expectedOutput: string[];
  hint: string;
  dica: string;
}

export const MODULES: Record<string, ModuleData> = {

  // ── FASE 1: console.log() ────────────────────────────────────────────────

  "1.1": {
    title: "Olá, mundo",
    xp: 50,
    filename: "hello.js",
    explanations: [
      {
        title: "Bem-vindo ao JavaScript! 🌐",
        text: "JavaScript é a linguagem mais usada do mundo. Com ela você cria sites, apps e jogos. Nesta missão você escreve seu primeiro programa — o clássico Hello World.",
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
        text: "Escreva o comando que exiba `Olá, mundo` no terminal.",
      },
    ],
    starterCode: `// Módulo 1.1: Olá, mundo
    
// Escreva o comando que exiba Olá, mundo no terminal.
`,
    expectedOutput: [
      "$ node hello.js",
      "Olá, mundo",
    ],
    hint: "Use console.log('') e coloque o texto entre aspas dentro dos parênteses.",
    dica: "Lembre quando o exercicio pedir para EXIBIR algo use o comando console.log('')"
  },

  "1.2": {
    title: "Várias mensagens",
    xp: 55,
    filename: "mensagens.js",
    explanations: [
      {
        title: "console.log() várias vezes 📢",
        text: "Você pode usar `console.log()` quantas vezes quiser. Cada chamada exibe uma linha nova no terminal.",
        code: `console.log("Linha 1");
console.log("Linha 2");
console.log("Linha 3");
// Saída:
// Linha 1
// Linha 2
// Linha 3`,
      },
      {
        title: "Sua missão 🚀",
        text: "A primeira mensagem já está pronta. Escreva mais duas para completar o log de missão.",
      },
    ],
    starterCode: `// Módulo 1.2: Várias mensagens

// Exemplo pronto:
// console.log("Missão iniciada");

// Exiba a mensagem: Tripulação a bordo


// Exiba a mensagem: Destino: Marte
`,
    expectedOutput: [
      "$ node mensagens.js",
      "Tripulação a bordo",
      "Destino: Marte",
    ],
    hint: "Escreva um console.log() para cada mensagem, uma embaixo da outra.",
    dica: "Cada console.log() exibe uma linha. Você vai precisar de dois a mais.",
  },

  "1.3": {
    title: "console.log com números",
    xp: 55,
    filename: "numeros.js",
    explanations: [
    {
      title: "Números não usam aspas 🔢",
      text: "Em JavaScript, números são um tipo de dado próprio. Quando você escreve um número diretamente, como 42 ou 3.14, o JavaScript entende que ele pode ser usado em cálculos matemáticos. Já quando coloca aspas, ele vira texto e passa a ser tratado como uma sequência de caracteres.",
      code: `console.log(42);      // número
console.log("42");    // texto

console.log(3.14);    // número decimal
console.log("3.14");  // texto`,
    },
    {
      title: "Inteiros e decimais 📊",
      text: "Os números podem ser inteiros (sem casas decimais) ou decimais. Diferente da escrita comum em português, JavaScript usa ponto (.) para separar as casas decimais.",
      code: `console.log(10);     // inteiro
console.log(250);    // inteiro

console.log(3.14);   // decimal
console.log(0.5);    // decimal`,
    },
    {
      title: "Números podem ser usados em contas 🧮",
      text: "Como o JavaScript reconhece números, você pode realizar operações matemáticas diretamente dentro do console.log(). Isso será muito útil nos próximos módulos.",
      code: `console.log(10 + 5);  // 15 - Operador de soma (+)
console.log(20 - 3);  // 17 - Operador de subtração (-)
console.log(4 * 2);   // 8 - Operador de multiplicação (*)
console.log(12 / 3);  // 4 - Opearador de divisão (/)`,
    },
    {
      title: "Cuidado com as aspas ⚠️",
      text: "Um erro comum de iniciantes é colocar números entre aspas. Quando isso acontece, eles deixam de ser números e passam a ser textos.",
      code: `console.log(100);    // número
console.log("100");  // texto`,
    },
      {
        title: "Sua missão 🚀",
        text: "O primeiro número já está exibido. Agora, exiba o numero 2.5 e em uma nova linha some os numeros 2.5 e 10 diretamente dentro do console.log().",
      },
    ],
    starterCode: `// Módulo 1.3: console.log com números

// Exemplo pronto:
// console.log(10);

// Exiba o número 2.5


// Some os números 10 e 2.5
`,
    expectedOutput: [
      "$ node numeros.js",
      "2.5",
      "12.5",
    ],
    hint: "Lembre: texto usa aspas, número não precisa. E a soma deve ser feita dentro do console.log(? + ?).",
    dica: "Lembre: texto usa aspas, número não precisa. E a soma deve ser feita dentro do console.log(? + ?).",
  },

  // ── FASE 2: Variáveis ────────────────────────────────────────────────────

  "1.4": {
    title: "Variáveis com const",
    xp: 65,
    filename: "constantes.js",
    explanations: [
    {
      title: "O que é uma variável? 📦",
      text: "Uma variável é como uma caixa com uma etiqueta. A etiqueta é o nome da variável, e dentro da caixa fica o valor. Em vez de escrever o mesmo valor várias vezes, podemos guardá-lo em uma variável e reutilizá-lo quando precisarmos.",
      code: `const nome = "Pedro";

console.log(nome);
// Resultado: Pedro`,
    },
    {
      title: "Criando variáveis com const 🏷️",
      text: "A palavra-chave const é usada para criar uma variável cujo valor não será alterado depois. Primeiro escrevemos const, depois o nome da variável, o sinal de igual (=) e o valor que queremos guardar.",
      code: `const nave = "Apollo";
const combustivel = 100;

console.log(nave);
console.log(combustivel);`,
    },
    {
      title: "Acessando o valor da variável 🔍",
      text: "Depois que uma variável é criada, podemos usar apenas o seu nome para acessar o valor armazenado. O JavaScript substitui automaticamente o nome pelo valor guardado.",
      code: `const planeta = "Marte";

console.log(planeta);

// O JavaScript entende:
// console.log("Marte")`,
    },
    {
      title: "Sem aspas no nome da variável ⚠️",
      text: "Um erro muito comum é colocar aspas ao usar uma variável. Quando fazemos isso, o JavaScript entende que queremos mostrar o texto literalmente, e não o valor armazenado.",
      code: `const nave = "Apollo";

console.log(nave);    // Apollo
console.log("nave");  // nave`,
    },
    {
      title: "Variáveis podem guardar diferentes tipos 🎯",
      text: "Uma variável pode armazenar textos, números e vários outros tipos de dados que veremos mais adiante.",
      code: `const nome = "Apollo";
const velocidade = 25000;

console.log(nome);
console.log(velocidade);`,
    },
      {
        title: "Sua missão 🚀",
        text: "As variáveis `nave` e `combustivel` já foram criadas. Exiba o valor de cada uma com `console.log`.",
      },
    ],
    starterCode: `// Módulo 1.4: Variáveis com const

const nave = "Apollo";
const combustivel = 100;

// Exiba o valor de 'nave'


// Exiba o valor de 'combustivel'
`,
    expectedOutput: [
      "$ node constantes.js",
      "Apollo",
      "100",
    ],
    hint: "Para exibir o valor de uma variável, passe o nome dela para console.log() — sem aspas.",
    dica: "Para exibir o valor de uma variável, passe o nome dela para console.log() — sem aspas.",
  },

  "1.5": {
    title: "Variáveis com let",
    xp: 70,
    filename: "energia.js",
    explanations: [
    {
      title: "Quando usar let? 🔄",
      text: "Usamos let quando o valor de uma variável pode mudar ao longo do programa. Diferente de const, que cria um valor fixo, let permite atualizar o conteúdo da variável quantas vezes for necessário.",
      code: `let energia = 50;

console.log(energia); // 50

energia = 80;

console.log(energia); // 80`,
    },
    {
      title: "Atualizando uma variável ✏️",
      text: "Para alterar o valor de uma variável, escrevemos o nome dela, o sinal de igual (=) e o novo valor. O valor antigo é substituído pelo novo.",
      code: `let vidas = 3;

vidas = 5;

console.log(vidas); // 5`,
    },
    {
      title: "Usando o valor atual 📈",
      text: "Também podemos criar um novo valor a partir do valor que já está armazenado. O JavaScript primeiro lê o valor atual, faz a conta e depois salva o resultado na variável.",
      code: `let energia = 50;

energia = energia + 30;

console.log(energia); // 80`,
    },
    {
      title: "Entendendo passo a passo 🧠",
      text: "A linha energia = energia + 30 pode parecer estranha no começo. Ela significa: pegue o valor atual de energia, some 30 e guarde o resultado novamente em energia.",
      code: `let energia = 50;

// Passo 1: lê o valor atual (50)
// Passo 2: soma 30 (80)
// Passo 3: salva 80 em energia

energia = energia + 30;

console.log(energia); // 80`,
    },
    {
      title: "A variável mudou! 🚀",
      text: "Depois da atualização, a variável passa a guardar o novo valor. O valor antigo deixa de existir dentro dela.",
      code: `let moedas = 10;

console.log(moedas); // 10

moedas = moedas + 5;

console.log(moedas); // 15`,
    },
      {
        title: "Sua missão 🚀",
        text: "Exiba a energia inicial (50), depois adicione 30 e exiba o novo valor.",
      },
    ],
    starterCode: `// Módulo 1.5: Variáveis com let

let energia = 50;

// Exiba o valor atual de 'energia'


// Some 30 à energia


// Exiba o novo valor de 'energia'
`,
    expectedOutput: [
      "$ node energia.js",
      "50",
      "80",
    ],
    hint: "Lembre de exibir o valor antes e depois da atualização. Use energia = energia + seu valor para somar.",
    dica: "Para somar use: energia = energia + seu valor ",
  },

  "1.6": {
    title: "Variáveis no console.log",
    xp: 70,
    filename: "apresentacao.js",
    explanations: [
    {
      title: "Juntando texto e variáveis 🔤",
      text: "Muitas vezes queremos mostrar uma informação mais completa do que apenas o valor de uma variável. Podemos juntar um texto com o conteúdo da variável usando o operador +.",
      code: `const piloto = "Leo";

console.log("Piloto: " + piloto);

// Saída:
// Piloto: Leo`,
    },
    {
      title: "O operador + ➕",
      text: "Quando usado entre números, o + faz uma soma. Quando usado com textos, ele junta os conteúdos. Esse processo é chamado de concatenação.",
      code: `console.log(10 + 5);
// 15

console.log("Olá, " + "mundo!");
// Olá, mundo!`,
    },
    {
      title: "Texto + variável 🏷️",
      text: "O JavaScript também consegue juntar textos com variáveis. Ele pega o valor armazenado na variável e o adiciona ao texto.",
      code: `const planeta = "Marte";

console.log("Planeta: " + planeta);

// Resultado:
// Planeta: Marte`,
    },
    {
      title: "Funciona com números também 🔢",
      text: "Mesmo quando a variável guarda um número, podemos exibi-la junto com um texto. O JavaScript converte o número automaticamente para exibição.",
      code: `const velocidade = 1000;

console.log("Velocidade: " + velocidade);

// Resultado:
// Velocidade: 1000`,
    },
    {
      title: "Visualizando a construção da frase 🧩",
      text: "Imagine que o JavaScript substitui a variável pelo valor armazenado e depois junta tudo em uma única frase.",
      code: `const ano = 2045;

console.log("Ano: " + ano);

// O JavaScript monta:
// "Ano: " + "2045"

// Resultado:
// Ano: 2045`,
    },
      {
        title: "Sua missão 🚀",
        text: "Os dois primeiros exemplos já estão prontos. Use o mesmo padrão para exibir `planeta` e `ano`.",
      },
    ],
    starterCode: `// Módulo 1.6: Variáveis no console.log

const piloto = "Leo";
const velocidade = 1000;
const planeta = "Marte";
const ano = 2045;

// Exemplos prontos:
// console.log("Piloto: " + piloto);
// console.log("Velocidade: " + velocidade);

// Exiba planeta com o rótulo "Planeta: "


// Exiba ano com o rótulo "Ano: "
`,
    expectedOutput: [
      "$ node apresentacao.js",
      "Planeta: Marte",
      "Ano: 2045",
    ],
    hint: "Se baseie no exemplo pronto para resolver",
    dica: "Sempre que mencionado RÓTULO lembre do '+' console.log('Nome: ' + nome )",
  },

  // ── FASE 3: Funções ──────────────────────────────────────────────────────

  "1.7": {
    title: "Criando sua primeira função",
    xp: 80,
    filename: "funcao.js",
    explanations: [
    {
      title: "O que é uma função? 🧩",
      text: "Uma função é um bloco de código que recebe um nome. Em vez de escrever as mesmas instruções várias vezes, você pode colocá-las dentro de uma função e executá-las quando quiser.",
      code: `function decolar() {
  console.log("Pronto para decolar!");
}`,
    },
    {
      title: "Criar não é executar ⚠️",
      text: "Quando você cria uma função, o código dentro dela ainda não roda. O JavaScript apenas guarda as instruções para usar depois.",
      code: `function decolar() {
  console.log("Pronto para decolar!");
}

// Nada aparece ainda`,
    },
    {
      title: "Chamando a função ▶️",
      text: "Para executar uma função, escrevemos seu nome seguido de parênteses. Isso é chamado de 'chamar' ou 'invocar' a função.",
      code: `function decolar() {
  console.log("Pronto para decolar!");
}

decolar();

// Saída:
// Pronto para decolar!`,
    },
    {
      title: "Pense como um botão 🎮",
      text: "Você pode imaginar uma função como um botão. Criar a função é instalar o botão. Chamar a função é apertá-lo para executar a ação.",
      code: `function abrirPorta() {
  console.log("Porta aberta!");
}

abrirPorta();`,
    },
      {
        title: "Sua missão 🚀",
        text: "A função `decolar` já foi criada, mas está vazia. Escreva um `console.log` dentro dela e chame a função no final.",
      },
    ],
    starterCode: `// Módulo 1.7: Criando funções

function decolar() {
  // Exiba a mensagem: Pronto para decolar!

}

// Chame a função decolar aqui
`,
    expectedOutput: [
      "$ node funcao.js",
      "Pronto para decolar!",
    ],
    hint: "Dentro da função: console.log(\"Pronto para decolar!\"). Fora da função: decolar();",
    dica: "Lembre: o console.log vai dentro das { } da função. Para executar, chame o nome da função com (), exemplo, função() .",
  },

  "1.8": {
    title: "Chamando funções várias vezes",
    xp: 80,
    filename: "alerta.js",
    explanations: [
    {
      title: "Reutilizando código 🔁",
      text: "Uma das maiores vantagens das funções é evitar repetição. Você escreve o código uma única vez e pode executá-lo quantas vezes quiser.",
      code: `function dispararAlerta() {
  console.log("Alerta!");
}`,
    },
    {
      title: "A mesma função, várias execuções 🚨",
      text: "Cada vez que a função é chamada, todo o código dentro dela é executado novamente.",
      code: `function dispararAlerta() {
  console.log("Alerta!");
}

dispararAlerta();
dispararAlerta();
dispararAlerta();`,
    },
    {
      title: "Menos repetição, mais organização 📋",
      text: "Sem funções, precisaríamos copiar e colar o mesmo código várias vezes. Com funções, basta chamar o nome delas.",
      code: `function saudar() {
  console.log("Olá!");
}

saudar();
saudar();
saudar();`,
    },
      {
        title: "Sua missão 🚀",
        text: "A função `dispararAlerta` já está pronta. Sua tarefa é chamá-la 3 vezes.",
      },
    ],
    starterCode: `// Módulo 1.8: Chamando funções várias vezes

function dispararAlerta() {
  console.log("Alerta!");
}

// Chame a função três vezes
`,
    expectedOutput: [
      "$ node alerta.js",
      "Alerta!",
      "Alerta!",
      "Alerta!",
    ],
    hint: "Chame a função dispararAlerta(); três vezes, uma embaixo da outra.",
    dica: "Sempre que mencionado CHAMAR FUNÇÃO lembre que é o conteudo da 'function' neste caso dispararAlerta() na linha 3 ",
  },

  "1.9": {
    title: "Função com variável",
    xp: 85,
    filename: "missao.js",
    explanations: [
    {
      title: "Funções podem usar variáveis 🤝",
      text: "Uma função não precisa trabalhar sozinha. Ela pode acessar variáveis criadas fora dela e utilizar seus valores.",
      code: `const destino = "Lua";

function exibirDestino() {
  console.log(destino);
}`,
    },
    {
      title: "Misturando texto e variável 🏷️",
      text: "Dentro da função, podemos combinar textos fixos com valores armazenados em variáveis para criar mensagens mais informativas.",
      code: `const destino = "Lua";

function exibirDestino() {
  console.log("Destino: " + destino);
}`,
    },
    {
      title: "A variável continua existindo 🌎",
      text: "Mesmo estando fora da função, a variável pode ser utilizada dentro dela. O JavaScript procura a variável e usa o valor armazenado.",
      code: `const planeta = "Marte";

function mostrarPlaneta() {
  console.log(planeta);
}

mostrarPlaneta();`,
    },
    {
      title: "Funções ficam mais úteis 💡",
      text: "Ao combinar funções e variáveis, podemos criar comportamentos reutilizáveis que exibem ou manipulam informações do programa.",
      code: `const piloto = "Leo";

function exibirPiloto() {
  console.log("Piloto: " + piloto);
}

exibirPiloto();`,
    },
      {
        title: "Sua missão 🚀",
        text: "A variável `missao` já existe. Crie a função `exibirMissao` que exibe o valor dela com um rótulo, e chame a função.",
      },
    ],
    starterCode: `// Módulo 1.9: Função com variável

const missao = "Artemis";

// Crie a função exibirMissao(){} Dentro dos {}, use o rótulo para exibir: Missão: Artemis



// Chame a função
`,
    expectedOutput: [
      "$ node missao.js",
      "Missão: Artemis",
    ],
    hint: "Use function para criar uma função lembre dos {}, console.log para exibir e lembre do rótulo '+' ",
    dica: "Use o comando Function para criar uma função e lembre dos { } e coloque o console.log usando rótulo la dentro. console.log('Nome: ' + nome) ",
  },
};

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
    description: "Monte os dados da missão! Exiba a variável no formato 'rótulo: valor'.",
    hint: "Use console.log(\"nave: \" + nave) para cada variável — um console.log por linha.",
    starterCode: `const nave = "Apollo 11";

// Etapa 1: exiba a variável usando o rótulo

`,
    expectedOutput: [
      "$ node etapa-1.js",
      "Nave: Apollo 11",
    ],
    objectives: [
      "Exiba nave com o rótulo 'Nave: '",
    ],
  },
  {
    label: "Função",
    emoji: "🧩",
    filename: "etapa-2.js",
    description: "Crie a função exibirDados() com o console.log lá dentro e chame a função.",
    hint: "Use function para criar a função e lembre dos {} coloque o rótulo console.log('Nome: ' + nome) dentro dos {} depois chame a função",
    starterCode: `const combustivel = 100;

// Etapa 2: crie a função exibirDados()
// Dentro dela, exiba o combustivel com o rótulo "Combustivel: "
// No final, chame a função
`,
    expectedOutput: [
      "$ node etapa-2.js",
      "Combustivel: 100",
    ],
    objectives: [
      "Crie a função exibirDados()",
      "Exiba combustivel dentro da função",
      "Chame exibirDados() no final",
    ],
  },
  {
    label: "Tudo junto",
    emoji: "🚀",
    filename: "etapa-3.js",
    description: "Combine tudo! Use let para atualizar o combustível dentro de uma função e chame-a 3 vezes para ver o valor diminuir a cada uso.",
    hint: "Dentro da função usarCombustivel() insira console.log com o rótulo dentro dos {} — depois chame a função 3 vezes.",
    starterCode: `let combustivel = 100;

function usarCombustivel() {
  combustivel = combustivel - 30;
  // Exiba o combustivel restante com o rótulo "Combustivel: "
  
}

// Chame a função três vezes e veja o que acontece
`,
    expectedOutput: [
      "$ node etapa-3.js",
      "Combustivel: 70",
      "Combustivel: 40",
      "Combustivel: 10",
    ],
    objectives: [
      "Exiba o combustivel dentro da função com rótulo",
      "Chame usarCombustivel() três vezes",
    ],
  },
];
