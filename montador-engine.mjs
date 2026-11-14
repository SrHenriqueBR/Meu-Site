import { OPTIONS, FIELD_LABELS, optionFor, normalizeBuild, WHATSAPP_NUMBER } from './montador-data.mjs?v=20261113-1';

const known = value => value && !value.unknown;
export function analyzeBuild(input) {
  const build = normalizeBuild(input);
  const selected = Object.fromEntries(Object.keys(OPTIONS).map(key => [key, optionFor(key, build[key])]));
  const { cpu, gpu, motherboard: board, ram, psu, case: pcCase, cooler, resolution, refresh } = selected;
  const errors = [], warnings = [], checks = [], insights = [];
  const add = (list, id, title, text, fields = []) => list.push({ id, title, text, fields });
  const gaming = ['competitivo', 'jogos', 'stream'].includes(build.purpose);
  const storage = ['nvme', 'sata', 'hdd'].map(key => selected[key]);
  const hasDrive = storage.some(item => known(item) && !item.none);
  const unknowns = Object.keys(selected).filter(key => selected[key]?.unknown);

  if (known(cpu) && known(board)) {
    if (cpu.socket !== board.socket) add(errors, 'socket', 'Processador e placa-mãe não encaixam', `${cpu.name} usa ${cpu.socket}; ${board.name} usa ${board.socket}. Escolha uma placa ou CPU da mesma plataforma.`, ['cpu', 'motherboard']);
    else {
      add(checks, 'socket', `Soquete ${cpu.socket} coincide`, 'O encaixe confere; o suporte ao modelo exato e a versão da BIOS ainda serão validados.');
      add(warnings, 'bios', 'Conferir suporte e BIOS da placa-mãe', 'Mesmo com o soquete correto, confira a lista de CPUs e a BIOS exigida para este processador antes da montagem.', ['motherboard']);
    }
  }
  if (known(ram)) {
    const mismatch = [];
    if (known(board) && ram.type !== board.ram) mismatch.push(`${board.name} aceita ${board.ram}`);
    if (known(cpu) && !cpu.ram.includes(ram.type)) mismatch.push(`${cpu.name} aceita ${cpu.ram.join(' ou ')}`);
    if (mismatch.length) add(errors, 'memory', `${ram.type} não serve nesta combinação`, `${mismatch.join('; ')}. DDR4 e DDR5 não são intercambiáveis.`, ['ram', 'motherboard', 'cpu']);
    else if (known(cpu) && known(board)) add(checks, 'memory', `Geração ${ram.type} confere`, 'Modelo do kit, frequência, perfil XMP/EXPO e slots ainda precisam de conferência.');
    if (ram.gb < 16 && (gaming || build.purpose === 'criacao')) add(warnings, 'ram-capacity', 'Vale avaliar mais memória', `${ram.gb} GB pode limitar multitarefa e alguns jogos ou programas. Considere 16 GB ou mais conforme as aplicações.`, ['ram']);
    if (ram.gb < 32 && ['criacao', 'stream'].includes(build.purpose)) add(insights, 'ram-workload', 'Memória depende do tamanho do trabalho', 'Projetos maiores, muitas aplicações e transmissões podem justificar 32 GB ou mais. A escolha final depende do software e dos arquivos.');
    if (ram.modules === 1) add(warnings, 'single-module', 'Um único módulo de RAM', 'Um kit com dois módulos compatíveis pode melhorar a largura de banda, especialmente com vídeo integrado. Instalação e ganhos dependem da plataforma.', ['ram']);
  }
  if (known(cpu) && known(gpu)) {
    if (gpu.integrated && !cpu.igpu) add(errors, 'no-video', 'Falta uma placa de vídeo', `${cpu.name} não possui gráficos integrados. As saídas da placa-mãe não resolvem isso: inclua uma GPU dedicada ou troque o processador.`, ['cpu', 'gpu']);
    else add(checks, 'video', gpu.integrated ? 'O processador tem vídeo integrado' : 'Placa de vídeo dedicada selecionada', gpu.integrated ? 'Confirme a saída de vídeo da placa-mãe e a conexão do monitor.' : 'Ligue o monitor à placa de vídeo; confira conectores de alimentação e espaço no gabinete.');
  }
  if (known(board) && known(pcCase)) {
    if (!pcCase.forms.includes(board.form)) add(errors, 'case-size', 'Placa-mãe maior que o perfil do gabinete', `${board.name} é ${board.form}. O gabinete escolhido aceita até micro-ATX. Escolha uma torre com suporte ATX ou outra placa-mãe.`, ['case', 'motherboard']);
    else add(checks, 'case-format', `Formato ${board.form} previsto no gabinete`, 'Este é só o formato da placa-mãe. A folga para GPU, cooler, fonte e discos depende dos modelos finais.');
  }
  if (known(gpu) && gpu.recommendedPsu && known(psu)) {
    if (psu.watts < gpu.recommendedPsu) add(warnings, 'psu-low', 'Fonte abaixo da referência da GPU', `${gpu.name}: o fabricante informa ${gpu.recommendedPsu} W para o sistema de referência. Você escolheu ${psu.watts} W. Revise a fonte com a Orvysion antes de fechar as peças.`, ['psu']);
    else add(checks, 'psu-reference', `${psu.watts} W atende à referência de potência da GPU`, `Referência: ${gpu.recommendedPsu} W. Isso não aprova a fonte: modelo, capacidade de 12 V, conectores e o restante do PC ainda serão conferidos.`);
  }
  if (psu) add(warnings, 'psu-model', 'Watts sozinhos não definem uma boa fonte', 'Marca e modelo, proteções, conectores e capacidade de entrega são parte da escolha. A potência indicada aqui não é uma medição de consumo do seu PC.', ['psu']);
  if (storage.every(item => item?.none)) add(errors, 'no-storage', 'Nenhum armazenamento incluído', 'Para este projeto de PC, selecione ao menos um SSD ou HD para instalar o sistema e guardar seus arquivos. Se já tem uma unidade, escolha “Outro modelo / já tenho”.', ['nvme', 'sata', 'hdd']);
  else if (hasDrive) add(checks, 'storage', 'Armazenamento incluído', 'Interfaces, slots, portas SATA, cabos e baias serão conferidos nos modelos finais.');
  if (selected.hdd?.gb && selected.nvme?.none && selected.sata?.none) add(warnings, 'hdd-only', 'Somente HD: considere um SSD para o sistema', 'Um SSD pode reduzir esperas ao iniciar o sistema e abrir programas. O HD pode complementar a capacidade para arquivos.', ['nvme', 'sata']);
  if (known(selected.nvme) && selected.nvme.gen && known(board)) {
    const effectiveGen = board.socket === 'AM4' && known(cpu) ? Math.min(board.m2Gen, cpu.pcie) : board.m2Gen;
    if (selected.nvme.gen > effectiveGen) add(warnings, 'nvme-link', 'O NVMe pode operar em uma geração menor', `Neste conjunto, a conexão M.2 considerada chega a PCIe ${effectiveGen}.0. O SSD PCIe ${selected.nvme.gen}.0 pode negociar a geração anterior; confirme slot, modelo e suporte.`, ['nvme', 'motherboard']);
  }
  if (cooler?.none) add(errors, 'no-cooler', 'O processador precisa de refrigeração', 'Inclua um cooler compatível. Se pretende reutilizar um, escolha “Outro modelo / já tenho” e informe o modelo nas observações.', ['cooler']);
  else if (cooler) add(warnings, 'cooling-fit', 'Conferir cooler e espaço interno', cooler.id === 'water240' ? 'O gabinete precisa de suporte e folga para radiador de 240 mm. Também confira o kit de montagem para o soquete da CPU.' : cooler.id === 'box' ? 'Confirme se a versão comprada da CPU inclui o cooler original, sua fixação e se atende ao uso pretendido.' : 'A fixação deve atender ao soquete da CPU; altura do cooler, espaço da RAM e ventilação do gabinete precisam ser conferidos.', ['cooler', 'case']);
  if (unknowns.length) add(warnings, 'unknown-parts', 'Há escolhas que precisam de análise individual', `Não validamos automaticamente: ${unknowns.map(key => FIELD_LABELS[key]).join(', ')}. Informe marcas e modelos nas observações.`, unknowns);

  if (gaming && known(gpu) && gpu.integrated && (!known(cpu) || cpu.igpu)) add(warnings, 'integrated-gaming', 'Vídeo integrado pede expectativas alinhadas', 'O desempenho varia muito entre gráficos integrados e entre jogos. Valide os títulos, a resolução e a qualidade; não trate este perfil como equivalente a uma GPU dedicada.', ['gpu']);
  if (gaming && known(cpu) && known(gpu) && !gpu.integrated && refresh?.hz >= 144) {
    if (cpu.id === 'i5-10400f') add(warnings, 'cpu-high-fps', 'CPU merece atenção para muitos quadros', `${cpu.name} com ${gpu.name}: buscar ${refresh.hz} Hz pode expor limites de CPU em alguns jogos, sobretudo em resoluções e qualidades menores. Confirme testes dos jogos desejados; o monitor não causa esse limite.`, ['cpu', 'refresh']);
    else add(insights, 'high-fps', `Seu alvo de ${refresh.hz} Hz exige avaliar CPU e GPU`, 'Conseguir muitos quadros depende do jogo, do processador, da placa de vídeo e da qualidade gráfica. A taxa do monitor não é uma promessa de FPS.');
  }
  if (gaming && resolution?.pixels >= 3686400 && known(gpu) && !gpu.integrated) {
    add(insights, 'resolution-load', 'Mais pixels aumentam o trabalho da GPU', 'QHD, ultrawide e 4K pedem mais da renderização. Qualidade, ray tracing e tecnologias de reconstrução mudam o resultado; valide o conjunto nos seus jogos.');
    if (gpu.vram <= 8 && ['jogos', 'stream'].includes(build.purpose)) add(warnings, 'vram', `${gpu.vram} GB de VRAM: observe texturas e jogos`, 'Em alguns títulos, resoluções maiores e texturas muito altas podem exigir ajustes de memória gráfica. Isso não determina sozinho se o jogo vai rodar bem.', ['gpu', 'resolution']);
  }
  if (gaming && refresh?.hz <= 75 && known(gpu) && !gpu.integrated) add(insights, 'display-rate', `O monitor atualiza até ${refresh.hz} vezes por segundo`, 'Mais FPS pode reduzir a latência em alguns cenários, mas não aumenta a taxa física de atualização da tela. Pense no monitor junto com a experiência desejada.');
  if (gaming && build.resolution === '1080p' && known(cpu) && known(gpu) && !gpu.integrated && !insights.some(item => item.id === 'high-fps')) add(insights, '1080p', 'Full HD não significa ausência de gargalo', 'Com menos pixels para renderizar, limites de CPU podem ficar mais evidentes quando se busca muito FPS. O modelo exato do i5 e o jogo fazem diferença.');
  if (build.purpose === 'criacao') add(insights, 'apps', 'Escolha para os programas que você usa', 'Edição, renderização e outras tarefas têm exigências diferentes de CPU, GPU, RAM e armazenamento. Informe os programas e o tamanho típico dos projetos.');
  if (build.purpose === 'trabalho') add(insights, 'office', 'O conjunto deve acompanhar sua rotina', 'Para navegar, estudar e usar aplicativos de escritório, converse sobre SSD, memória e número de programas abertos antes de investir em uma GPU dedicada.');
  if (build.purpose === 'stream') add(insights, 'stream', 'Jogo e transmissão compartilham recursos', 'Informe jogo, software, resolução da transmissão e plataforma. Codificação, conexão de internet e uso simultâneo também entram na avaliação.');
  if (!insights.length) add(insights, 'start', 'O equilíbrio começa pelo seu objetivo', 'Escolha uso, resolução e taxa de atualização. Depois combine as peças para ver as orientações específicas.');

  const decisions = ['cpu', 'gpu', 'motherboard', 'ram', 'psu', 'case', 'cooler'].map(key => ({ label: FIELD_LABELS[key], done: Boolean(build[key]) }));
  decisions.push({ label: 'Armazenamento', done: storage.every(Boolean) || hasDrive || storage.some(item => item?.unknown) });
  const completed = decisions.filter(item => item.done).length;
  const pending = decisions.filter(item => !item.done).map(item => item.label);
  const status = errors.length ? 'Revise as incompatibilidades' : completed < decisions.length ? 'Configuração em construção' : unknowns.length ? 'Modelos pendentes de revisão' : 'Pré-seleção pronta para revisão';
  return { build, selected, errors, warnings, checks, insights, completed, total: decisions.length, pending, status, hasDrive };
}

