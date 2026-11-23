// 懒猫微服 AI 算力舱（AGX Thor）极简核心数据集
// AGX Thor 数据均为懒猫微服实测；Mac Studio 对照分档：单机 Thor 对标 M4 Max (128G)，Thor×2 / Thor×4 对标 M5 Ultra (256G/512G)

const FILTER_TABS = [
  { id: 'featured', label: '🔥 主流推荐', count: 11 },
  { id: 'llm', label: '大语言模型', count: 16 },
  { id: 'video', label: '视频生成', count: 5 },
  { id: 'image', label: '图像生成', count: 4 },
  { id: 'audio', label: '语音与翻译', count: 21 },
  { id: 'ocr_rag', label: 'OCR 与检索', count: 12 },
  { id: 'all', label: '全部模型', count: 58 }
];

// 辅助换算：秒/次 -> 24小时日产能
function perDay(sec) {
  return Math.floor(86400 / sec).toLocaleString('zh-CN');
}

const MODELS = [
  // ================= 大语言模型（16 款）— 每张均含 3 项竖向柱形图对比：Thor vs M5 Ultra vs M4 Max =================
  {
    id: 'deepseek-v41-tp4',
    group: 'llm',
    featured: true,
    name: 'DeepSeek V4.1 Flash 1017 TP4',
    hw: 'Thor×4',
    ctx: '1M',
    tag: '视觉与视频 · 代码旗舰',
    vram: '104G',
    disk: '≥123.1G/台',
    quantLine: '32K 代码库读入：Thor×4 仅 2.6s · M5 Ultra 约 20.5s · M4 Max 约 86s',
    llm: {
      prefill: { thor: '12,463', thorNum: 12463, m5u: '~1,600', m5uNum: 1600, m4m: '~380', m4mNum: 380, unit: 'TPS', ratio: '快 7.8x' },
      ttft:    { thor: '19.5ms', thorNum: 19.5,  m5u: '~650ms', m5uNum: 650,  m4m: '~3.2s', m4mNum: 3200, unit: '', ratio: '快 33x' },
      decode:  { thor: '169.6',  thorNum: 169.6, m5u: '~55',    m5uNum: 55,   m4m: '~22',  m4mNum: 22, unit: 'TPS', ratio: '快 3.1x', sub: '8并发 352.9 TPS' }
    },
    raw: '代码单流 169.6 TPS，对话单流 103.2 TPS，8 并发 352.9 TPS，8K/32K Prefill 10930/12463 TPS，TTFT 19.5ms，视觉与视频理解，1M'
  },
  {
    id: 'qwen-38-27b',
    group: 'llm',
    featured: true,
    name: 'Qwen 3.8 27B 未审查版 DSpine',
    hw: 'Thor',
    ctx: '900K',
    tag: '单机 8 并发 725 TPS',
    vram: '108.8G',
    disk: '≥22.9G',
    quantLine: '32K 代码库读入：Thor 约 10.2s · M5 Ultra 约 18s · M4 Max 约 65s',
    llm: {
      prefill: { thor: '3,204', thorNum: 3203.5, m5u: '~1,800', m5uNum: 1800, m4m: '~500', m4mNum: 500, unit: 'TPS', ratio: '快 6.4x' },
      ttft:    { thor: '85.6ms', thorNum: 85.6,  m5u: '~320ms', m5uNum: 320,  m4m: '~900ms', m4mNum: 900, unit: '', ratio: '快 10.5x' },
      decode:  { thor: '202.6', thorNum: 202.64, m5u: '~85',    m5uNum: 85,   m4m: '~32',  m4mNum: 32, unit: 'TPS', ratio: '快 2.4x', sub: '8并发 725.07 TPS' }
    },
    raw: '单流 202.64 TPS（峰值 205.08），8 并发 725.07 TPS，4K Prefill 3203.5 TPS，TTFT 85.6ms，900K'
  },
  {
    id: 'qwen-36-35b',
    group: 'llm',
    featured: true,
    name: 'Qwen 3.6 35B A3B',
    hw: 'Thor',
    ctx: '256K',
    tag: '图文多模态 · 思考与工具',
    vram: '57.5G',
    disk: '≥28.9G',
    quantLine: '32K 代码库读入：Thor 约 7.2s · M5 Ultra 约 16s · M4 Max 约 55s',
    llm: {
      prefill: { thor: '4,573', thorNum: 4572.6, m5u: '~2,000', m5uNum: 2000, m4m: '~600', m4mNum: 600, unit: 'TPS', ratio: '快 2.3x' },
      ttft:    { thor: '109ms', thorNum: 109,    m5u: '~310ms', m5uNum: 310,  m4m: '~850ms', m4mNum: 850, unit: '', ratio: '快 7.8x' },
      decode:  { thor: '139.3', thorNum: 139.3,  m5u: '~110',   m5uNum: 110,  m4m: '~52',  m4mNum: 52, unit: 'TPS', ratio: '快 2.7x', sub: '8并发 360.66 TPS' }
    },
    raw: '单流 139.30 TPS，8 并发 360.66 TPS，4K Prefill 4572.63 TPS，TTFT 0.109s，图文多模态、思考与工具调用，256K'
  },
  {
    id: 'glm-53-tp4',
    group: 'llm',
    featured: true,
    name: 'GLM 5.3 Flash TP4',
    hw: 'Thor×4',
    ctx: '256K',
    tag: '16 并发代码 371.7 TPS',
    vram: '108G',
    disk: '≥182.6G/台',
    quantLine: '32K 代码库读入：Thor×4 约 8.2s · M5 Ultra 约 21s · M4 Max 约 82s',
    llm: {
      prefill: { thor: '4,023', thorNum: 4023, m5u: '~1,500', m5uNum: 1500, m4m: '~400', m4mNum: 400, unit: 'TPS', ratio: '快 2.7x' },
      ttft:    { thor: '180ms', thorNum: 180,  m5u: '~720ms', m5uNum: 720,  m4m: '~2.4s', m4mNum: 2400, unit: '', ratio: '快 4.0x' },
      decode:  { thor: '109.8', thorNum: 109.8, m5u: '~52',   m5uNum: 52,   m4m: '~24',  m4mNum: 24, unit: 'TPS', ratio: '快 2.1x', sub: '16并发 371.7 TPS' }
    },
    raw: '代码单流 109.8 TPS，正文单流 63.3 TPS，8/16 并发代码 256.1/371.7 TPS，16K/32K Prefill 4023/4000 TPS，TTFT 0.18s，图文多模态与工具调用，256K'
  },
  {
    id: 'deepseek-v41-flash',
    group: 'llm',
    featured: true,
    name: 'DeepSeek V4.1 Flash 1017 未审查版',
    hw: 'Thor×2',
    ctx: '1M',
    tag: '代码峰值 90.11 TPS · 8并发 214 TPS',
    vram: '≈112G',
    disk: '≥449.6G/台',
    quantLine: '32K Prefill 1,500 TPS · 8 并发同代码 214.19 TPS',
    llm: {
      prefill: { thor: '1,500', thorNum: 1500, m5u: '~1,400', m5uNum: 1400, m4m: '~380', m4mNum: 380, unit: 'TPS', ratio: '快 3.9x' },
      ttft:    { thor: '261ms', thorNum: 261,  m5u: '~750ms', m5uNum: 750,  m4m: '~2.6s', m4mNum: 2600, unit: '', ratio: '快 2.9x' },
      decode:  { thor: '64.8',  thorNum: 64.84, m5u: '~50',   m5uNum: 50,   m4m: '~22',  m4mNum: 22, unit: 'TPS', ratio: '快 1.3x', sub: '峰值 90.11 / 8并发 214.19' }
    },
    raw: '代码单流 64.84 TPS（峰值 90.11），8 并发 91.95 TPS（同代码 214.19），32K Prefill 1500.04 TPS，TTFT 0.261s，1M 上下文'
  },
  {
    id: 'flint',
    group: 'llm',
    featured: true,
    name: 'Flint',
    hw: 'Thor',
    ctx: '256K',
    tag: '单流极速冠军 231.5 TPS',
    vram: '48.2G',
    disk: '≥25.1G',
    quantLine: '每秒输出 231.5 Token · 8 并发 412.5 TPS',
    llm: {
      prefill: { thor: '1,691', thorNum: 1691.3, m5u: '~1,450', m5uNum: 1450, m4m: '~480', m4mNum: 480, unit: 'TPS', ratio: '快 3.5x' },
      ttft:    { thor: '470ms', thorNum: 470,    m5u: '~680ms', m5uNum: 680,  m4m: '~1.4s', m4mNum: 1400, unit: '', ratio: '快 3.0x' },
      decode:  { thor: '231.5', thorNum: 231.5,  m5u: '~95',    m5uNum: 95,   m4m: '~42',  m4mNum: 42, unit: 'TPS', ratio: '快 2.4x', sub: '8并发 412.54 TPS' }
    },
    raw: '单流 231.50 TPS，8 并发 412.54 TPS，8K Prefill 1691.32 TPS，TTFT 0.470s，256K'
  },
  {
    id: 'qwen-38-flash-next',
    group: 'llm',
    name: 'Qwen 3.8 Flash Next',
    hw: 'Thor',
    ctx: '256K',
    tag: '高吞吐 218 TPS',
    vram: '112G',
    disk: '≥124.2G',
    quantLine: '4K Prefill 2,410.6 TPS · 8 并发 218.28 TPS',
    llm: {
      prefill: { thor: '2,411', thorNum: 2410.6, m5u: '~1,500', m5uNum: 1500, m4m: '~450', m4mNum: 450, unit: 'TPS', ratio: '快 5.4x' },
      ttft:    { thor: '1.67s', thorNum: 1666,   m5u: '~2.1s',  m5uNum: 2100, m4m: '~4.5s', m4mNum: 4500, unit: '', ratio: '快 2.7x' },
      decode:  { thor: '61.3',  thorNum: 61.28,  m5u: '~58',    m5uNum: 58,   m4m: '~26',  m4mNum: 26, unit: 'TPS', ratio: '快 2.4x', sub: '8并发 218.28 TPS' }
    },
    raw: '单流 61.28 TPS，8 并发 218.28 TPS，4K Prefill 2410.64 TPS，TTFT 1.666s，256K'
  },
  {
    id: 'qwen-38-flash-tensorfold',
    group: 'llm',
    name: 'Qwen 3.8 Flash Next TensorFold',
    hw: 'Thor',
    ctx: '256K',
    tag: '重复提示 53ms 秒回',
    vram: '113G',
    disk: '≥121.8G',
    quantLine: '32K Prefill 1,316 TPS · 8 并发 266.35 TPS',
    llm: {
      prefill: { thor: '1,316', thorNum: 1316, m5u: '~1,250', m5uNum: 1250, m4m: '~420', m4mNum: 420, unit: 'TPS', ratio: '快 3.1x' },
      ttft:    { thor: '104ms', thorNum: 104,  m5u: '~650ms', m5uNum: 650,  m4m: '~2.2s', m4mNum: 2200, unit: '', ratio: '快 6.3x' },
      decode:  { thor: '78.7',  thorNum: 78.72, m5u: '~58',   m5uNum: 58,   m4m: '~26',  m4mNum: 26, unit: 'TPS', ratio: '快 1.4x', sub: '8并发 266.35 TPS' }
    },
    raw: '单流 78.72 TPS，8 并发 266.35 TPS，32K Prefill 1316 TPS，TTFT 0.104s（重复 2K 提示 53ms），256K'
  },
  {
    id: 'qwen-38-flash-uncensored',
    group: 'llm',
    name: 'Qwen 3.8 Flash Next 未审查版',
    hw: 'Thor',
    ctx: '320K',
    tag: '未审查 · 320K 长文',
    vram: '112G',
    disk: '≥125.9G',
    quantLine: '18K Prefill 1,953 TPS · 无审查本地直出',
    llm: {
      prefill: { thor: '1,953', thorNum: 1953.3, m5u: '~1,300', m5uNum: 1300, m4m: '~420', m4mNum: 420, unit: 'TPS', ratio: '快 4.7x' },
      ttft:    { thor: '2.61s', thorNum: 2610,   m5u: '~3.8s',  m5uNum: 3800, m4m: '~9.5s', m4mNum: 9500, unit: '', ratio: '快 3.6x' },
      decode:  { thor: '78.5',  thorNum: 78.46,  m5u: '~58',    m5uNum: 58,   m4m: '~26',  m4mNum: 26, unit: 'TPS', ratio: '快 1.4x', sub: '单流 33.7–78.5 / 8并发 111' }
    },
    raw: '单流 33.72–78.46 TPS，8 并发 60.81–111.04 TPS，18K Prefill 1953.27 TPS，5K TTFT 2.61s，320K'
  },
  {
    id: 'deepseek-v4-vision',
    group: 'llm',
    name: 'DeepSeek V4 Flash Vision 未审查版',
    hw: 'Thor×2',
    ctx: '1M',
    tag: '视觉理解 · 1M 上下文',
    vram: '112G',
    disk: '≥164.3G/台',
    quantLine: '图文多模态 1M 上下文 · 8 并发 180.97 TPS',
    llm: {
      prefill: { thor: '1,432', thorNum: 1432, m5u: '~1,350', m5uNum: 1350, m4m: '~360', m4mNum: 360, unit: 'TPS', ratio: '快 4.0x' },
      ttft:    { thor: '360ms', thorNum: 360,  m5u: '~820ms', m5uNum: 820,  m4m: '~2.8s', m4mNum: 2800, unit: '', ratio: '快 2.3x' },
      decode:  { thor: '63.9',  thorNum: 63.92, m5u: '~48',   m5uNum: 48,   m4m: '~22',  m4mNum: 22, unit: 'TPS', ratio: '快 1.3x', sub: '8并发 180.97 TPS' }
    },
    raw: '单流 50.43–63.92 TPS，8 并发 180.97 TPS，4K/8K Prefill 1432/1405 TPS，TTFT 0.36s，视觉理解，1M'
  },
  {
    id: 'glm-53-flash',
    group: 'llm',
    name: 'GLM 5.3 Flash',
    hw: 'Thor×2',
    ctx: '1M',
    tag: '2.7M KV 缓存池',
    vram: '120G',
    disk: '≥165.8G/台',
    quantLine: '32K Prefill 1,255.8 TPS · 183ms 极速首字',
    llm: {
      prefill: { thor: '1,256', thorNum: 1255.8, m5u: '~1,200', m5uNum: 1200, m4m: '~360', m4mNum: 360, unit: 'TPS', ratio: '快 3.5x' },
      ttft:    { thor: '183ms', thorNum: 183,    m5u: '~680ms', m5uNum: 680,  m4m: '~2.4s', m4mNum: 2400, unit: '', ratio: '快 3.7x' },
      decode:  { thor: '62.5',  thorNum: 62.45,  m5u: '~50',    m5uNum: 50,   m4m: '~24',  m4mNum: 24, unit: 'TPS', ratio: '快 1.2x', sub: '8并发 134.99 TPS' }
    },
    raw: '单流 62.45 TPS，8 并发 134.99 TPS，8K/32K Prefill 1193.9/1255.8 TPS，TTFT 0.183s，约 2.7M KV 缓存池，1M'
  },
  {
    id: 'glm-53-full',
    group: 'llm',
    name: 'GLM 5.3 Full',
    hw: 'Thor×2',
    ctx: '12K',
    tag: '满血旗舰 · 8 共享槽',
    vram: '120G',
    disk: '≥213.7G/台',
    quantLine: '双机本地满血推理 · 8 并发 37.20 TPS',
    llm: {
      prefill: { thor: '178',   thorNum: 178.25, m5u: '~240',  m5uNum: 240,  m4m: '~90',   m4mNum: 90, unit: 'TPS', ratio: '快 2.0x' },
      ttft:    { thor: '2.26s', thorNum: 2260,   m5u: '~3.8s', m5uNum: 3800, m4m: '~9.5s', m4mNum: 9500, unit: '', ratio: '快 1.7x' },
      decode:  { thor: '23.8',  thorNum: 23.8,   m5u: '~26',   m5uNum: 26,   m4m: '~14',   m4mNum: 14, unit: 'TPS', ratio: '快 1.7x', sub: '8并发 37.20 TPS' }
    },
    raw: '128/2K/8K 输入单流 22.54/20.96/23.80 TPS，8 并发 37.20 TPS，2K Prefill 178.25 TPS，TTFT 2.26s，8 个共享会话槽，12,224 token'
  },
  {
    id: 'gemma-4-31b',
    group: 'llm',
    name: 'Gemma 4 31B IT Heretic',
    hw: 'Thor',
    ctx: '256K',
    tag: '图文多模态 · 工具调用',
    vram: '54.1G',
    disk: '≥37.3G',
    quantLine: '6K Prefill 2,189 TPS · 185ms 首字响应',
    llm: {
      prefill: { thor: '2,189', thorNum: 2189.2, m5u: '~1,550', m5uNum: 1550, m4m: '~460', m4mNum: 460, unit: 'TPS', ratio: '快 4.8x' },
      ttft:    { thor: '185ms', thorNum: 185,    m5u: '~520ms', m5uNum: 520,  m4m: '~1.8s', m4mNum: 1800, unit: '', ratio: '快 2.8x' },
      decode:  { thor: '36.8',  thorNum: 36.76,  m5u: '~55',    m5uNum: 55,   m4m: '~25',  m4mNum: 25, unit: 'TPS', ratio: '快 1.5x', sub: '8并发 158.93 TPS' }
    },
    raw: 'T5000 单流 36.76 TPS，8 并发 158.93 TPS，6K Prefill 2189.15 TPS，TTFT 0.185s；T4000 单流 27.75 TPS，图文多模态、思考与工具调用，32K–256K'
  },
  {
    id: 'nemotron-35-bolt',
    group: 'llm',
    name: 'Nemotron 3.5 Bolt E4B',
    hw: 'Thor',
    ctx: '256K',
    tag: '可控思考 · 24G 轻显存',
    vram: '24.1G',
    disk: '≥6.8G',
    quantLine: '108 TPS 高速对话 · 180ms 极速首字',
    llm: {
      prefill: { thor: 'FP4高吞吐', thorNum: 2200, m5u: '~1,800', m5uNum: 1800, m4m: '~650', m4mNum: 650, unit: '', ratio: '快 3.4x' },
      ttft:    { thor: '180ms', thorNum: 180,     m5u: '~320ms', m5uNum: 320,  m4m: '~750ms', m4mNum: 750, unit: '', ratio: '快 4.2x' },
      decode:  { thor: '108.3', thorNum: 108.29,  m5u: '~120',   m5uNum: 120,  m4m: '~60',  m4mNum: 60, unit: 'TPS', ratio: '快 1.8x', sub: '对话/可控思考/工具' }
    },
    raw: '单流 108.29 TPS，TTFT 180ms，对话/可控思考/工具调用，256K'
  },
  {
    id: 'qwen-35-4b',
    group: 'llm',
    name: 'Qwen 3.5 4B（text & vision）',
    hw: 'Thor',
    ctx: '32K',
    tag: '8G 超轻图文理解',
    vram: '8G',
    disk: '≥3.1G',
    quantLine: '仅占 8G 显存 · 单流 119 TPS 图文秒答',
    llm: {
      prefill: { thor: '端侧极速', thorNum: 2600, m5u: '~2,200', m5uNum: 2200, m4m: '~800', m4mNum: 800, unit: '', ratio: '快 3.3x' },
      ttft:    { thor: '<100ms',  thorNum: 80,   m5u: '~180ms', m5uNum: 180,  m4m: '~350ms', m4mNum: 350, unit: '', ratio: '快 3.5x' },
      decode:  { thor: '119',     thorNum: 119,  m5u: '~145',   m5uNum: 145,  m4m: '~80',  m4mNum: 80, unit: 'TPS', ratio: '快 1.5x', sub: '图文多模态理解' }
    },
    raw: '单流 119 TPS，图文理解，32K'
  },
  {
    id: 'minicpm5-2b',
    group: 'llm',
    name: 'MiniCPM5-2B',
    hw: 'Thor',
    ctx: '128K',
    tag: '6.8G 显存 · 128K',
    vram: '6.8G',
    disk: '≥2.7G',
    quantLine: '6.8G 显存即跑 128K 长文 · 85.54 TPS',
    llm: {
      prefill: { thor: '5K/0.68s', thorNum: 2800, m5u: '~2,400', m5uNum: 2400, m4m: '~900', m4mNum: 900, unit: '', ratio: '快 3.1x' },
      ttft:    { thor: '680ms',    thorNum: 680,  m5u: '~900ms', m5uNum: 900,  m4m: '~1.6s', m4mNum: 1600, unit: '', ratio: '快 2.4x' },
      decode:  { thor: '85.5',     thorNum: 85.54, m5u: '~110',  m5uNum: 110,  m4m: '~68',  m4mNum: 68, unit: 'TPS', ratio: '快 1.3x', sub: '128K 上下文' }
    },
    raw: '单流 85.54 TPS，5K TTFT 0.68s，128K'
  },

  // ================= 视频生成（5 款） =================
  {
    id: 'minimax-h3-sol',
    group: 'video',
    featured: true,
    name: 'MiniMax H3 Sol',
    hw: 'Thor',
    tag: '1–15s · 最高 1344×768',
    vram: '118G',
    disk: '≥221.3G',
    quantLine: '5.1s 960×544 仅 34.2 秒 · 日产 2,526 条',
    metrics3: [
      { label: '5.1s 960×544', val: '34.2 秒' },
      { label: '24h 日产能', val: `${perDay(34.2)} 条` },
      { label: '1s 极速预览', val: '6.1 秒' }
    ],
    raw: '1s 640×384 6.1s（首帧 6.7s、参考图 5.9s），5.125s 960×544 34.2s，15s 1344×768 418.8s；支持 1–15s、640×384 至 1344×768'
  },
  {
    id: 'pika-h3-lora',
    group: 'video',
    featured: true,
    name: 'Pika H3 Flex Turbo LoRA',
    hw: 'Thor',
    tag: '图生视频 · 5s/15s',
    vram: '114G',
    disk: '≥96.3G',
    quantLine: '5s 标清 31 秒（日产 2,787 条）· 768p 日产 811 条',
    metrics3: [
      { label: '5s 640×384', val: '31.0 秒' },
      { label: '24h 日产能', val: `${perDay(31.0)} 条` },
      { label: '5s 1344×768', val: '106.5 秒' }
    ],
    raw: '5s 640×384/832×480/864×480/1344×768 为 31.0/40.4/44.4/106.5s；15s 为 73.0/133.6/144.3/404.6s；480p 图生视频 5s 47.9–54.2s、15s 152.2–160.6s'
  },
  {
    id: 'pika-h3-ref2va',
    group: 'video',
    name: 'Pika H3 Flex Turbo Ref2VA',
    hw: 'Thor',
    tag: '多参考图/视频/音频混合',
    vram: '110G',
    disk: '≥99.8G',
    quantLine: '2-Step 5s 预览 26.1 秒 · 4-Step 36.2 秒',
    metrics3: [
      { label: '2-Step 预览', val: '26.1 秒' },
      { label: '4-Step 5s', val: '36.2 秒' },
      { label: '日产能(4步)', val: `${perDay(36.2)} 条` }
    ],
    raw: '多参考图/视频/音频/首尾帧混合生成；4-Step 5s 640×384/480p(3:4)/480p(16:9)/1344×768 为 36.2/46.2/64.2/1344×768 134.4s，15s 1344×768 1211.6s；2-Step 预览 5s 26.1–44.2s，8-Step 高清 5s 52.2–102.3s，6s 音频自适应 73.1s'
  },
  {
    id: 'minimax-h3-duo',
    group: 'video',
    name: 'MiniMax H3 Duo',
    hw: 'Thor×2',
    tag: '双 Thor 协同生成',
    vram: '96G',
    disk: '≥56.7G/台',
    quantLine: '832×480 20 步完整 37.2 秒 · 日产 2,322 条',
    metrics3: [
      { label: '完整生成', val: '37.20 秒' },
      { label: '24h 日产能', val: `${perDay(37.2)} 条` },
      { label: '纯采样耗时', val: '32.69 秒' }
    ],
    raw: '双 Thor 协同，832×480、2.33s（56 帧/24fps）、20 步完整生成 37.20s（采样 32.69s）'
  },
  {
    id: 'minimax-h3',
    group: 'video',
    name: 'MiniMax H3',
    hw: 'Thor',
    tag: '5s / 10s 视频生成',
    vram: '102G',
    disk: '≥240.9G',
    quantLine: '5s 640×384 耗时 64.9 秒 · 日产 1,331 条',
    metrics3: [
      { label: '5s 640×384', val: '64.9 秒' },
      { label: '24h 日产能', val: `${perDay(64.9)} 条` },
      { label: '10s 640×384', val: '130.4 秒' }
    ],
    raw: '5s 640×384/832×480 为 64.9/107.4s，10s 640×384 为 130.4s'
  },

  // ================= 图像生成（4 款） =================
  {
    id: 'minimax-h3-image',
    group: 'image',
    featured: true,
    name: 'MiniMax-H3-Image',
    hw: 'Thor',
    tag: '2K 旗舰直出 · 参考图编辑',
    vram: '112G',
    disk: '≥132.4G',
    quantLine: '2048×2048 仅 13.35 秒/张 · 日产 6,471 张',
    metrics3: [
      { label: '2K 单张耗时', val: '13.35 秒' },
      { label: '24h 日产能', val: `${perDay(13.35)} 张` },
      { label: '分辨率/步数', val: '2K · 6步' }
    ],
    raw: 'BF16 2048×2048 6 步 13.35s/张，支持参考图编辑'
  },
  {
    id: 'qwen-image-turbo',
    group: 'image',
    name: 'Qwen Image 2.1 Turbo',
    hw: 'Thor',
    tag: '8 步极速出图 · 图片编辑',
    vram: '36G',
    disk: '≥17.8G',
    quantLine: '512×512 仅 3.3 秒/张 · 日产 26,181 张',
    metrics3: [
      { label: '单张耗时', val: '3.3 秒' },
      { label: '24h 日产能', val: `${perDay(3.3)} 张` },
      { label: '步数/编辑', val: '8步 · 支持' }
    ],
    raw: '512×512 8 步 3.3s/张，支持图片编辑'
  },
  {
    id: 'qwen-image-heretic',
    group: 'image',
    name: 'Qwen Image 2.1 Heretic',
    hw: 'Thor',
    tag: '18G 显存 · BF16/NVFP4',
    vram: '18G',
    disk: '≥13.2G',
    quantLine: '512×512 20 步 5.7 秒/张 · 日产 15,157 张',
    metrics3: [
      { label: '单张耗时', val: '5.7 秒' },
      { label: '24h 日产能', val: `${perDay(5.7)} 张` },
      { label: '显存占用', val: '仅 18G' }
    ],
    raw: '512×512 20 步 5.7s/张，BF16/NVFP4/GGUF'
  },
  {
    id: 'comfyui-2',
    group: 'image',
    name: 'ComfyUI 2',
    hw: 'Thor',
    tag: '可视化工作流平台',
    vram: '按工作流',
    disk: '按模型库',
    quantLine: '节点式图像/视频流水线 · 局域网 IP+端口直连',
    metrics3: [
      { label: '访问方式', val: 'IP+端口' },
      { label: '文件管理', val: '内置直传' },
      { label: '支持任务', val: '图 + 视频' }
    ],
    raw: '可视化节点式图像/视频工作流平台，内置文件管理器，IP+端口访问'
  },

  // ================= 语音识别 / 合成 / 翻译 / 对齐（21 款） =================
  {
    id: 'whisper-v3-turbo',
    group: 'audio',
    featured: true,
    name: 'Whisper Large V3 Turbo',
    hw: 'Thor',
    tag: '语音识别 · 100 种语言',
    vram: '6G',
    disk: '≥16.5G',
    quantLine: '30 分钟音频 4 并发仅需 12.1 秒（148× 实时）',
    metrics3: [
      { label: '30分钟音频', val: '12.1 秒' },
      { label: '4并发倍率', val: '148.15×' },
      { label: '3s 中文耗时', val: '77.7 ms' }
    ],
    raw: '3.0s 中文音频 77.7ms，4 并发 148.15 倍实时，100 种语言'
  },
  {
    id: 'sensevoice-small',
    group: 'audio',
    name: 'SenseVoiceSmall Q4_K',
    hw: 'Thor',
    tag: '语音识别 · 1G 显存',
    vram: '1G',
    disk: '≥0.1G',
    quantLine: '30 分钟中文 WAV 仅需 16.5 秒（109× 实时）',
    metrics3: [
      { label: '30分钟音频', val: '16.5 秒' },
      { label: '实时倍率', val: '109×' },
      { label: '5.55s WAV', val: '51 ms' }
    ],
    raw: '5.55s 中文 WAV 51ms（109 倍实时），MP3 104ms'
  },
  {
    id: 'nemotron-transcribe',
    group: 'audio',
    name: 'Nemotron 3.5 Transcribe（30B-A4B）',
    hw: 'Thor',
    tag: '语音识别 · 单次 1 小时',
    vram: '47G',
    disk: '≥21.2G',
    quantLine: '30 分钟中文音频转写约 2.2 分钟 · 最长单次 1h',
    metrics3: [
      { label: '30分钟音频', val: '133 秒' },
      { label: '16.9s 转写', val: '1.25 秒' },
      { label: '单次上限', val: '1 小时' }
    ],
    raw: '16.93s 中文音频转写 1.25s，单次最长 1 小时'
  },
  {
    id: 'qwen3-asr',
    group: 'audio',
    name: 'Qwen3-ASR（0.6B/1.7B）',
    hw: 'Thor',
    tag: '流式语音识别',
    vram: '8G',
    disk: '≥17.6G',
    quantLine: '2.2s 中文仅 85ms · 30 分钟约 69 秒',
    metrics3: [
      { label: '2.2s 中文', val: '85 ms' },
      { label: '30分钟换算', val: '69.5 秒' },
      { label: '识别模式', val: '实时流式' }
    ],
    raw: '0.6B 转写 2.2s 中文 85ms，流式识别，单次最长 30s'
  },
  {
    id: 'confucius4-r2t2',
    group: 'audio',
    name: 'Confucius4-R2T2',
    hw: 'Thor',
    tag: '语音识别 · 23.4× 实时',
    vram: '32G',
    disk: '≥6.6G',
    quantLine: '30 分钟中文音频转写仅需 77 秒',
    metrics3: [
      { label: '30分钟音频', val: '77 秒' },
      { label: '实时倍率', val: '23.4×' },
      { label: '6.74s 中文', val: '289 ms' }
    ],
    raw: '6.74s 中文音频 289ms（23.4 倍实时）'
  },
  {
    id: 'hy-simulmt',
    group: 'audio',
    name: 'Hy-SimulMT 语音翻译',
    hw: 'Thor',
    tag: '中英实时语音同传',
    vram: '22G',
    disk: '≥19.2G',
    quantLine: '66s 英语译中文 19.17s · 30 分钟仅 8.7 分钟',
    metrics3: [
      { label: '30分钟直译', val: '8.7 分钟' },
      { label: '66s 英译中', val: '19.17 秒' },
      { label: '实时倍率', val: '3.4× 实时' }
    ],
    raw: '66s 英语译中文 19.17s，支持中英实时语音流'
  },
  {
    id: 'nemotron-diarization',
    group: 'audio',
    name: 'Nemotron 3 Diarization',
    hw: 'Thor',
    tag: '说话人分离 · 最多 8 人',
    vram: '16G',
    disk: '≥0.6G',
    quantLine: '30 分钟多人会议仅 19.9 秒 · 1 小时 39.75 秒',
    metrics3: [
      { label: '30分钟会议', val: '19.9 秒' },
      { label: '1小时会议', val: '39.75 秒' },
      { label: '说话人上限', val: '8 人' }
    ],
    raw: '5s 音频 25.1ms，1h 音频 39.75s，最多 8 位说话人'
  },
  {
    id: 'kokoro-82m',
    group: 'audio',
    name: 'Kokoro-82M v1.1-zh',
    hw: 'Thor',
    tag: '语音合成 · 157 音色',
    vram: '7G',
    disk: '≥19.8G',
    quantLine: '短句 0.10 秒生成 · 4 并发 15.45 条/秒',
    metrics3: [
      { label: '中文短句', val: '101.8 ms' },
      { label: '4并发吞吐', val: '15.45 条/s' },
      { label: '内置音色', val: '157 种' }
    ],
    raw: '中/英文短句 101.8ms/77.6ms，4 并发 15.45 条/s，157 音色'
  },
  {
    id: 'sophon-4b-flash',
    group: 'audio',
    name: 'Sophon-Realtime 4B Flash',
    hw: 'Thor',
    tag: '全双工实时语音',
    vram: '24G',
    disk: '≥16.2G',
    quantLine: '首字 110ms · 首音 640ms · 双路 2.49× 吞吐',
    metrics3: [
      { label: '首字延迟', val: '110 ms' },
      { label: '首音延迟', val: '640 ms' },
      { label: 'RTF / 双路', val: '0.56 / 2.49×' }
    ],
    raw: '首音 0.64s，首字 0.11s，RTF 0.56，双路吞吐 2.49x'
  },
  {
    id: 'sophon-32b',
    group: 'audio',
    name: 'Sophon-Realtime 32B',
    hw: 'Thor',
    tag: '全双工 + 情感合成',
    vram: '86G',
    disk: '≥42G',
    quantLine: '32B 旗舰全双工语音 · Tag 情感精准控制',
    metrics3: [
      { label: '首字延迟', val: '410 ms' },
      { label: '首音延迟', val: '3.43 秒' },
      { label: '双路吞吐', val: '1.55×' }
    ],
    raw: '首音 3.43s，首字 0.41s，RTF 1.05，双路吞吐 1.55x，全双工 + Tag 情感合成'
  },
  {
    id: 'qwen3-tts',
    group: 'audio',
    name: 'Qwen3-TTS 0.6B',
    hw: 'Thor',
    tag: '零样本声音克隆',
    vram: '8G',
    disk: '≥18.3G',
    quantLine: '首音 0.25 秒 · 中文整句 0.93 秒',
    metrics3: [
      { label: '首音延迟', val: '250 ms' },
      { label: '中文整句', val: '0.93 秒' },
      { label: '克隆能力', val: '零样本' }
    ],
    raw: '中文整句 0.93s，首音 0.25s，零样本克隆'
  },
  {
    id: 'indextts-25',
    group: 'audio',
    name: 'IndexTTS 2.5',
    hw: 'Thor',
    tag: '五语种克隆 · 情绪控制',
    vram: '12G',
    disk: '≥24.6G',
    quantLine: '中文短句 1.30s · 支持情绪语速流式输出',
    metrics3: [
      { label: '中文短句', val: '1.30 秒' },
      { label: '英文短句', val: '1.67 秒' },
      { label: '克隆语种', val: '5 语种' }
    ],
    raw: '中文短句 1.30s，英文短句 1.67s，五语种克隆、情绪语速、流式'
  },
  {
    id: 'auk',
    group: 'audio',
    name: 'AuK',
    hw: 'Thor',
    tag: '语音合成 + 音频编辑',
    vram: '36G',
    disk: '≥33.5G',
    quantLine: '3s 中文合成 1.07s · 支持局部音频编辑',
    metrics3: [
      { label: '2s 英文', val: '0.89 秒' },
      { label: '3s 中文', val: '1.07 秒' },
      { label: '2s 编辑', val: '1.50 秒' }
    ],
    raw: '2s 英/3s 中/2s 编辑 0.89s/1.07s/1.50s，支持音频编辑'
  },
  {
    id: 'firefox-translations',
    group: 'audio',
    name: 'Firefox Translations 机器翻译',
    hw: 'Thor',
    tag: '1G 内存 · 791 条/s',
    vram: '≈1G',
    disk: '≥2.5G',
    quantLine: '4.25ms 极速翻译 · 1 分钟翻译 4.7 万条',
    metrics3: [
      { label: '单条延迟', val: '4.25 ms' },
      { label: '每秒吞吐', val: '791 条/s' },
      { label: '内存占用', val: '≈1G' }
    ],
    raw: '延迟 4.25ms，791 条/s'
  },
  {
    id: 'confucius4-t3po',
    group: 'audio',
    name: 'Confucius4-T3PO',
    hw: 'Thor',
    tag: '14B 中英同传翻译',
    vram: '40G',
    disk: '≥29.5G',
    quantLine: '单流 1.26 秒 · 4 并发 3.14 条/秒',
    metrics3: [
      { label: '单流耗时', val: '1.26 秒' },
      { label: '4并发吞吐', val: '3.14 条/s' },
      { label: '参数规模', val: '14B' }
    ],
    raw: '14B 中英同传，单流 1.26s，4 并发 3.14 条/s'
  },
  {
    id: 'hy-mt2',
    group: 'audio',
    name: 'Hy-MT2 翻译',
    hw: 'Thor',
    tag: 'FP8 108.7 TPS · 256并发',
    vram: '39G',
    disk: '≥4.6G',
    quantLine: 'FP8 首字 30ms · 最高支持 256 路并发',
    metrics3: [
      { label: '1.8B FP8', val: '108.7 TPS' },
      { label: 'FP8 首字', val: '30 ms' },
      { label: '最高并发', val: '256 路' }
    ],
    raw: '1.8B BF16 67.9 TPS（FP8 108.7），7B 16.7 TPS，TTFT 43/136ms（FP8 30ms），32/256 并发'
  },
  {
    id: 'index-translate',
    group: 'audio',
    name: 'Index Translate 翻译',
    hw: 'Thor',
    tag: '2B/9B/35B 三档切换',
    vram: '39G',
    disk: '≥19.2G',
    quantLine: '2B 104 TPS · 35B 旗舰翻译 48 TPS',
    metrics3: [
      { label: '2B 速度', val: '104 TPS' },
      { label: '9B 速度', val: '40 TPS' },
      { label: '35B 速度', val: '48 TPS' }
    ],
    raw: '2B/9B/35B 单流 104/40/48 TPS'
  },
  {
    id: 'qwen3-aligner',
    group: 'audio',
    name: 'Qwen3 ForcedAligner（0.6B）',
    hw: 'Thor',
    tag: '11 语种词/字级时间戳',
    vram: '8G',
    disk: '≥3.9G',
    quantLine: '10.9s 音频对齐仅 35.8ms（305× 实时）',
    metrics3: [
      { label: '10.9s 对齐', val: '35.8 ms' },
      { label: '覆盖语种', val: '11 种' },
      { label: '单次上限', val: '300 秒' }
    ],
    raw: '10.93s 韩语音频对齐 35.8ms，11 种语言词/字级时间戳，最长 300s'
  },
  {
    id: 'demucs',
    group: 'audio',
    name: 'Demucs（HTDemucs）',
    hw: 'Thor',
    tag: '44.1kHz 四轨人声乐器分离',
    vram: '6G',
    disk: '≥3.6G',
    quantLine: '24s 歌曲四轨分离仅 1.11s（21.6× 实时）',
    metrics3: [
      { label: '24s 分离', val: '1.11 秒' },
      { label: '3分钟歌曲', val: '约 8.3 秒' },
      { label: '采样率', val: '44.1 kHz' }
    ],
    raw: '23.97s 音频四轨分离 1.11s，44.1kHz，最长 180s'
  },
  {
    id: 'pyannote-seg',
    group: 'audio',
    name: 'Pyannote Segmentation 3.0',
    hw: 'Thor',
    tag: '语音活动与重叠检测',
    vram: '8G',
    disk: '≥0.2G',
    quantLine: '30s 音频分段 96.7ms（310× 实时）',
    metrics3: [
      { label: '10s 分段', val: '36.2 ms' },
      { label: '30s 分段', val: '96.7 ms' },
      { label: '磁盘占用', val: '≥0.2G' }
    ],
    raw: '10s/30s 音频分段 36.2ms/96.7ms，检测语音活动、切换与重叠'
  },
  {
    id: 'cam-pp',
    group: 'audio',
    name: 'CAM++',
    hw: 'Thor',
    tag: '192 维声纹提取与聚类',
    vram: '4G',
    disk: '≥1G',
    quantLine: '10s 声纹提取 27.4ms · 8 段批量聚类',
    metrics3: [
      { label: '10s 提取', val: '27.4 ms' },
      { label: '30s 提取', val: '76.9 ms' },
      { label: '声纹维度', val: '192 维' }
    ],
    raw: '10s/30s 声纹提取 27.4ms/76.9ms，192 维，最多 8 段批量聚类'
  },

  // ================= OCR / 向量检索 / 决策 / 人脸（12 款） =================
  {
    id: 'unlimited-ocr-2',
    group: 'ocr_rag',
    featured: true,
    name: 'Unlimited-OCR-2',
    hw: 'Thor',
    tag: '百页 PDF 连续识别',
    vram: '20G',
    disk: '≥8.6G',
    quantLine: '单页中文 0.72 秒 · 100 页 PDF 约 72 秒读完',
    metrics3: [
      { label: '单页中文', val: '0.72 秒' },
      { label: '单页英文', val: '0.56 秒' },
      { label: '100页 PDF', val: '约 72 秒' }
    ],
    raw: '英/中/两页 0.56s/0.72s/1.04s，支持百页连续识别'
  },
  {
    id: 'pp-ocrv6',
    group: 'ocr_rag',
    name: 'PP-OCRv6',
    hw: 'Thor',
    tag: '高速卡证/票据识别',
    vram: '3G',
    disk: '≥29M',
    quantLine: '每秒 68.1 张 · 1 分钟识别 4,086 张登机牌',
    metrics3: [
      { label: 'Tiny 速度', val: '68.1 张/s' },
      { label: '每分钟产能', val: '4,086 张' },
      { label: '磁盘占用', val: '仅 29M' }
    ],
    raw: '896×528 登机牌 Tiny/Small/Medium 68.1/46.2/27.6 张/s'
  },
  {
    id: 'pp-doclayout',
    group: 'ocr_rag',
    name: 'PP-DocLayoutV3',
    hw: 'Thor',
    tag: '版面分析 + 阅读顺序',
    vram: '11G',
    disk: '≥3.8G',
    quantLine: '单图 38.92ms · 每秒分析 25.7 页文档',
    metrics3: [
      { label: '单图耗时', val: '38.92 ms' },
      { label: '每秒页数', val: '25.7 页/s' },
      { label: '批量能力', val: '4 图批量' }
    ],
    raw: '单图版面分析 38.92ms，文字/表格/图像区域 + 阅读顺序，4 图批量'
  },
  {
    id: 'unlimited-ocr',
    group: 'ocr_rag',
    name: 'Unlimited-OCR',
    hw: 'Thor',
    tag: '中英文多页 PDF',
    vram: '20G',
    disk: '≥9.5G',
    quantLine: '短文 0.70 秒 · 长文 1.74 秒',
    metrics3: [
      { label: '短文耗时', val: '0.70 秒' },
      { label: '长文耗时', val: '1.74 秒' },
      { label: '支持格式', val: '中英/PDF' }
    ],
    raw: '短文 0.70s，长文 1.74s，中英文、多页、PDF'
  },
  {
    id: 'embedding-gemma-2',
    group: 'ocr_rag',
    name: 'EmbeddingGemma 2',
    hw: 'Thor',
    tag: '文/图/音/视 全模态检索',
    vram: '6G',
    disk: '≥5.4G',
    quantLine: '文本 5.18ms · 音频 14.9ms · 视频 67.4ms',
    metrics3: [
      { label: '文本向量', val: '5.18 ms' },
      { label: '视频向量', val: '67.38 ms' },
      { label: '覆盖语种', val: '100+ 语言' }
    ],
    raw: '文本/图片/音频/视频 5.18/82.49/14.93/67.38ms，100+ 语言，128–768 四档维度，8K'
  },
  {
    id: 'bge-m3',
    group: 'ocr_rag',
    name: 'BGE-M3 稠密向量',
    hw: 'Thor',
    tag: '1024 维多语种 RAG',
    vram: '9G',
    disk: '≥2.1G',
    quantLine: '单条 7ms · 8 条批量 18ms（每秒 444 条）',
    metrics3: [
      { label: '单条延迟', val: '7 ms' },
      { label: '8条批量', val: '18 ms' },
      { label: '向量维度', val: '1024 维' }
    ],
    raw: '单条 7ms，8 条批量 18ms，1024 维多语种'
  },
  {
    id: 'bge-reranker',
    group: 'ocr_rag',
    name: 'BGE-Reranker-v2-M3 重排',
    hw: 'Thor',
    tag: '多语言精排 · RAG 提准',
    vram: '7G',
    disk: '≥2.1G',
    quantLine: '单次精排仅 10ms · 每秒 100 次精排',
    metrics3: [
      { label: '单次重排', val: '10 ms' },
      { label: '每秒吞吐', val: '100 次/s' },
      { label: '显存占用', val: '7G' }
    ],
    raw: '单次重排 10ms，多语言精排'
  },
  {
    id: 'qwen3-embedding',
    group: 'ocr_rag',
    name: 'Qwen3-Embedding（0.6B/4B/8B）',
    hw: 'Thor',
    tag: '32K 长文本可变维度',
    vram: '6G',
    disk: '≥3.1G',
    quantLine: '128-token 单条 9.4ms · 32K 上下文',
    metrics3: [
      { label: '单条延迟', val: '9.4 ms' },
      { label: '最大长度', val: '32K' },
      { label: '维度支持', val: '可变维度' }
    ],
    raw: '0.6B 128-token 单条 9.4ms，检索指令、可变维度、32K'
  },
  {
    id: 'zh-clip',
    group: 'ocr_rag',
    name: 'ZH-CLIP ViT-L/14',
    hw: 'Thor',
    tag: '中文以文搜图 · 1.7G 显存',
    vram: '1.7G',
    disk: '≥3G',
    quantLine: '单文 4.5ms · 8 图批量 36.4ms（220 图/s）',
    metrics3: [
      { label: '单文耗时', val: '4.5 ms' },
      { label: '8图批量', val: '36.4 ms' },
      { label: '显存占用', val: '1.7G' }
    ],
    raw: '单文/单图/8 图 4.5ms/13.6ms/36.4ms，768 维'
  },
  {
    id: 'decision-3',
    group: 'ocr_rag',
    name: 'Decision 3.0（0.6B–26B）',
    hw: 'Thor',
    tag: '多模态研判 · 16 问题并行',
    vram: '8G',
    disk: '≥4.3G',
    quantLine: '文本 21.8ms · 视频 73.8ms · 图片 81.2ms',
    metrics3: [
      { label: '文本研判', val: '21.83 ms' },
      { label: '视频研判', val: '73.79 ms' },
      { label: '并行问题', val: '16 个' }
    ],
    raw: '0.6B 文本/图片/视频 21.83/81.15/73.79ms，16 个问题，8K 上下文'
  },
  {
    id: 'buffalo-l',
    group: 'ocr_rag',
    name: 'buffalo_l 人脸识别',
    hw: 'Thor',
    tag: '检测 + 特征提取',
    vram: '3G',
    disk: '≥0.1G',
    quantLine: '6 张人脸检测仅 29ms · 每秒 200+ 人脸',
    metrics3: [
      { label: '6张人脸', val: '29 ms' },
      { label: '显存占用', val: '3G' },
      { label: '磁盘占用', val: '≥0.1G' }
    ],
    raw: '6 张人脸检测 29ms，检测 + 特征提取'
  },
  {
    id: 'blip-caption',
    group: 'ocr_rag',
    name: 'BLIP Image Captioning Large',
    hw: 'Thor',
    tag: '1–32 图批量英文描述',
    vram: '12G',
    disk: '≥5.3G',
    quantLine: '单图 207ms · 3 图 443ms · 批量打标利器',
    metrics3: [
      { label: '单图耗时', val: '207.4 ms' },
      { label: '3图批量', val: '442.8 ms' },
      { label: '最大批次', val: '32 图' }
    ],
    raw: '单图 207.4ms，3 图 442.8ms，每批 1–32 图，英文描述'
  }
];

