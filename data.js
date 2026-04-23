// ============================================================
// data.js v3 — Dados iniciais ChatClean
// ============================================================

// ── Receitas base estimadas por mês ────────────────────────
const RECEITAS_BASE = {
  Janeiro:28000, Fevereiro:29500, Março:31000,
  Abril:37358,   Maio:24675,      Junho:23105
};

// ── Meses ───────────────────────────────────────────────────
const MESES_LIST = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];

// ── Canais de aquisição ─────────────────────────────────────
const CANAIS_DEFAULT = [
  {id:'c1', nome:'Indicação',    cor:'#00d68f', icon:'🤝'},
  {id:'c2', nome:'Tráfego Pago', cor:'#3b9eff', icon:'📢'},
  {id:'c3', nome:'Evento',       cor:'#b06aff', icon:'🎪'},
  {id:'c4', nome:'Orgânico',     cor:'#ffb020', icon:'🌱'},
  {id:'c5', nome:'Parceiro',     cor:'#00cfff', icon:'🤲'},
  {id:'c6', nome:'Outro',        cor:'#5a7090', icon:'📌'},
];

// ── Etapas CRM ──────────────────────────────────────────────
const CRM_ETAPAS_DEFAULT = [
  {id:'e1', nome:'Lead',           cor:'#3b9eff', ordem:0},
  {id:'e2', nome:'Proposta',       cor:'#ffb020', ordem:1},
  {id:'e3', nome:'Negociação',     cor:'#b06aff', ordem:2},
  {id:'e4', nome:'Contrato',       cor:'#00cfff', ordem:3},
  {id:'e5', nome:'Implantação',    cor:'#ff6ab0', ordem:4},
  {id:'e6', nome:'Ativo',          cor:'#00d68f', ordem:5},
];

// ── Vendedores ──────────────────────────────────────────────
const VENDEDORES_DEFAULT = [
  {id:'v1', nome:'Albert',   email:'albert@chatclean.com.br',   ativo:true},
  {id:'v2', nome:'Milton',   email:'milton@chatclean.com.br',   ativo:true},
  {id:'v3', nome:'Augusto',  email:'augusto@chatclean.com.br',  ativo:true},
  {id:'v4', nome:'Eric',     email:'eric@chatclean.com.br',     ativo:true},
  {id:'v5', nome:'Lampião',  email:'lampiao@chatclean.com.br',  ativo:true},
  {id:'v6', nome:'Ederson',  email:'ederson@chatclean.com.br',  ativo:true},
];

// ── Metas de vendas ─────────────────────────────────────────
const METAS_DEFAULT = [
  {id:'m1', vendedorId:'v1', mes:'Abril', meta:15000},
  {id:'m2', vendedorId:'v2', mes:'Abril', meta:12000},
  {id:'m3', vendedorId:'v3', mes:'Abril', meta:10000},
  {id:'m4', vendedorId:'v4', mes:'Abril', meta:8000},
  {id:'m5', vendedorId:'v5', mes:'Abril', meta:10000},
  {id:'m6', vendedorId:'v1', mes:'Março', meta:14000},
  {id:'m7', vendedorId:'v2', mes:'Março', meta:11000},
];

