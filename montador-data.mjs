// Referências de projeto, não uma lista de estoque. Fontes oficiais: docs/montador.md.
export const REVIEWED_AT = '2026-11-13';
export const WHATSAPP_NUMBER = '5534992413197';
const other = { id: 'outro', name: 'Outro modelo / já tenho — informar nas observações', unknown: true };
export const OPTIONS = {
  purpose: [
    { id: 'trabalho', name: 'Trabalho, estudo e uso cotidiano' },
    { id: 'competitivo', name: 'Jogos competitivos e alta fluidez' },
    { id: 'jogos', name: 'Jogos com foco em qualidade visual' },
    { id: 'criacao', name: 'Edição, criação e multitarefa' },
    { id: 'stream', name: 'Jogar e fazer transmissões' }
  ],
  resolution: [
    { id: '1080p', name: 'Full HD · 1920 × 1080', pixels: 2073600 },
    { id: '1440p', name: 'QHD · 2560 × 1440', pixels: 3686400 },
    { id: 'ultrawide', name: 'Ultrawide · 3440 × 1440', pixels: 4953600 },
    { id: '4k', name: '4K · 3840 × 2160', pixels: 8294400 },
    { id: 'outro', name: 'Outra resolução — informar nas observações', unknown: true }
  ],
  refresh: [60, 75, 120, 144, 165, 180, 240, 360].map(hz => ({ id: String(hz), name: hz + ' Hz', hz })),
  cpu: [
    { id: 'i5-10400f', name: 'Intel Core i5-10400F · 10ª geração', socket: 'LGA1200', ram: ['DDR4'], igpu: false, pcie: 3, note: 'LGA1200 · DDR4 · exige placa de vídeo dedicada', source: 'https://www.intel.com/content/www/us/en/products/sku/199278/intel-core-i510400f-processor-12m-cache-up-to-4-30-ghz/specifications.html' },
    { id: 'i5-12400f', name: 'Intel Core i5-12400F · 12ª geração', socket: 'LGA1700', ram: ['DDR4', 'DDR5'], igpu: false, pcie: 5, note: 'LGA1700 · DDR4 ou DDR5, conforme a placa-mãe · sem vídeo integrado', source: 'https://www.intel.com/content/www/us/en/products/sku/134587/intel-core-i512400f-processor-18m-cache-up-to-4-40-ghz/specifications.html' },
    { id: 'i5-14400f', name: 'Intel Core i5-14400F · 14ª geração', socket: 'LGA1700', ram: ['DDR4', 'DDR5'], igpu: false, pcie: 5, note: 'LGA1700 · conferir BIOS para 14ª geração · sem vídeo integrado', source: 'https://www.intel.com.br/content/www/br/pt/products/sku/236777/intel-core-i5-processor-14400f-20m-cache-up-to-4-70-ghz/specifications.html' },
    { id: 'r5-5600g', name: 'AMD Ryzen 5 5600G · com vídeo integrado', socket: 'AM4', ram: ['DDR4'], igpu: true, pcie: 3, note: 'AM4 · DDR4 · Radeon integrado · PCIe 3.0', source: 'https://www.amd.com/pt/support/downloads/drivers.html/processors/ryzen/ryzen-5000-series/amd-ryzen-5-5600g.html' },
    { id: 'r5-5600', name: 'AMD Ryzen 5 5600 · sem vídeo integrado', socket: 'AM4', ram: ['DDR4'], igpu: false, pcie: 4, note: 'AM4 · DDR4 · exige placa de vídeo dedicada', source: 'https://www.amd.com/pt/support/downloads/drivers.html/processors/ryzen/ryzen-5000-series/amd-ryzen-5-5600.html' },
    { id: 'r5-7600', name: 'AMD Ryzen 5 7600 · plataforma AM5', socket: 'AM5', ram: ['DDR5'], igpu: true, pcie: 5, note: 'AM5 · somente DDR5 · Radeon integrado', source: 'https://www.amd.com/en/products/processors/desktops/ryzen/7000-series/amd-ryzen-5-7600.html' }, other
  ],
  gpu: [
    { id: 'integrado', name: 'Usar somente o vídeo integrado do processador', integrated: true, note: 'Depende de um processador com gráficos integrados e da saída de vídeo da placa-mãe.' },
    { id: 'rtx3060', name: 'NVIDIA GeForce RTX 3060 · 12 GB', vram: 12, recommendedPsu: 550, note: 'Referência NVIDIA: fonte de sistema de 550 W. A versão do fabricante precisa ser conferida.', source: 'https://www.nvidia.com/pt-br/geforce/graphics-cards/30-series/rtx-3060-3060ti/' },
    { id: 'rtx3070', name: 'NVIDIA GeForce RTX 3070 · 8 GB', vram: 8, recommendedPsu: 650, note: 'Referência NVIDIA: fonte de sistema de 650 W. Não é o consumo isolado da placa.', source: 'https://www.nvidia.com/pt-br/geforce/graphics-cards/30-series/rtx-3070-3070ti/' },
    { id: 'rtx4060', name: 'NVIDIA GeForce RTX 4060 · 8 GB', vram: 8, recommendedPsu: 550, note: 'Referência NVIDIA: fonte de sistema de 550 W. Marca, conectores e dimensões serão conferidos.', source: 'https://www.nvidia.com/pt-br/geforce/graphics-cards/40-series/rtx-4060-4060ti/' },
    { id: 'rtx4070', name: 'NVIDIA GeForce RTX 4070 · 12 GB', vram: 12, recommendedPsu: 650, note: 'Referência NVIDIA: fonte de sistema de 650 W. A versão do fabricante pode ter outros requisitos.', source: 'https://www.nvidia.com/en-us/geforce/graphics-cards/40-series/rtx-4070-family/' },
    { id: 'rx6600', name: 'AMD Radeon RX 6600 · 8 GB', vram: 8, recommendedPsu: 450, note: 'Referência AMD: fonte de sistema de 450 W. Conferir a recomendação do fabricante da placa.', source: 'https://www.amd.com/en/products/graphics/desktops/radeon/6000-series/amd-radeon-rx-6600.html' },
    { id: 'rx7600', name: 'AMD Radeon RX 7600 · 8 GB', vram: 8, recommendedPsu: 550, note: 'Referência AMD: fonte de sistema de 550 W. O conjunto e a saída de 12 V também precisam ser avaliados.', source: 'https://www.amd.com/en/support/downloads/drivers.html/graphics/radeon-rx/radeon-rx-7000-series/amd-radeon-rx-7600.html' }, other
  ],
  motherboard: [
    { id: 'h510', name: 'MSI H510M-A PRO · DDR4', socket: 'LGA1200', ram: 'DDR4', form: 'mATX', m2Gen: 3, note: 'LGA1200 · DDR4 · mATX · M.2 PCIe até Gen 3', source: 'https://www.msi.com/Motherboard/H510M-A-PRO/Specification' },
    { id: 'b760d4', name: 'MSI PRO B760M-A WIFI DDR4', socket: 'LGA1700', ram: 'DDR4', form: 'mATX', m2Gen: 4, note: 'LGA1700 · DDR4 · mATX · conferir versão da BIOS', source: 'https://www.msi.com/Motherboard/PRO-B760M-A-WIFI-DDR4/Specification' },
    { id: 'b760d5', name: 'MSI PRO B760M-A WIFI · DDR5', socket: 'LGA1700', ram: 'DDR5', form: 'mATX', m2Gen: 4, note: 'LGA1700 · DDR5 · mATX · não aceita módulos DDR4', source: 'https://br.msi.com/Motherboard/PRO-B760M-A-WIFI/Specification' },
    { id: 'b550m', name: 'MSI B550M PRO-VDH WIFI · DDR4', socket: 'AM4', ram: 'DDR4', form: 'mATX', m2Gen: 4, note: 'AM4 · DDR4 · mATX · confirmar suporte da BIOS à CPU escolhida', source: 'https://www.msi.com/Motherboard/B550M-PRO-VDH-WIFI/Specification' },
    { id: 'b550atx', name: 'MSI B550-A PRO · DDR4 · ATX', socket: 'AM4', ram: 'DDR4', form: 'ATX', m2Gen: 4, note: 'AM4 · DDR4 · ATX · exige gabinete com suporte ATX', source: 'https://www.msi.com/Motherboard/B550-A-PRO/Specification' },
    { id: 'b650m', name: 'MSI PRO B650M-A WIFI · DDR5', socket: 'AM5', ram: 'DDR5', form: 'mATX', m2Gen: 4, note: 'AM5 · DDR5 · mATX · conferir lista de CPUs e memórias suportadas', source: 'https://br.msi.com/Motherboard/PRO-B650M-A-WIFI/Specification' }, other
  ],
  ram: [
    { id: 'd4-8', name: 'DDR4 · 8 GB (1 × 8 GB)', type: 'DDR4', gb: 8, modules: 1 },
    { id: 'd4-16', name: 'DDR4 · 16 GB (2 × 8 GB)', type: 'DDR4', gb: 16, modules: 2 },
    { id: 'd4-32', name: 'DDR4 · 32 GB (2 × 16 GB)', type: 'DDR4', gb: 32, modules: 2 },
    { id: 'd4-64', name: 'DDR4 · 64 GB (2 × 32 GB)', type: 'DDR4', gb: 64, modules: 2 },
    { id: 'd5-16', name: 'DDR5 · 16 GB (2 × 8 GB)', type: 'DDR5', gb: 16, modules: 2 },
    { id: 'd5-32', name: 'DDR5 · 32 GB (2 × 16 GB)', type: 'DDR5', gb: 32, modules: 2 },
    { id: 'd5-64', name: 'DDR5 · 64 GB (2 × 32 GB)', type: 'DDR5', gb: 64, modules: 2 }, other
  ],
  nvme: [
    { id: 'nenhum', name: 'Não incluir SSD NVMe', none: true },
    { id: 'nvme500g3', name: '500 GB · M.2 2280 · PCIe 3.0', gb: 500, gen: 3 },
    { id: 'nvme1tg3', name: '1 TB · M.2 2280 · PCIe 3.0', gb: 1000, gen: 3 },
    { id: 'nvme1tg4', name: '1 TB · M.2 2280 · PCIe 4.0', gb: 1000, gen: 4 },
    { id: 'nvme2tg4', name: '2 TB · M.2 2280 · PCIe 4.0', gb: 2000, gen: 4 }, other
  ],
  sata: [
    { id: 'nenhum', name: 'Não incluir SSD SATA', none: true },
    { id: 'sata500', name: 'SSD SATA · 500 GB · 2,5 polegadas', gb: 500 },
    { id: 'sata1t', name: 'SSD SATA · 1 TB · 2,5 polegadas', gb: 1000 },
    { id: 'sata2t', name: 'SSD SATA · 2 TB · 2,5 polegadas', gb: 2000 }, other
  ],
  hdd: [
    { id: 'nenhum', name: 'Não incluir HD', none: true },
    { id: 'hd1t', name: 'HD SATA · 1 TB · 3,5 polegadas', gb: 1000 },
    { id: 'hd2t', name: 'HD SATA · 2 TB · 3,5 polegadas', gb: 2000 },
    { id: 'hd4t', name: 'HD SATA · 4 TB · 3,5 polegadas', gb: 4000 }, other
  ],
  psu: [450, 550, 650, 750, 850, 1000].map(watts => ({ id: String(watts), name: watts + ' W · marca e modelo a definir', watts })).concat(other),
  case: [
    { id: 'matx', name: 'Compacto · suporte até micro-ATX', forms: ['mATX'], note: 'Perfil de gabinete. Espaço para GPU, fonte, discos e refrigeração será verificado no modelo final.' },
    { id: 'atx', name: 'Torre média · suporte ATX e micro-ATX', forms: ['ATX', 'mATX'], note: 'Perfil de gabinete. Dimensões, ventilação e baias precisam de revisão no modelo final.' }, other
  ],
  cooler: [
    { id: 'box', name: 'Cooler original, se incluído na CPU' },
    { id: 'air', name: 'Air cooler · modelo a definir' },
    { id: 'water240', name: 'Water cooler 240 mm · modelo a definir' },
    { id: 'nenhum', name: 'Não incluir cooler', none: true }, other
  ],
  budget: [
    { id: '3000', name: 'Até R$ 3.000' },
    { id: '5000', name: 'De R$ 3.000 a R$ 5.000' },
    { id: '8000', name: 'De R$ 5.000 a R$ 8.000' },
    { id: '12000', name: 'De R$ 8.000 a R$ 12.000' },
    { id: 'mais', name: 'Acima de R$ 12.000' },
    { id: 'orientacao', name: 'Quero ajuda para definir' }
  ],
  budgetScope: [
    { id: 'torre', name: 'Somente o computador' },
    { id: 'completo', name: 'Computador + monitor + periféricos' },
    { id: 'upgrade', name: 'Upgrade de peças que já tenho' }
  ],
  style: [
    { id: 'discreto', name: 'Discreto e sem iluminação' },
    { id: 'rgb', name: 'Gamer com iluminação RGB' },
    { id: 'branco', name: 'Setup branco' },
    { id: 'compacto', name: 'O mais compacto possível' },
    { id: 'livre', name: 'Sem preferência' }
  ],
  priority: [
    { id: 'custo', name: 'Melhor aproveitamento do orçamento' },
    { id: 'desempenho', name: 'Desempenho para meus jogos e programas' },
    { id: 'silencio', name: 'Silêncio e temperaturas' },
    { id: 'upgrade', name: 'Facilidade para futuros upgrades' }
  ]
};
export const FIELD_LABELS = {
  purpose: 'Uso principal', resolution: 'Resolução do monitor', refresh: 'Taxa de atualização', cpu: 'Processador', gpu: 'Placa de vídeo', motherboard: 'Placa-mãe', ram: 'Memória RAM', nvme: 'SSD NVMe', sata: 'SSD SATA', hdd: 'HD', psu: 'Fonte', case: 'Gabinete', cooler: 'Refrigeração da CPU', budget: 'Orçamento pretendido', budgetScope: 'O que entra no orçamento', style: 'Visual desejado', priority: 'Prioridade'
};
export const PRESETS = {
  cotidiano: { label: 'Trabalho & estudo', values: { purpose: 'trabalho', resolution: '1080p', refresh: '60', cpu: 'r5-5600g', gpu: 'integrado', motherboard: 'b550m', ram: 'd4-16', nvme: 'nvme500g3', sata: 'nenhum', hdd: 'nenhum', psu: '450', case: 'matx', cooler: 'box' } },
  jogos: { label: 'i5 + RTX 3070', values: { purpose: 'jogos', resolution: '1440p', refresh: '144', cpu: 'i5-12400f', gpu: 'rtx3070', motherboard: 'b760d4', ram: 'd4-32', nvme: 'nvme1tg4', sata: 'nenhum', hdd: 'nenhum', psu: '650', case: 'atx', cooler: 'air' } },
  am5: { label: 'Explore a plataforma AM5', values: { purpose: 'criacao', resolution: '1440p', refresh: '165', cpu: 'r5-7600', gpu: 'rtx4070', motherboard: 'b650m', ram: 'd5-32', nvme: 'nvme1tg4', sata: 'nenhum', hdd: 'nenhum', psu: '750', case: 'atx', cooler: 'air' } }
};
export const EMPTY_BUILD = Object.fromEntries([...Object.keys(OPTIONS).map(key => [key, '']), ['games', ''], ['notes', '']]);
export function optionFor(field, id) { return OPTIONS[field]?.find(item => item.id === id); }
export function normalizeBuild(input) {
  const safe = { ...EMPTY_BUILD };
  if (!input || typeof input !== 'object' || Array.isArray(input)) return safe;
  for (const key of Object.keys(OPTIONS)) if (typeof input[key] === 'string' && optionFor(key, input[key])) safe[key] = input[key];
  for (const [key, limit] of [['games', 160], ['notes', 600]]) if (typeof input[key] === 'string') safe[key] = input[key].replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, '').slice(0, limit);
  return safe;
}