export function buildMessage(input) {
  const result = analyzeBuild(input);
  const { build, selected } = result;
  const rows = Object.keys(FIELD_LABELS).map(key => `${FIELD_LABELS[key]}: ${selected[key]?.name || 'Quero orientação para escolher'}`);
  const alerts = [...result.errors, ...result.warnings].map(item => `- ${item.title}`);
  return ['Olá, Orvysion! Montei uma ideia de PC no site e gostaria de uma análise técnica e orçamento.', '', ...rows,
    build.games.trim() ? `Jogos / programas: ${build.games.trim()}` : '',
    build.notes.trim() ? `Peças que já tenho e preferências: ${build.notes.trim()}` : '',
    '', `Situação da pré-seleção: ${result.status}.`,
    alerts.length ? 'Pontos sinalizados pelo montador:\n' + alerts.join('\n') : 'Sem incompatibilidades detectadas nas verificações disponíveis; revisão técnica ainda necessária.',
    '', 'Por favor, confirmem os modelos, BIOS, compatibilidade completa, fonte, refrigeração, desempenho esperado nos meus usos, valores, disponibilidade e montagem.',
    'Esta configuração é uma intenção de orçamento, sem compra ou envio automático de pedido.'
  ].filter((line, index, lines) => line || (index > 0 && lines[index - 1])).join('\n');
}
export function whatsappUrl(input) { return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(buildMessage(input))}`; }