// ── Lançamentos financeiros ─────────────────────────────────
const LANC_INIT = [
  {id:1,  desc:'FABRICIO',                tipo:'FIXO',    mes:'Abril', valor:1499.43, status:'PAGO'},
  {id:2,  desc:'GUSTAVO',                 tipo:'FIXO',    mes:'Abril', valor:800.00,  status:'PAGO'},
  {id:3,  desc:'MARIANA',                 tipo:'FIXO',    mes:'Abril', valor:1000.00, status:'PAGO'},
  {id:4,  desc:'ALBERT',                  tipo:'FIXO',    mes:'Abril', valor:10014.83,status:'PAGO'},
  {id:5,  desc:'AUGUSTO',                 tipo:'FIXO',    mes:'Abril', valor:3235.77, status:'PAGO'},
  {id:6,  desc:'SALA',                    tipo:'FIXO',    mes:'Abril', valor:2000.00, status:'PAGO'},
  {id:7,  desc:'INTERNET',                tipo:'FIXO',    mes:'Abril', valor:61.49,   status:'PAGO'},
  {id:8,  desc:'AJUDA DE CUSTO - FABRICIO',tipo:'FIXO',  mes:'Abril', valor:300.00,  status:'PAGO'},
  {id:9,  desc:'AJUDA DE CUSTO - AUGUSTO', tipo:'FIXO',  mes:'Abril', valor:200.00,  status:'PAGO'},
  {id:10, desc:'FGTS',                    tipo:'FIXO',    mes:'Abril', valor:129.68,  status:'PAGO'},
  {id:11, desc:'INSS',                    tipo:'FIXO',    mes:'Abril', valor:121.57,  status:'PAGO'},
  {id:12, desc:'RH SER',                  tipo:'FIXO',    mes:'Abril', valor:80.00,   status:'PAGO'},
  {id:13, desc:'ADRIANA (PARCELAMENTO)',  tipo:'FIXO',    mes:'Abril', valor:354.77,  status:'PAGO'},
  {id:14, desc:'IMPOSTO (PARCELAMENTO)',  tipo:'FIXO',    mes:'Abril', valor:316.26,  status:'PAGO'},
  {id:15, desc:'VECTAX (PARCELAMENTO)',   tipo:'FIXO',    mes:'Abril', valor:1061.95, status:'PAGO'},
  {id:16, desc:'CARBONE',                 tipo:'FIXO',    mes:'Abril', valor:1000.00, status:'PAGO'},
  {id:17, desc:'VECTAX (white label)',    tipo:'VARIÁVEL',mes:'Abril', valor:7417.00, status:'PAGO'},
  {id:18, desc:'LIMPEZA',                 tipo:'VARIÁVEL',mes:'Abril', valor:133.33,  status:'PAGO'},
  {id:19, desc:'IMPOSTOS MENSAL',         tipo:'VARIÁVEL',mes:'Abril', valor:331.49,  status:'PAGO'},
  {id:20, desc:'CHATGPT',                 tipo:'VARIÁVEL',mes:'Abril', valor:120.00,  status:'PAGO'},
  {id:21, desc:'TRAFEGO',                 tipo:'VARIÁVEL',mes:'Abril', valor:1600.00, status:'PAGO'},
  {id:22, desc:'COMISSÃO CARLA GOMES',   tipo:'VARIÁVEL',mes:'Abril', valor:393.60,  status:'PAGO'},
  {id:23, desc:'COMISSÃO ALAN',           tipo:'VARIÁVEL',mes:'Abril', valor:200.55,  status:'PAGO'},
  {id:24, desc:'VECTAX - TOKENS',         tipo:'VARIÁVEL',mes:'Abril', valor:375.00,  status:'PAGO'},
  {id:25, desc:'WISHBONÊS',               tipo:'DESPESA', mes:'Abril', valor:120.00,  status:'PAGO'},
  {id:26, desc:'MIRANDA COMPUTAÇÃO',      tipo:'DESPESA', mes:'Abril', valor:268.80,  status:'PAGO'},
  {id:27, desc:'CACAU SHOW',              tipo:'DESPESA', mes:'Abril', valor:179.94,  status:'PAGO'},
  {id:28, desc:'UBER',                    tipo:'DESPESA', mes:'Abril', valor:19.99,   status:'PAGO'},
  {id:29, desc:'EVENTO CARBONE',          tipo:'DESPESA', mes:'Abril', valor:86.80,   status:'PAGO'},
  {id:30, desc:'ANIVERSARIO ALBERT',      tipo:'DESPESA', mes:'Abril', valor:135.49,  status:'PAGO'},
  {id:31, desc:'REUNIÃO EM CAMPINA',      tipo:'DESPESA', mes:'Abril', valor:881.72,  status:'PAGO'},
  // Meses anteriores
  {id:50, desc:'FABRICIO',  tipo:'FIXO',    mes:'Janeiro',   valor:1499.43,status:'PAGO'},
  {id:51, desc:'ALBERT',    tipo:'FIXO',    mes:'Janeiro',   valor:10014.83,status:'PAGO'},
  {id:52, desc:'AUGUSTO',   tipo:'FIXO',    mes:'Janeiro',   valor:3235.77,status:'PAGO'},
  {id:53, desc:'VECTAX (white label)',tipo:'VARIÁVEL',mes:'Janeiro',valor:6559.00,status:'PAGO'},
  {id:54, desc:'FABRICIO',  tipo:'FIXO',    mes:'Fevereiro', valor:1499.43,status:'PAGO'},
  {id:55, desc:'ALBERT',    tipo:'FIXO',    mes:'Fevereiro', valor:10014.83,status:'PAGO'},
  {id:56, desc:'VECTAX (white label)',tipo:'VARIÁVEL',mes:'Fevereiro',valor:6277.00,status:'PAGO'},
  {id:57, desc:'FABRICIO',  tipo:'FIXO',    mes:'Março',     valor:1499.43,status:'PAGO'},
  {id:58, desc:'ALBERT',    tipo:'FIXO',    mes:'Março',     valor:10014.83,status:'PAGO'},
  {id:59, desc:'VECTAX (white label)',tipo:'VARIÁVEL',mes:'Março',valor:6835.00,status:'PAGO'},
];

