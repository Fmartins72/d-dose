# D-Dose — Registro do Projeto

Este arquivo é a memória do projeto. Ele é atualizado ao final de cada etapa concluída do protocolo definido em `CLAUDE.md` (ver `C:\Users\flavi\Downloads\CLAUDE.md`). Releia-o no início de cada nova sessão de trabalho.

## Etapa 1 — Ideação e Definição do Problema ✅

**Problema:** cálculo da dose de fosfina em expurgos e diluição de produtos de desinsetização.

**Público-alvo:** operadores e aplicadores.

**Soluções existentes:** sites de revendedores de fosfina oferecem calculadoras, mas cada uma é restrita ao produto da própria marca.

**Proposta de valor:** democratizar o cálculo de dose de fosfina e de produtos de desinsetização de qualquer marca (não só de um revendedor específico) — com todas as informações reunidas em um único app, algo que hoje não existe no mercado.

**Nome do projeto:** D-Dose

**Local do projeto:** `C:\Users\flavi\Desktop\Projetos\D-Dose`

---

## Etapa 2 — Planejamento e Requisitos ✅

**Funcionalidades essenciais do MVP:**

1. **Cadastro de grãos/culturas** — nome da cultura, densidade aparente (kg/m³), peso da saca (kg). Base para todos os cálculos de grãos.

2. **Expurgo** — operador seleciona o grão já cadastrado, informa a quantidade em sacas OU toneladas, e o app calcula automaticamente a quantidade de fosfina (kg) necessária.

3. **Volume m³ (Silo)** — operador seleciona a cultura, informa diâmetro do silo, altura dos grãos e altura do cone (quando houver), e o app calcula: toneladas, sacas, volume (m³) e quantidade de fumigante (kg), com base na dosagem de referência (ex: 6 g/m³).

4. **Pilha m³** — mesma lógica do item 3, mas para pilhas de grãos: operador informa comprimento, largura e altura; o app calcula toneladas, sacas, volume (m³) e quantidade de fumigante.

5. **Cadastro de pragas/insetos** — organizado por classe: Insetos Rasteiros, Insetos Voadores, Demais Pragas, Grãos Armazenados. Entidade própria (não embutida no cadastro do produto), permitindo que uma praga tenha vários produtos associados e um produto sirva a mais de uma praga.

6. **Cadastro de produtos líquidos de desinsetização** — produto, praga(s) relacionada(s) (referência ao cadastro do item 5), área tratada e quadro de diluição conforme bula (ex: mL de produto por litros de água por m² tratado).

7. **Fluxo de diluição** — o operador segue o caminho natural de uso em campo: seleciona a classe do inseto → seleciona a praga específica → o app mostra o(s) produto(s) cadastrado(s) para aquela praga → operador informa OU a área (m²) desejada OU a quantidade de produto que pretende usar → o app calcula automaticamente o outro lado (quantidade de produto + diluição em água, ou área que aquela quantidade cobre).

8. **Avisos legais** — o app deve exibir avisos sobre uso restrito a aplicadores habilitados, isenção de responsabilidade sobre os cálculos e orientação para seguir a bula/EPI do produto.

**Fora do MVP:** histórico de cálculos, login/conta de usuário, dados pessoais, pagamentos.

**Prazo:** sem urgência definida.

**Dados sensíveis:** nenhum. O app não terá login nem armazenará dados de usuário — uso é anônimo, focado em cálculo rápido em campo.

**Requisitos legais/privacidade:** avisos legais de uso restrito e isenção de responsabilidade (ver item 8 do MVP). Sem dados pessoais, não há requisitos de LGPD aplicáveis por ora.

**Contexto de uso:** ferramenta pensada para uso dinâmico em campo pelos operadores — fluxo simples, poucos campos, cálculo imediato.

Registrado com base em referências visuais fornecidas (telas de app similar com abas Expurgo / Volume m³ / Pilha m³ / categorias de pragas, e rótulo de produto Bergard como exemplo de dados de bula).

## Etapa 3 — Design e Prototipação ✅

**Telas principais:**

1. **Dashboard** — tela inicial, atalhos para Expurgo, Diluições e Cadastros.
2. **Expurgo** — 3 sub-abas: Expurgo (sacas/toneladas), Volume m³ (silo: diâmetro + altura dos grãos + altura do cone), Pilha m³ (comprimento + largura + altura). Cada uma calcula toneladas, sacas, volume e quantidade de fosfina.
3. **Diluições** — fluxo em 3 passos: classe do inseto (Insetos Rasteiros, Insetos Voadores, Demais Pragas, Grãos Armazenados) → praga específica → produto cadastrado → m² ou quantidade de produto → resultado.
4. **Lista/Cadastros** — gerenciamento (CRUD) de grãos, pragas e produtos.
5. **Avisos legais** — acessível via tela "Sobre" ou aviso de abertura.

**Navegação:** barra inferior fixa com 4 ícones — Dashboard | Expurgo | Diluições | Lista.

**Estilo visual:**

