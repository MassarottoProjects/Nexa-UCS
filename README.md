# NEXA

## Sobre o Projeto

O **NEXA** é uma plataforma web desenvolvida como projeto da disciplina de **Laboratório de Software** da **Universidade de Caxias do Sul (UCS)**.

O sistema tem como objetivo auxiliar estudantes iniciantes na área de desenvolvimento de software por meio de uma experiência gamificada de aprendizagem. A plataforma organiza o conteúdo em módulos, acompanha o progresso do usuário, concede experiência (XP), níveis e certificados, além de disponibilizar um ranking entre os participantes.

O projeto foi desenvolvido utilizando tecnologias modernas para aplicações web, priorizando uma interface intuitiva, boa experiência do usuário e arquitetura escalável.

---

## Funcionalidades

- Cadastro e autenticação de usuários;
- Perfil do estudante;
- Módulos organizados por conteúdo;
- Sistema de XP e níveis;
- Acompanhamento de progresso;
- Certificado de conclusão;
- Ranking de usuários;
- Laboratório para prática de exercícios.

---

## Tecnologias Utilizadas

### Front-end

- React
- TypeScript
- Vite
- React Router

### Interface

- Material UI (MUI)
- Radix UI
- Tailwind CSS

### Back-end e Banco de Dados

- Supabase

---

## Estrutura do Projeto

```
src/
│
├── app/
│   ├── components/
│   ├── data/
│   └── App.tsx
│
├── lib/
│
├── imports/
│
└── main.tsx
```

---

## Como Executar

### Pré-requisitos

- Node.js 18 ou superior
- npm

### Instalação

Clone o repositório:

```bash
git clone <url-do-repositório>
```

Entre na pasta do projeto:

```bash
cd Nexa
```

Instale as dependências:

```bash
npm install
```

Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

Após a execução, o sistema estará disponível em:

```
http://localhost:5173
```

---

## Arquitetura

O projeto segue uma arquitetura baseada em componentes, utilizando React para construção da interface e Supabase como serviço de autenticação e persistência de dados.

Os principais módulos do sistema são:

- Autenticação
- Perfil do usuário
- Roadmap
- Sistema de Progressão
- Ranking
- Certificado

---

## Gamificação

O NEXA utiliza elementos de gamificação para incentivar o aprendizado:

- Sistema de experiência (XP);
- Evolução por níveis;
- Conclusão de módulos;
- Ranking entre usuários.

---

## Equipe

Projeto desenvolvido para a disciplina de **Laboratório de Software** da **Universidade de Caxias do Sul (UCS)**.