// ── Receitas extras (variáveis / implantações) ──────────────
const RECEITAS_EXTRA_INIT = [
  {id:1, desc:'Implantação - Bones Ramalho',  tipo:'implantacao', valor:2400,  mes:'Abril',     vendedorId:'v5', canalId:'c1', data:'2026-04-05'},
  {id:2, desc:'Venda IA - Grupo Dura mais',    tipo:'ia',          valor:1800,  mes:'Abril',     vendedorId:'v1', canalId:'c2', data:'2026-04-12'},
  {id:3, desc:'Implantação - LD Brazil',       tipo:'implantacao', valor:3000,  mes:'Março',     vendedorId:'v3', canalId:'c1', data:'2026-03-15'},
  {id:4, desc:'Venda Metrics - TV Tropical',   tipo:'metrics',     valor:1200,  mes:'Março',     vendedorId:'v1', canalId:'c3', data:'2026-03-20'},
  {id:5, desc:'Implantação - R A Center',      tipo:'implantacao', valor:1425,  mes:'Abril',     vendedorId:'v1', canalId:'c2', data:'2026-04-18'},
  {id:6, desc:'Venda IA - Lauto Cargo',        tipo:'ia',          valor:950,   mes:'Fevereiro', vendedorId:'v2', canalId:'c1', data:'2026-02-10'},
  {id:7, desc:'Implantação - Avelloz',         tipo:'implantacao', valor:2000,  mes:'Abril',     vendedorId:'v3', canalId:'c3', data:'2026-04-22'},
];