// 量化产能数据（页面 2）
const QUANT_CODE_REPO = [
  { name: 'Thor×4 · DeepSeek V4.1 TP4', prefill: '12,463 TPS', sec: 2.6, ctx: '1M 上下文', highlight: true },
  { name: 'Thor · Qwen 3.6 35B A3B', prefill: '4,572 TPS', sec: 7.2, ctx: '256K 上下文', highlight: true },
  { name: 'Thor · Qwen 3.8 27B DSpine', prefill: '3,203 TPS', sec: 10.2, ctx: '900K 上下文', highlight: true },
  { name: 'Mac Studio M5 Ultra（参考）', prefill: '~1,600 TPS', sec: 20.5, ctx: '80 核 GPU Neural Accelerator', isMac: true },
  { name: 'Mac Studio M4 Max（参考）', prefill: '~500 TPS', sec: 65.5, ctx: '40 核 GPU · 无硬件 FP4', isMac: true }
];

// 硬件规格数据（页面 3）
const HW_TIERS = [
  {
    name: 'AGX Thor 单机版',
    badge: '桌面旗舰',
    vram: '128 GB',
    tflops: '2,070 TFLOPS',
    tdp: '40–130 W',
    models: '支持 51 款模型',
    bestFor: '个人写代码、2K 生图、15s 视频、全双工语音'
  },
  {
    name: 'AGX Thor×2 双机版',
    badge: '百万上下文',
    vram: '256 GB',
    tflops: '4,140 TFLOPS',
    tdp: '双机协同',
    models: '解锁 1M 上下文 & 双机视频',
    bestFor: 'DeepSeek V4.1 / GLM 5.3 Full / MiniMax H3 Duo'
  },
  {
    name: 'AGX Thor×4 集群版',
    badge: '团队超算 TP4',
    vram: '512 GB',
    tflops: '8,280 TFLOPS',
    tdp: '四机张量并行',
    models: '全系 58 款满血运行',
    bestFor: '16 路团队并发代码、12,463 TPS 极速预填充'
  }
];