- **Tema claro como padrão** (prioridade: legibilidade em campo, sob luz solar direta — alto contraste segura melhor a leitura ao ar livre do que tema escuro). **Tema escuro disponível como opção** via alternância manual (ícone sol/lua), preferência salva localmente no aparelho (sem login).
- **Paleta tema claro:** fundo `#F7F6F2`, superfície `#FFFFFF`, texto `#1A1D1B`, módulo Grãos (âmbar) `#B8842A`, módulo Diluições (teal) `#1C6E8C`, alerta/aviso legal (amarelo-segurança) `#E0A400`.
- **Paleta tema escuro:** fundo `#15181A`, superfície `#1F2326`, texto `#F2F1ED`, mesmos acentos clareados para manter contraste.
- **Tipografia:** fonte utilitária robusta com algarismos tabulares (Inter ou IBM Plex Sans), peso Bold/Black nos números de resultado (elemento mais importante da tela).
- **Elemento de identidade:** cor do módulo (âmbar = Grãos, teal = Diluições) aplicada de forma consistente na navegação, cabeçalhos e cards de resultado, para orientação rápida do operador em campo.
- Áreas de toque grandes, pensadas para uso com luvas/pressa em campo.

Base: telas de referência trazidas pelo usuário (estrutura de navegação e fluxo de diluição por classe de inseto) + recomendação de design considerando uso majoritariamente outdoor.

## Etapa 4 — Escolha da Stack Tecnológica ✅

- **Tipo de aplicativo:** web responsivo (acessado via navegador, incluindo celular). Sem app nativo/loja por enquanto.
- **Frontend:** React + TypeScript + Vite, estilização com Tailwind CSS.
- **Backend/Banco de dados:** Supabase (Postgres). Tabelas para grãos, pragas, produtos e relação praga↔produto.
- **Segurança dos dados (RLS):** leitura do catálogo liberada para todos (sem login), escrita restrita ao usuário admin autenticado.
- **Autenticação:** Supabase Auth, usada exclusivamente para o painel administrativo (o usuário do projeto). Operadores em campo nunca fazem login.
- **Painel administrativo:** dentro do mesmo projeto/app, em rota protegida (ex: `/admin`), não é um projeto separado.
- **Hospedagem do frontend:** Vercel.
- **Uso offline:** não é requisito — assume-se conexão disponível no momento do uso.

Usuário já pretende usar Supabase e pediu apoio na configuração — isso será conduzido na Etapa 5.

## Etapa 5 — Configuração do Ambiente e Infraestrutura ✅

- **Repositório Git:** local (`git init`) + remoto em `https://github.com/Fmartins72/d-dose.git`, branch `main`, primeiro commit enviado.
- **Scaffold do frontend:** Vite + React + TypeScript, Tailwind CSS v4 (via `@tailwindcss/vite`), tokens de tema (claro/escuro) da Etapa 3 aplicados em `src/index.css`.
- **Cliente Supabase:** `@supabase/supabase-js` instalado, cliente configurado em `src/lib/supabaseClient.ts`, lendo `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` do `.env`.
- **Projeto Supabase:** criado pelo usuário (`mshpitftbijlutxbklcr`). URL do projeto e chave `anon public` configuradas em `.env` local (arquivo git-ignorado). `.env.example` versionado como referência, sem valores reais.
- **Ambientes:** apenas um ambiente por enquanto (produção/dev único); separação fica para quando houver necessidade real (decisão da Etapa 4).
- **Build verificado:** `npm run build` executa sem erros com a configuração atual.

Ainda pendente para as próximas etapas: modelagem das tabelas no Supabase (grãos, pragas, produtos, relação praga↔produto) e políticas de RLS — isso será conduzido já como parte da Etapa 6 (Desenvolvimento), por ser trabalho de implementação da aplicação em si.

## Etapa 6 — Desenvolvimento ✅

Ordem de implementação seguida (confirmada antes de começar):

1. Base do app — roteamento, layout, navegação inferior, alternância de tema claro/escuro.
2. Modelagem do banco de grãos (Supabase) + RLS.
3. Painel admin — autenticação (Supabase Auth) + CRUD de grãos.
4. Expurgo — cálculo por sacas/toneladas.
5. Volume m³ (Silo) — cilindro + cone opcional.
6. Pilha m³ — comprimento × largura × altura.
7. Modelagem do banco de pragas e produtos (`pragas`, `produtos`, `produto_pragas`) + RLS.
8. Painel admin — CRUD de pragas e produtos, com diluição por praga/método de aplicação (incluindo tipo de diluente — água ou óleo mineral, ex: FOG).
9. Fluxo de Diluições — classe do inseto → praga → produto/método → cálculo (área ou quantidade de produto).
10. Avisos legais — modal de aceite no primeiro acesso + página `/aviso-legal`.
11. Lista — catálogo de consulta somente leitura (grãos e produtos/diluições), acessível sem login.
12. Dashboard — atalhos para Expurgo, Diluições e Lista.

Ajustes feitos durante o desenvolvimento:
- `index.html` com `lang="pt-BR"` (evitar tradução automática do navegador alterando texto da UI).
- Campo "tipo de diluente" adicionado a `produto_pragas` (nem todo produto usa água — FOG usa óleo mineral).
- "Método de aplicação" virou um seletor com opções padronizadas (Pulverização, Termonebulização/FOG, UBV, Aspersão, Polvilhamento, Iscagem) + opção "Outro".
- Ícones de classe de praga trocados de lucide-react para Game Icons (`react-icons/gi`) — visual mais sóbrio.
- Cor do módulo Grãos/Expurgo trocada de âmbar para verde musgo (`#4b7a3e`).
- Cor neutra fixa (`#5b6470`) para o item "Lista", evitando ícone branco sobre fundo quase branco no tema escuro.

Todas as 8 funcionalidades do MVP definidas na Etapa 2 estão implementadas e testadas manualmente pelo usuário durante o desenvolvimento (build sem erros a cada etapa).

## Etapa 7 — Testes
_Em aberto._

## Etapa 8 — Lançamento (Deploy)
_Em aberto._

## Etapa 9 — Pós-lançamento
_Em aberto._