// ── Clientes ────────────────────────────────────────────────
const CLI_INIT = [
  {id:1, nome:'Neo Couros',cnpj:'',resp:'GUSTAVO',tel:'84 99955-6666',email:'',vend:'Albert',vendedorId:'v1',mensal:410,dia:13,status:'ativo',canal:'c1',obs:'',inicio:'2025-06-01',aniversario:'',contratoStatus:'assinado',crmEtapa:'e6'},
  {id:2, nome:'Ideale Soluções em Beneficios',cnpj:'59.905.065/0001-30',resp:'MARINA',tel:'84 99895-2425',email:'marina@ideale.com.br',vend:'Albert',vendedorId:'v1',mensal:690,dia:13,status:'ativo',canal:'c2',obs:'',inicio:'2025-07-01',aniversario:'1990-03-15',contratoStatus:'assinado',crmEtapa:'e6'},
  {id:3, nome:'M.M. FILHO',cnpj:'14.763.251/0001-32',resp:'Vitor',tel:'84 98817-1254',email:'',vend:'Albert',vendedorId:'v1',mensal:790,dia:14,status:'ativo',canal:'c1',obs:'',inicio:'2025-08-01',aniversario:'',contratoStatus:'assinado',crmEtapa:'e6'},
  {id:4, nome:'Olho Vivo',cnpj:'33.419.829/0001-82',resp:'IGOR',tel:'84 99937-0012',email:'',vend:'Albert',vendedorId:'v1',mensal:250,dia:14,status:'ativo',canal:'c3',obs:'',inicio:'2025-08-01',aniversario:'1985-04-22',contratoStatus:'assinado',crmEtapa:'e6'},
  {id:5, nome:'Nóbrega e Pessoa Médicos',cnpj:'32.289.776/0001-60',resp:'LISIEUX',tel:'84 99696-9594',email:'',vend:'Albert',vendedorId:'v1',mensal:490,dia:17,status:'ativo',canal:'c1',obs:'',inicio:'2025-08-01',aniversario:'',contratoStatus:'assinado',crmEtapa:'e6'},
  {id:6, nome:'LIGA DOOH',cnpj:'50.808.895/0001-63',resp:'WESLEY',tel:'84 99606-4800',email:'wesley@ligadooh.com',vend:'Milton',vendedorId:'v2',mensal:1410,dia:17,status:'ativo',canal:'c2',obs:'',inicio:'2025-05-01',aniversario:'1988-04-28',contratoStatus:'assinado',crmEtapa:'e6'},
  {id:7, nome:'TV Tropical',cnpj:'10.702.082/0001-70',resp:'NEY KELSEN',tel:'84 99953-5756',email:'',vend:'Albert',vendedorId:'v1',mensal:750,dia:17,status:'ativo',canal:'c3',obs:'',inicio:'2026-02-01',aniversario:'',contratoStatus:'assinado',crmEtapa:'e6'},
  {id:8, nome:'Dona Beta Festa São Jose',cnpj:'22.092.638/0001-32',resp:'CAROLINE',tel:'84 99992-6970',email:'',vend:'Albert',vendedorId:'v1',mensal:250,dia:18,status:'ativo',canal:'c1',obs:'',inicio:'2025-07-01',aniversario:'1992-04-05',contratoStatus:'assinado',crmEtapa:'e6'},
  {id:9, nome:'Dona Beta Festa Parnamirim',cnpj:'51.922.952/0001-01',resp:'CAROLINE',tel:'85 99992-6970',email:'',vend:'Albert',vendedorId:'v1',mensal:500,dia:18,status:'ativo',canal:'c1',obs:'',inicio:'2025-07-01',aniversario:'',contratoStatus:'assinado',crmEtapa:'e6'},
  {id:10,nome:'Dona Beta Festa Macaiba',cnpj:'22.092.638/0004-85',resp:'CAROLINE',tel:'86 99992-6970',email:'',vend:'Albert',vendedorId:'v1',mensal:250,dia:18,status:'ativo',canal:'c1',obs:'',inicio:'2025-07-01',aniversario:'',contratoStatus:'assinado',crmEtapa:'e6'},
  {id:11,nome:'CARTÓRIO SÃO BENTO',cnpj:'08.560.633/0001-66',resp:'JOSI CARLA',tel:'83 99922-9073',email:'',vend:'Milton',vendedorId:'v2',mensal:500,dia:20,status:'ativo',canal:'c1',obs:'',inicio:'2025-05-01',aniversario:'',contratoStatus:'assinado',crmEtapa:'e6'},
  {id:12,nome:'Terra Invest Imóveis',cnpj:'07.812.213/0001-67',resp:'STANLEY',tel:'84 99986-5616',email:'',vend:'Albert',vendedorId:'v1',mensal:680,dia:20,status:'ativo',canal:'c1',obs:'',inicio:'2025-06-01',aniversario:'',contratoStatus:'aguardando',crmEtapa:'e6'},
  {id:13,nome:'Natal Car Seminovos',cnpj:'03.817.784/0001-33',resp:'ADRIANO',tel:'84 99483-5005',email:'',vend:'Milton',vendedorId:'v2',mensal:360,dia:21,status:'cancelado',canal:'c2',obs:'Solicitou cancelamento',inicio:'2025-05-01',aniversario:'',contratoStatus:'assinado',crmEtapa:'e6'},
  {id:14,nome:'Up Energy',cnpj:'41.576.237/0001-00',resp:'YGOR',tel:'84 99198-5294',email:'',vend:'Albert',vendedorId:'v1',mensal:425,dia:22,status:'ativo',canal:'c2',obs:'',inicio:'2025-06-01',aniversario:'1991-04-10',contratoStatus:'assinado',crmEtapa:'e6'},
  {id:15,nome:'PETSTOP',cnpj:'16.981.081/0001-98',resp:'GUILHERME',tel:'',email:'',vend:'Albert',vendedorId:'v1',mensal:0,dia:22,status:'congelado',canal:'c2',obs:'SISTEMA CONGELADO',inicio:'2025-08-01',aniversario:'',contratoStatus:'assinado',crmEtapa:'e6'},
  {id:16,nome:'Guaraves',cnpj:'12.727.145/0001-78',resp:'',tel:'',email:'',vend:'Milton',vendedorId:'v2',mensal:990,dia:22,status:'ativo',canal:'c1',obs:'',inicio:'2026-01-01',aniversario:'',contratoStatus:'assinado',crmEtapa:'e6'},
  {id:17,nome:'IupConcept',cnpj:'48.080.627/0001-26',resp:'LUCAS',tel:'19 99819-8040',email:'lucas@iupconcept.com',vend:'Augusto',vendedorId:'v3',mensal:600,dia:23,status:'ativo',canal:'c3',obs:'',inicio:'2025-07-01',aniversario:'',contratoStatus:'assinado',crmEtapa:'e6'},
  {id:18,nome:'Lorge Escolas',cnpj:'24.207.268/0001-67',resp:'ARTHUR',tel:'84 99988-1400',email:'',vend:'Milton',vendedorId:'v2',mensal:0,dia:24,status:'ativo',canal:'c1',obs:'PERMUTA',inicio:'2025-04-01',aniversario:'',contratoStatus:'assinado',crmEtapa:'e6'},
  {id:19,nome:'Bright Coworking',cnpj:'04.075.031/0001-62',resp:'BRUNO',tel:'86 98884-9691',email:'',vend:'Albert',vendedorId:'v1',mensal:560,dia:27,status:'ativo',canal:'c5',obs:'',inicio:'2025-06-01',aniversario:'',contratoStatus:'assinado',crmEtapa:'e6'},
  {id:20,nome:'Teatcher American House',cnpj:'36.157.371/0001-29',resp:'VINICIUS',tel:'15 99861-1956',email:'',vend:'Albert',vendedorId:'v1',mensal:310,dia:27,status:'ativo',canal:'c1',obs:'',inicio:'2025-06-01',aniversario:'',contratoStatus:'assinado',crmEtapa:'e6'},
  {id:21,nome:'Dra Andrea',cnpj:'027.343.754-27',resp:'Andrea',tel:'84 99418-9376',email:'andrea@clinica.com',vend:'Albert',vendedorId:'v1',mensal:490,dia:28,status:'ativo',canal:'c1',obs:'',inicio:'2026-02-01',aniversario:'1980-04-18',contratoStatus:'aguardando',crmEtapa:'e5'},
  {id:22,nome:'All Sol',cnpj:'42.518.541/0001-56',resp:'Lucas/Joana',tel:'84 99401-1050',email:'',vend:'Albert',vendedorId:'v1',mensal:0,dia:28,status:'ativo',canal:'c1',obs:'Pagou o ano todo',inicio:'2026-02-01',aniversario:'',contratoStatus:'assinado',crmEtapa:'e6'},
  {id:23,nome:'Vitrine Baby',cnpj:'40.240.834/0001-99',resp:'NARA',tel:'83 99902-2824',email:'',vend:'Milton',vendedorId:'v2',mensal:700,dia:29,status:'ativo',canal:'c3',obs:'',inicio:'2025-06-01',aniversario:'1994-04-25',contratoStatus:'assinado',crmEtapa:'e6'},
  {id:24,nome:'FS STORE',cnpj:'42.843.204/0001-34',resp:'FAGNER',tel:'11 94830-8410',email:'',vend:'Eric',vendedorId:'v4',mensal:750,dia:2,status:'ativo',canal:'c2',obs:'',inicio:'2025-07-01',aniversario:'',contratoStatus:'assinado',crmEtapa:'e6'},
  {id:25,nome:'Lauto Cargo',cnpj:'07.189.258/0001-71',resp:'PRISCILA',tel:'84 99816-0826',email:'priscila@lauto.com.br',vend:'Milton',vendedorId:'v2',mensal:1750,dia:20,status:'ativo',canal:'c1',obs:'',inicio:'2025-05-01',aniversario:'',contratoStatus:'assinado',crmEtapa:'e6'},
  {id:26,nome:'LD BRAZIL/Kayro Rocha',cnpj:'43.945.113/0001-72',resp:'Kayro Rocha',tel:'65 99932-3697',email:'',vend:'Augusto',vendedorId:'v3',mensal:2100,dia:2,status:'ativo',canal:'c3',obs:'',inicio:'2026-03-01',aniversario:'',contratoStatus:'assinado',crmEtapa:'e6'},
  {id:27,nome:'Instituto de Endoscopia',cnpj:'08.455.255/0001-50',resp:'',tel:'84 99999-0000',email:'iednatal@gmail.com',vend:'Albert',vendedorId:'v1',mensal:490,dia:3,status:'ativo',canal:'c1',obs:'',inicio:'2026-02-01',aniversario:'',contratoStatus:'assinado',crmEtapa:'e6'},
  {id:28,nome:'Wish Bones',cnpj:'48.242.395/0001-65',resp:'JORHANNA',tel:'83 99952-9436',email:'',vend:'Albert',vendedorId:'v1',mensal:1400,dia:4,status:'ativo',canal:'c1',obs:'',inicio:'2025-07-01',aniversario:'',contratoStatus:'assinado',crmEtapa:'e6'},
  {id:29,nome:'BONES RAMALHO',cnpj:'46.553.283/0001-08',resp:'JUNIOR',tel:'84 99992-3008',email:'',vend:'Lampião',vendedorId:'v5',mensal:1230,dia:5,status:'ativo',canal:'c1',obs:'',inicio:'2025-04-01',aniversario:'1987-04-15',contratoStatus:'assinado',crmEtapa:'e6'},
  {id:30,nome:'Bets.bet',cnpj:'',resp:'CLAUDIO',tel:'84 99968-9114',email:'',vend:'Milton',vendedorId:'v2',mensal:350,dia:7,status:'ativo',canal:'c2',obs:'',inicio:'2025-07-01',aniversario:'',contratoStatus:'assinado',crmEtapa:'e6'},
  {id:31,nome:'Sem Etiqueta',cnpj:'26.457.330/0001-02',resp:'CAUE',tel:'84 99610-4440',email:'',vend:'Eric',vendedorId:'v4',mensal:700,dia:7,status:'ativo',canal:'c2',obs:'',inicio:'2025-07-01',aniversario:'',contratoStatus:'assinado',crmEtapa:'e6'},
  {id:32,nome:'Grupo Dura mais',cnpj:'22.707.575/0001-03',resp:'EDERSON',tel:'84 99970-0040',email:'',vend:'Ederson',vendedorId:'v6',mensal:1500,dia:8,status:'ativo',canal:'c1',obs:'',inicio:'2025-04-01',aniversario:'',contratoStatus:'assinado',crmEtapa:'e6'},
  {id:33,nome:'Odonto Unic',cnpj:'39.435.120/0001-57',resp:'MARIANA',tel:'84 99608-5222',email:'',vend:'Albert',vendedorId:'v1',mensal:600,dia:9,status:'ativo',canal:'c3',obs:'',inicio:'2025-07-01',aniversario:'',contratoStatus:'assinado',crmEtapa:'e6'},
  {id:34,nome:'Polo Club Planalto',cnpj:'28.471.193/0001-88',resp:'',tel:'',email:'',vend:'Augusto',vendedorId:'v3',mensal:0,dia:9,status:'congelado',canal:'c1',obs:'',inicio:'2025-09-01',aniversario:'',contratoStatus:'assinado',crmEtapa:'e6'},
  {id:35,nome:'Teixeira Construções',cnpj:'',resp:'Luiz Pedro',tel:'83 98115-6158',email:'',vend:'Albert',vendedorId:'v1',mensal:490,dia:10,status:'ativo',canal:'c1',obs:'',inicio:'2026-04-01',aniversario:'',contratoStatus:'aguardando',crmEtapa:'e5'},
  {id:36,nome:'Avelloz Campina',cnpj:'',resp:'Eduardo',tel:'83 98843-9856',email:'',vend:'Augusto',vendedorId:'v3',mensal:624,dia:17,status:'ativo',canal:'c3',obs:'',inicio:'2026-04-01',aniversario:'1989-04-08',contratoStatus:'assinado',crmEtapa:'e6'},
  {id:37,nome:'R A Center Copi',cnpj:'03.575.253/0001-81',resp:'Alvaro',tel:'',email:'',vend:'Albert',vendedorId:'v1',mensal:850,dia:14,status:'ativo',canal:'c2',obs:'',inicio:'2026-04-01',aniversario:'',contratoStatus:'assinado',crmEtapa:'e6'},
  {id:38,nome:'Seven Silk',cnpj:'',resp:'Samir',tel:'',email:'',vend:'',vendedorId:'',mensal:490,dia:21,status:'ativo',canal:'c6',obs:'',inicio:'2026-04-01',aniversario:'',contratoStatus:'aguardando',crmEtapa:'e4'},
  {id:39,nome:'Sertão Loterias',cnpj:'',resp:'CLAUDIO',tel:'84 99968-9114',email:'',vend:'Augusto',vendedorId:'v3',mensal:350,dia:7,status:'ativo',canal:'c2',obs:'',inicio:'2026-03-01',aniversario:'',contratoStatus:'assinado',crmEtapa:'e6'},
];