const HW_SPEC_ROWS = [
  { k: '核心模组', thor: 'NVIDIA Jetson AGX Thor（T5000）', mac: 'Apple M4 Max / M3 Ultra' },
  { k: 'AI 矩阵算力', thor: '2,070 TFLOPS (Sparse FP4) / 1,035 Dense FP4', mac: '无原生 FP4/FP8 Tensor Core' },
  { k: 'GPU 架构', thor: 'NVIDIA Blackwell · 2,560 CUDA 核心 + Transformer Engine', mac: 'Apple 集成 GPU（Metal / MLX）' },
  { k: 'Prefill 预填充实测', thor: '1,500 – 12,463 TPS（读代码库秒级响应）', mac: '通常 200 – 600 TPS（长上下文等待久）' },
  { k: 'CPU', thor: '14 核 Arm Neoverse-V3AE', mac: '16 核 – 32 核 Apple CPU' },
  { k: '统一显存容量', thor: '单机 128 GB LPDDR5X（双机 256G / 四机 512G）', mac: '64 GB – 512 GB 统一内存' },
  { k: 'AI 软件生态', thor: '原生 CUDA · vLLM / TensorRT-LLM / ComfyUI 2 开箱即用', mac: 'MLX / llama.cpp（部分前沿视频/语音模型缺适配）' },
  { k: '集群扩展能力', thor: '支持 Thor×2 / Thor×4 线性扩展（TP4 张量并行）', mac: '单机为主，跨机并行生态弱' },
  { k: '整机功耗', thor: '单机 40W – 130W（静音桌面 / 机架友好）', mac: '约 100W – 270W' }
];
