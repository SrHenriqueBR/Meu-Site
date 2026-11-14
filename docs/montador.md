# Monte seu PC — manutenção e limites

O configurador recebe uma intenção de montagem e prepara um resumo para a Orvysion. Não faz compras, não mede FPS, não calcula porcentagem de gargalo, não soma preços nem representa estoque disponível. As imagens já existentes do catálogo são ilustrativas.

## Arquivos

- `monte-seu-pc.html`: página, formulário, explicações e acessos.
- `montador.css`: layout e adaptação ao celular.
- `montador-data.mjs`: modelos de referência, atributos, fontes, preferências e bases editáveis.
- `montador-engine.mjs`: funções puras de análise e montagem da mensagem.
- `montador.mjs`: interface, rascunho local, desfazer, cópia e WhatsApp.
- `tests/montador.test.mjs`: cenários de compatibilidade, incerteza, energia e mensagem.

O rascunho usa a chave local `orvysion-pc-builder-v1`. Não há backend nem transmissão automática. O cliente pode limpar a configuração; o botão Desfazer recupera a alteração anterior na sessão. Falhas de armazenamento ou clipboard têm orientação alternativa. Texto livre é limitado e inserido na página por `textContent`/`value`, não como HTML.

## O que é verificado

| Regra | Resultado |
| --- | --- |
| Soquetes diferentes | Incompatibilidade; soquete igual não comprova suporte de BIOS. |
| RAM DDR4/DDR5 diferente do suporte da CPU ou placa | Incompatibilidade. Não verifica QVL, frequência, timings ou estabilidade de XMP/EXPO. |
| Vídeo integrado selecionado com CPU sem gráficos | Exige GPU dedicada ou outra CPU. |
| Placa ATX no perfil de gabinete até mATX | Incompatibilidade de formato. Outras dimensões permanecem pendentes. |
| Fonte abaixo da recomendação da GPU | Ponto de atenção, não medição de consumo ou prova de que o sistema não liga. |
| Ausência explícita de discos ou cooler | Indica o componente necessário à montagem proposta. |
| NVMe Gen4 em conexão de geração menor | Orienta sobre negociação da conexão e revisão do slot, sem declarar incompatibilidade automática. |
| Modelo não cadastrado | Não aprova esse componente; solicita avaliação individual. |

Marca/modelo da fonte, corrente de 12 V, conectores, cabos, BIOS, lista de CPUs suportadas, QVL, frequências, dimensões, radiador, refrigeração, baias, portas SATA e saídas/cabos de monitor devem ser conferidos no orçamento final. As opções de armazenamento representam uma unidade por seleção. Não há modo de montagem de notebooks.

As orientações de desempenho são qualitativas. Um i5-10400F e uma GPU dedicada em um objetivo de 144 Hz ou mais acionam um aviso para conferir a CPU nos jogos escolhidos. Isso é uma orientação para investigar, não um benchmark que afirma um limite medido. QHD/ultrawide/4K acionam orientações sobre carga da GPU; em perfis de jogos com qualidade visual ou transmissão, GPUs de até 8 GB recebem um aviso condicional sobre texturas/VRAM. Sem jogo, qualidade e testes reais não há promessa de taxa de quadros.

## Referências oficiais

Revisão de dados: **13/11/2026**. Cada CPU/GPU/placa-mãe também tem o link da ficha em `montador-data.mjs`, mostrado ao lado do seletor.

- [Intel: equilíbrio do conjunto e gargalos](https://www.intel.com.br/content/www/br/pt/gaming/resources/what-is-bottlenecking-my-pc.html).
- [Intel: monitor e taxa de atualização](https://www.intel.com.br/content/www/br/pt/gaming/resources/highest-refresh-rate-gaming.html).
- [Intel: processadores sem gráficos integrados](https://www.intel.com/content/www/us/en/support/articles/000027144/processors/intel-core-processors.html).
- [Intel: plataformas de 12ª, 13ª e 14ª geração](https://www.intel.com/content/www/us/en/support/articles/000092149/processors.html).
- [NVIDIA RTX 3060](https://www.nvidia.com/pt-br/geforce/graphics-cards/30-series/rtx-3060-3060ti/): 550 W para a referência RTX 3060.
- [NVIDIA RTX 3070](https://www.nvidia.com/pt-br/geforce/graphics-cards/30-series/rtx-3070-3070ti/): 650 W para a referência RTX 3070.
- [NVIDIA RTX 4060](https://www.nvidia.com/pt-br/geforce/graphics-cards/40-series/rtx-4060-4060ti/): 550 W.
- [NVIDIA RTX 4070](https://www.nvidia.com/en-us/geforce/graphics-cards/40-series/rtx-4070-family/): 650 W para a referência RTX 4070.
- [AMD RX 6600](https://www.amd.com/en/products/graphics/desktops/radeon/6000-series/amd-radeon-rx-6600.html): 450 W.
- [AMD RX 7600](https://www.amd.com/en/support/downloads/drivers.html/graphics/radeon-rx/radeon-rx-7000-series/amd-radeon-rx-7600.html): 550 W; também exige analisar a saída de 12 V.

As recomendações de fonte são para os sistemas de referência dos fabricantes, não apenas para a GPU. Versões de placas parceiras, CPU e demais componentes podem mudar a necessidade.

## Atualização

Adicionar um modelo exige consultar a ficha oficial, atualizar seus atributos e revisar as regras afetadas. Não inferir desempenho apenas de nome comercial ou série. Preservar “Outro modelo / já tenho” para combinações fora da base. Nenhum texto deve dizer que uma configuração está totalmente aprovada pelo simples fato de não haver conflitos automáticos.

Execute `node --test tests/montador.test.mjs` e confira a interface no desktop e no celular. Invalide o cache de CSS/módulos alterados, incluindo imports internos quando necessário. Preserve os acessos do catálogo, o WhatsApp `5534992413197` e o Instagram `orvysiontech`.