// ── Retiradas ────────────────────────────────────────────────
const RET_INIT = [
  {id:1,socio:'Fabricio',desc:'Pro-labore Abril',    mes:'Abril',    data:'2026-04-05',valor:5000,cat:'Pro-labore'},
  {id:2,socio:'Albert',  desc:'Pro-labore Abril',    mes:'Abril',    data:'2026-04-05',valor:8000,cat:'Pro-labore'},
  {id:3,socio:'Augusto', desc:'Pro-labore Abril',    mes:'Abril',    data:'2026-04-05',valor:4000,cat:'Pro-labore'},
  {id:4,socio:'Fabricio',desc:'Pro-labore Março',    mes:'Março',    data:'2026-03-05',valor:5000,cat:'Pro-labore'},
  {id:5,socio:'Albert',  desc:'Retirada extra Março',mes:'Março',    data:'2026-03-15',valor:3000,cat:'Adiantamento'},
  {id:6,socio:'Augusto', desc:'Pro-labore Março',    mes:'Março',    data:'2026-03-05',valor:4000,cat:'Pro-labore'},
  {id:7,socio:'Fabricio',desc:'Pro-labore Fevereiro',mes:'Fevereiro',data:'2026-02-05',valor:5000,cat:'Pro-labore'},
  {id:8,socio:'Albert',  desc:'Pro-labore Fevereiro',mes:'Fevereiro',data:'2026-02-05',valor:8000,cat:'Pro-labore'},
  {id:9,socio:'Augusto', desc:'Pro-labore Fevereiro',mes:'Fevereiro',data:'2026-02-05',valor:4000,cat:'Pro-labore'},
];

