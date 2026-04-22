# ChatClean — Sistema Financeiro

## Estrutura de arquivos

```
chatclean-sistema/
├── index.html          ← Página principal (HTML + estrutura)
├── style.css           ← Todos os estilos visuais
├── data.js             ← Dados iniciais (clientes, lançamentos, etc.)
├── app.js              ← Estado global, auth, navegação, utilitários
├── notifications.js    ← Alertas de vencimento, WhatsApp, E-mail
├── dashboard.js        ← Dashboard, KPIs, gráfico donut e barras
├── lancamentos.js      ← Lançamentos financeiros (fixos/variáveis/despesas)
├── clientes.js         ← Gestão de clientes recorrentes
├── retiradas.js        ← Retiradas de sócios + comparativo mensal
└── modals.js           ← Modais, formulários e gestão de usuários
```

## Acesso demo
| Perfil     | Login        | Senha      | Permissões              |
|------------|-------------|------------|-------------------------|
| Admin      | admin        | admin123   | Tudo, incluindo usuários |
| Financeiro | financeiro   | fin2026    | Editar e criar registros |
| Usuário    | usuario      | view2026   | Somente visualização    |

## Hospedagem
Basta fazer o upload de todos os arquivos para qualquer servidor web estático
(Netlify, Vercel, GitHub Pages, VPS com Nginx/Apache).

Garanta que **todos os arquivos estejam na mesma pasta** e que o servidor
sirva `index.html` como página padrão.

## Dados
Os dados são persistidos no `localStorage` do navegador.
Para resetar, abra o console e execute: `localStorage.clear()`
