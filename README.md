# Orvysion Technology

Site comercial da Orvysion, desenvolvido para apresentar serviços e receber pedidos de orçamento diretamente no WhatsApp.

**Site:** https://srhenriquebr.github.io/Meu-Site/

## Serviços

- Montagem de computadores.
- Manutenção, limpeza e upgrades de PCs e notebooks.
- Desenvolvimento de sites e lojas virtuais.
- Sistemas sob medida e dashboards.
- Venda de softwares e licenças, instalação e configuração.
- Automações com IA, integrações e protótipos.

## Contato

Todos os botões de orçamento usam **+55 (16) 99745-2366**.

O formulário prepara uma mensagem com nome, serviço e descrição e abre o WhatsApp. A pessoa confere e envia a mensagem por lá. Não há servidor de formulário, envio automático, armazenamento de dados ou integração paga.

Para alterar o contato, atualize o número em:
- `index.html`: links, telefone visível e dados estruturados.
- `script.js`: constante `WHATSAPP_NUMBER`.
- `projetos/*.html`: contatos das demonstrações.

## Projetos demonstrativos

As marcas, os produtos, os preços e os registros das demonstrações são fictícios e estão identificados como exemplos. Não representam clientes atendidos.

| Projeto | Demonstração |
| --- | --- |
| Lume Arquitetura | Site institucional com navegação entre seções. |
| Áurea Store | Catálogo por categoria, sacola, quantidades, total e pedido simulado. |
| Nexo Gestão | Pesquisa e filtro de pedidos, indicadores calculados, gráfico e exportação CSV. |
| Orvysion Flow | Simulação de organização de uma solicitação. |

A loja não faz cobranças, pedidos ou entregas reais. O painel não tem banco de dados ou autenticação. O Flow não chama modelos de IA: simula um fluxo local para ilustrar possibilidades de automação. A contratação das funcionalidades reais exige definição de escopo e integrações.

## Estrutura

- `index.html`, `style.css`, `script.js`: página comercial.
- `assets/`: identidade visual, fotos fornecidas pelo proprietário, ilustrações e prévias.
- `projetos/`: quatro demonstrações, estilos e interações.
- `.github/workflows/pages.yml`: publicação automática no GitHub Pages.
- `robots.txt` e `sitemap.xml`: descoberta da página principal.

A imagem de apresentação da equipe foi fornecida pelo proprietário e tem composição gerada por IA. A foto das ferramentas também foi fornecida pelo proprietário. As cópias WebP preservam o conteúdo das imagens e reduzem o tamanho do download. As ilustrações e prévias dos projetos são SVGs locais.

## Rodar localmente

Não há dependências ou etapa de compilação. Use um servidor HTTP na raiz:

```bash
python3 -m http.server 8000
```

Abra http://localhost:8000. Um servidor HTTP é necessário para carregar corretamente o conjunto de ícones SVG.

## Publicação

A configuração existente do GitHub Actions publica o conteúdo da branch `main` no GitHub Pages automaticamente. O endereço permanece o mesmo.

## Cuidados de manutenção

- Use caminhos relativos para manter a compatibilidade com `/Meu-Site/`.
- Não publique dados pessoais, chaves de API ou credenciais no repositório.
- Mantenha os rótulos de demonstração ao trocar os exemplos.
- Atualize fotos, escopo e condições comerciais conforme os serviços oferecidos.
- A interface respeita a preferência por menos movimento e oferece navegação por teclado.