// ── Usuários ─────────────────────────────────────────────────
const USERS_INIT = [
  {id:1,nome:'Administrador',       login:'admin',      senha:'admin123',perfil:'admin',      criado:'22/04/2026'},
  {id:2,nome:'Financeiro ChatClean',login:'financeiro', senha:'fin2026', perfil:'financeiro', criado:'22/04/2026'},
  {id:3,nome:'Usuário Visualização',login:'usuario',    senha:'view2026',perfil:'usuario',    criado:'22/04/2026'},
];

// ── Template de contrato ─────────────────────────────────────
const CONTRATO_TEMPLATE = `
<h1>CONTRATO DE PRESTAÇÃO DE SERVIÇOS</h1>
<h1>ChatClean®</h1>

<h2>PARTES</h2>
<p><strong>CONTRATADA:</strong> ChatClean Tecnologia Ltda, CNPJ nº XX.XXX.XXX/0001-XX, com sede em Natal/RN.</p>
<p><strong>CONTRATANTE:</strong> <span class="field">{{nome}}</span>, inscrita no CNPJ/CPF sob nº <span class="field">{{cnpj}}</span>, representada por <span class="field">{{resp}}</span>.</p>

<h2>OBJETO</h2>
<p>A CONTRATADA prestará à CONTRATANTE os serviços de plataforma de gestão de comunicação via WhatsApp e redes sociais (ChatClean), conforme especificações técnicas acordadas.</p>

<h2>VALOR E PAGAMENTO</h2>
<p>O valor mensal dos serviços é de <span class="field">{{mensal}}</span>, com vencimento todo dia <span class="field">{{dia}}</span> de cada mês.</p>
<p>O pagamento será realizado via boleto bancário ou PIX, enviado previamente ao vencimento.</p>

<h2>PRAZO</h2>
<p>O contrato tem prazo indeterminado, com início em <span class="field">{{inicio}}</span>, podendo ser rescindido por qualquer das partes mediante aviso prévio de 30 (trinta) dias.</p>

<h2>OBRIGAÇÕES DA CONTRATADA</h2>
<p>a) Disponibilizar a plataforma ChatClean com disponibilidade mínima de 99% mensal;</p>
<p>b) Fornecer suporte técnico durante horário comercial;</p>
<p>c) Garantir a segurança e confidencialidade dos dados do CONTRATANTE.</p>

<h2>OBRIGAÇÕES DA CONTRATANTE</h2>
<p>a) Efetuar os pagamentos nas datas acordadas;</p>
<p>b) Utilizar a plataforma dentro dos limites legais;</p>
<p>c) Não repassar credenciais de acesso a terceiros.</p>

<h2>RESCISÃO</h2>
<p>Este contrato poderá ser rescindido mediante comunicação formal com 30 dias de antecedência.</p>

<h2>FORO</h2>
<p>Fica eleito o foro da comarca de Natal/RN para dirimir quaisquer controvérsias.</p>

<br><br>
<p>Natal, {{dataContrato}}</p>
<br>
<p>_____________________________<br>ChatClean Tecnologia Ltda<br>CONTRATADA</p>
<br>
<p>_____________________________<br><span class="field">{{resp}}</span><br>CONTRATANTE</p>
`;
