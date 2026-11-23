// 懒猫微服 AI 算力舱 · Apple Pro Dark × 极客湾评测级交互
(function () {
  const state = {
    page: 'models',
    tab: 'featured',
    search: ''
  };

  function hwClass(hw) {
    if (hw === 'Thor×4') return 'thor4';
    if (hw === 'Thor×2') return 'thor2';
    return 'thor';
  }

  // ==================== 页面切换 ====================
  document.querySelectorAll('#mainTabs .main-tab').forEach(btn => {
    btn.addEventListener('click', () => {
      state.page = btn.dataset.page;
      document.querySelectorAll('#mainTabs .main-tab').forEach(b => b.classList.toggle('active', b === btn));
      document.querySelectorAll('.page').forEach(p => p.classList.toggle('active', p.id === `page-${state.page}`));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });

  // ==================== 界面 1：极客湾双条模型卡片 ====================
  function renderFilterPills() {
    const el = document.getElementById('filterPills');
    el.innerHTML = FILTER_TABS.map(t => `
      <button class="pill ${state.tab === t.id ? 'active' : ''}" data-tab="${t.id}">
        ${t.label.replace('🔥 ', '')}<span class="num">${t.count}</span>
      </button>
    `).join('');

    el.querySelectorAll('.pill').forEach(btn => {
      btn.addEventListener('click', () => {
        state.tab = btn.dataset.tab;
        renderFilterPills();
        renderCards();
      });
    });
  }

  // 格式化带单位的数值（将数字与 秒 / s / ms / TPS / 条 / 张 / 分钟 / × 拆分排版）
  function fmtMetric(str) {
    return String(str).replace(
      /(~?<?[\d,.]+)\s*(秒\/条|秒\/张|条\/天|张\/天|条\/秒|张\/分|张\/秒|条\/s|张\/s|页\/s|次\/s|分钟|小时|ms|TPS|秒|条|张|s|×)/g,
      '$1<span class="u">$2</span>'
    );
  }

  // 高亮短句中的关键数字（避免误匹配 M4 Max / M5 Ultra 中的 M4/M5）
  function hlText(str) {
    return String(str).replace(
      /(?<![A-Za-z\d])(~?[\d,.]+(?:–[\d,.]+)?(?:\s*(?:秒|分钟|小时|条|张|×)|(?:\s?(?:ms|TPS|s|K|M))(?![A-Za-z])))/g,
      '<span class="hl-num">$1</span>'
    );
  }

  function renderColPanel({ title, dir, data, hw, isFocus, subText }) {
    const maxV = Math.max(data.thorNum, data.m5uNum, data.m4mNum);
    const hThor = Math.max(6, (data.thorNum / maxV) * 100).toFixed(1);
    const hM5u  = Math.max(6, (data.m5uNum  / maxV) * 100).toFixed(1);
    const hM4m  = Math.max(6, (data.m4mNum  / maxV) * 100).toFixed(1);

    return `
      <div class="col-panel ${isFocus ? 'prefill-focus' : ''}">
        <div class="col-panel-head">
          <span class="col-panel-title">${title}</span>
          <span class="col-panel-dir">${dir}</span>
        </div>
        <div class="col-stage">
          <div class="col-item">
            <span class="col-val num">${fmtMetric(data.thor)}</span>
            <div class="col-bar thor" style="height:${hThor}%"></div>
          </div>
          <div class="col-item">
            <span class="col-val muted num">${fmtMetric(data.m5u)}</span>
            <div class="col-bar m5u" style="height:${hM5u}%"></div>
          </div>
          <div class="col-item">
            <span class="col-val dim num">${fmtMetric(data.m4m)}</span>
            <div class="col-bar m4m" style="height:${hM4m}%"></div>
          </div>
        </div>
        <div class="col-labels">
          <span class="col-lbl thor">${hw}</span>
          <span class="col-lbl">M5 Ultra</span>
          <span class="col-lbl">M4 Max</span>
        </div>
        <div class="col-sub">
          <span>${subText || (data.unit ? `单位: ${data.unit}` : '三机同台对比')}</span>
          <span class="col-ratio-tag">${data.ratio}</span>
        </div>
      </div>
    `;
  }

  function renderLlmCard(m) {
    const { prefill, ttft, decode } = m.llm;
    return `
      <article class="card" data-id="${m.id}">
        <div class="card-top">
          <div>
            <div class="card-title">${m.name}</div>
            <div class="card-sub">${m.tag}</div>
          </div>
          <div class="badges">
            <span class="badge ${hwClass(m.hw)}">${m.hw}</span>
            <span class="badge ctx num">${m.ctx}</span>
          </div>
        </div>

        <div class="quant-pill">${hlText(m.quantLine)}</div>

        <div class="col-charts-3">
          ${renderColPanel({ title: 'PREFILL 预填充', dir: '越高越好 ↑', data: prefill, hw: m.hw, isFocus: true })}
          ${renderColPanel({ title: 'TTFT 首字延迟', dir: '越低越好 ↓', data: ttft, hw: m.hw, isFocus: false })}
          ${renderColPanel({ title: 'DECODE 解码', dir: '越高越好 ↑', data: decode, hw: m.hw, isFocus: false, subText: decode.sub })}
        </div>

        <div class="card-foot num">
          <span>VRAM ${m.vram} · DISK ${m.disk}</span>
          <span>RAW DATA →</span>
        </div>
      </article>
    `;
  }

  function renderMediaCard(m) {
    return `
      <article class="card" data-id="${m.id}">
        <div class="card-top">
          <div>
            <div class="card-title">${m.name}</div>
            <div class="card-sub">${m.tag}</div>
          </div>
          <div class="badges">
            <span class="badge ${hwClass(m.hw)}">${m.hw}</span>
          </div>
        </div>

        <div class="quant-pill">${hlText(m.quantLine)}</div>

        <div class="tri-metrics">
          ${m.metrics3.map(x => `
            <div class="tri-box">
              <div class="tri-val num">${fmtMetric(x.val)}</div>
              <div class="tri-lbl">${x.label}</div>
            </div>
          `).join('')}
        </div>

        <div class="card-foot num">
          <span>VRAM ${m.vram} · DISK ${m.disk}</span>
          <span>RAW DATA →</span>
        </div>
      </article>
    `;
  }

  function renderCards() {
    const kw = state.search.trim().toLowerCase();
    const list = MODELS.filter(m => {
      if (kw) return (m.name + m.tag + m.quantLine + m.raw).toLowerCase().includes(kw);
      if (state.tab === 'featured') return m.featured;
      if (state.tab === 'all') return true;
      return m.group === state.tab;
    });

    const grid = document.getElementById('cardsGrid');
    if (!list.length) {
      grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:56px;color:#63636e">未找到匹配模型</div>`;
      return;
    }

    grid.innerHTML = list.map(m => m.llm ? renderLlmCard(m) : renderMediaCard(m)).join('');
    grid.querySelectorAll('.card').forEach(c => {
      c.addEventListener('click', () => openModal(c.dataset.id));
    });
  }

  // ==================== 界面 2：速度量化 ====================
  function renderQuant() {
    const maxSec = Math.max(...QUANT_CODE_REPO.map(r => r.sec));
    document.getElementById('quantGrid').innerHTML = `
      <div class="q-card wide">
        <div class="q-head">
          <h2>01 / 写代码 · 读取 32K 代码仓库（约 2 万行代码）耗时柱形图</h2>
          <span>LOWER IS BETTER ↓ · 越矮越快</span>
        </div>
        <div class="vchart-wrap">
          ${QUANT_CODE_REPO.map(r => {
            const hPct = Math.max(5, (r.sec / maxSec) * 100).toFixed(1);
            const isM5u = r.name.includes('M5 Ultra');
            const barCls = !r.isMac ? '' : isM5u ? 'm5u' : 'm4m';
            const valCls = !r.isMac ? '' : isM5u ? 'm5u' : 'm4m';
            return `
              <div class="vchart-col">
                <div class="vchart-val num ${valCls}">${r.sec}<span class="u">秒</span></div>
                <div class="vchart-bar ${barCls}" style="height:${hPct}%"></div>
              </div>
            `;
          }).join('')}
        </div>
        <div class="vchart-labels">
          ${QUANT_CODE_REPO.map(r => `
            <div>
              <div class="vchart-name">${r.name}</div>
              <div class="vchart-meta num">${r.prefill}</div>
            </div>
          `).join('')}
        </div>
      </div>

      <div class="q-card">
        <div class="q-head">
          <h2>02 / 视频生成 · 单条耗时 &amp; 24h 产能</h2>
          <span>VIDEO THROUGHPUT</span>
        </div>
        <div class="q-rows">
          <div class="q-row">
            <div><div class="q-row-title">Pika H3 Flex Turbo LoRA</div><div class="q-row-sub">5 秒 · 640×384</div></div>
            <div class="q-row-num num"><div class="q-row-big">${fmtMetric('2,787 条/天')}</div><div class="q-row-small">${fmtMetric('31.0 秒/条')}</div></div>
          </div>
          <div class="q-row">
            <div><div class="q-row-title">MiniMax H3 Sol</div><div class="q-row-sub">5.125 秒 · 960×544</div></div>
            <div class="q-row-num num"><div class="q-row-big">${fmtMetric('2,526 条/天')}</div><div class="q-row-small">${fmtMetric('34.2 秒/条')}</div></div>
          </div>
          <div class="q-row">
            <div><div class="q-row-title">MiniMax H3 Duo（Thor×2）</div><div class="q-row-sub">832×480 · 20 步完整</div></div>
            <div class="q-row-num num"><div class="q-row-big">${fmtMetric('2,322 条/天')}</div><div class="q-row-small">${fmtMetric('37.2 秒/条')}</div></div>
          </div>
          <div class="q-row">
            <div><div class="q-row-title">Pika H3 Flex 高清</div><div class="q-row-sub">5 秒 · 1344×768</div></div>
            <div class="q-row-num num"><div class="q-row-big">${fmtMetric('811 条/天')}</div><div class="q-row-small">${fmtMetric('106.5 秒/条')}</div></div>
          </div>
        </div>
      </div>

      <div class="q-card">
        <div class="q-head">
          <h2>03 / 图片生成 · 单张耗时 &amp; 24h 产能</h2>
          <span>IMAGE THROUGHPUT</span>
        </div>
        <div class="q-rows">
          <div class="q-row">
            <div><div class="q-row-title">Qwen Image 2.1 Turbo</div><div class="q-row-sub">512×512 · 8 步 · 支持编辑</div></div>
            <div class="q-row-num num"><div class="q-row-big">${fmtMetric('26,181 张/天')}</div><div class="q-row-small">${fmtMetric('3.3 秒/张')}</div></div>
          </div>
          <div class="q-row">
            <div><div class="q-row-title">Qwen Image 2.1 Heretic</div><div class="q-row-sub">512×512 · 20 步 · 18G 显存</div></div>
            <div class="q-row-num num"><div class="q-row-big">${fmtMetric('15,157 张/天')}</div><div class="q-row-small">${fmtMetric('5.7 秒/张')}</div></div>
          </div>
          <div class="q-row">
            <div><div class="q-row-title">MiniMax-H3-Image（2K 旗舰）</div><div class="q-row-sub">2048×2048 · 6 步 · 参考图编辑</div></div>
            <div class="q-row-num num"><div class="q-row-big">${fmtMetric('6,471 张/天')}</div><div class="q-row-small">${fmtMetric('13.35 秒/张')}</div></div>
          </div>
        </div>
      </div>

      <div class="q-card">
        <div class="q-head">
          <h2>04 / 语音实战 · 处理 30 分钟音频耗时</h2>
          <span>AUDIO PIPELINE</span>
        </div>
        <div class="q-rows">
          <div class="q-row">
            <div><div class="q-row-title">Whisper Large V3 Turbo（识别）</div><div class="q-row-sub">100 种语言 · 4 并发 148× 实时</div></div>
            <div class="q-row-num num"><div class="q-row-big">${fmtMetric('12.1 秒')}</div><div class="q-row-small">30 分钟音频</div></div>
          </div>
          <div class="q-row">
            <div><div class="q-row-title">SenseVoiceSmall（中文识别）</div><div class="q-row-sub">仅 1G 显存 · 109× 实时</div></div>
            <div class="q-row-num num"><div class="q-row-big">${fmtMetric('16.5 秒')}</div><div class="q-row-small">30 分钟中文</div></div>
          </div>
          <div class="q-row">
            <div><div class="q-row-title">Nemotron 3 Diarization（多人分离）</div><div class="q-row-sub">最多 8 人 · 1h 仅 39.75s</div></div>
            <div class="q-row-num num"><div class="q-row-big">${fmtMetric('19.9 秒')}</div><div class="q-row-small">30 分钟会议</div></div>
          </div>
          <div class="q-row">
            <div><div class="q-row-title">Hy-SimulMT（英译中语音直译）</div><div class="q-row-sub">支持中英实时语音流</div></div>
            <div class="q-row-num num"><div class="q-row-big">${fmtMetric('8.7 分钟')}</div><div class="q-row-small">30 分钟直译</div></div>
          </div>
        </div>
      </div>

      <div class="q-card">
        <div class="q-head">
          <h2>05 / 文档 OCR &amp; 语音合成吞吐</h2>
          <span>BATCH &amp; REALTIME</span>
        </div>
        <div class="q-rows">
          <div class="q-row">
            <div><div class="q-row-title">PP-OCRv6 Tiny（票证识别）</div><div class="q-row-sub">896×528 登机牌 · 仅 29M 磁盘</div></div>
            <div class="q-row-num num"><div class="q-row-big">${fmtMetric('4,086 张/分')}</div><div class="q-row-small">${fmtMetric('68.1 张/秒')}</div></div>
          </div>
          <div class="q-row">
            <div><div class="q-row-title">Unlimited-OCR-2（长文档 PDF）</div><div class="q-row-sub">支持百页连续高精度识别</div></div>
            <div class="q-row-num num"><div class="q-row-big">${fmtMetric('72 秒')}</div><div class="q-row-small">100 页中文 PDF</div></div>
          </div>
          <div class="q-row">
            <div><div class="q-row-title">Kokoro-82M（语音合成）</div><div class="q-row-sub">157 种音色 · 中文短句 101ms</div></div>
            <div class="q-row-num num"><div class="q-row-big">${fmtMetric('15.45 条/秒')}</div><div class="q-row-small">4 并发吞吐</div></div>
          </div>
          <div class="q-row">
            <div><div class="q-row-title">Sophon-Realtime 4B（全双工）</div><div class="q-row-sub">首字 110ms · 首音 640ms</div></div>
            <div class="q-row-num num"><div class="q-row-big">${fmtMetric('2.49×')} <span class="u">双路</span></div><div class="q-row-small">RTF 0.56</div></div>
          </div>
        </div>
      </div>
    `;
  }

  // ==================== 界面 3：极客湾胜负硬件规格表 ====================
  const SPEC_BOARD_DATA = [
    {
      k: '32K 长文 Prefill',
      thor: '单机 4,572 / 四机 12,463 TPS（2.6 秒读完代码库）',
      mac: 'M4 Max ~500 / M5 Ultra ~1,600 TPS',
      bar: [100, 13],
      verdict: 'Thor 领先 7.8×',
      vClass: 'crush'
    },
    {
      k: '多并发吞吐（团队）',
      thor: '8 并发 725 TPS · 16 并发代码 371.7 TPS（vLLM 批处理）',
      mac: 'MLX / llama.cpp 以单流为主，高并发排队掉速',
      bar: [100, 22],
      verdict: 'Thor 压倒性胜出',
      vClass: 'crush'
    },
    {
      k: 'AI 矩阵算力核心',
      thor: '2,070 TFLOPS (FP4) · 四机高达 8,280 TFLOPS',
      mac: 'M4 Max 无硬件 FP4 / M5 Ultra 80 核 GPU Neural Accelerator',
      bar: [100, 32],
      verdict: 'FP4 Tensor Core',
      vClass: 'crush'
    },
    {
      k: '全栈多模态生态',
      thor: '原生 CUDA · 视频/2K生图/全双工语音/OCR 58 款开箱即用',
      mac: 'Metal / MLX（文本 LLM 强，前沿视频与语音生态缺适配）',
      verdict: '原生 CUDA 完胜',
      vClass: 'crush'
    },
    {
      k: '集群弹性扩展',
      thor: '单机 128G → 双机 256G → 四机 512G（TP4 张量并行）',
      mac: '单机封顶（M4 Max 128G / M5 Ultra 512G 一次买断极贵）',
      verdict: 'Thor 弹性扩展',
      vClass: 'win'
    },
    {
      k: '整机满载功耗',
      thor: '单机 40W – 130W（静音桌面 / 机架友好）',
      mac: 'M4 Max ~140W / M5 Ultra ~270W',
      bar: [48, 100],
      verdict: 'Thor 更低功耗',
      vClass: 'win'
    },
    {
      k: '单机内存带宽',
      thor: '单机 273 GB/s（多机聚合 1.09 TB/s）',
      mac: 'M4 Max 546 GB/s / M5 Ultra 1.2 TB/s',
      verdict: 'M5 Ultra 带宽强',
      vClass: 'tie'
    }
  ];

  function renderHardware() {
    document.getElementById('hwTiers').innerHTML = HW_TIERS.map((t, idx) => `
      <div class="hw-card ${idx === 0 ? 'primary' : ''}">
        <div class="card-top">
          <div class="card-title">${t.name}</div>
          <span class="badge ${idx === 0 ? 'thor' : idx === 1 ? 'thor2' : 'thor4'}">${t.badge}</span>
        </div>
        <div class="hw-big-grid num">
          <div><div class="hw-stat-val">${t.vram}</div><div class="hw-stat-lbl">统一显存</div></div>
          <div><div class="hw-stat-val" style="color:var(--blue)">${t.tflops}</div><div class="hw-stat-lbl">FP4 AI 算力</div></div>
        </div>
        <div style="font-size:13px;font-weight:600;color:var(--ink)">${t.models}</div>
        <div style="font-size:12.5px;color:var(--ink-2)">${t.bestFor}</div>
        <div style="font-size:11.5px;color:var(--ink-3);margin-top:auto" class="num">POWER · ${t.tdp}</div>
      </div>
    `).join('');

    document.getElementById('hwSpecBody').innerHTML = SPEC_BOARD_DATA.map(r => `
      <div class="spec-row">
        <div class="spec-k">${r.k}</div>
        <div>
          <div class="spec-thor num">${r.thor}</div>
          ${r.bar ? `<div class="spec-bar-mini"><div class="fill-thor" style="width:${r.bar[0]}%"></div></div>` : ''}
        </div>
        <div>
          <div class="spec-mac num">${r.mac}</div>
          ${r.bar ? `<div class="spec-bar-mini"><div class="fill-mac" style="width:${r.bar[1]}%"></div></div>` : ''}
        </div>
        <span class="verdict ${r.vClass}">${r.verdict}</span>
      </div>
    `).join('');
  }

  // ==================== 详情弹窗 ====================
  function openModal(id) {
    const m = MODELS.find(x => x.id === id);
    if (!m) return;
    document.getElementById('modalBody').innerHTML = `
      <div class="badges" style="margin-bottom:12px">
        <span class="badge ${hwClass(m.hw)}">${m.hw}</span>
        ${m.ctx ? `<span class="badge ctx num">${m.ctx} CONTEXT</span>` : ''}
      </div>
      <h3 style="font-size:20px;font-weight:700;margin-bottom:6px;padding-right:32px">${m.name}</h3>
      <div style="font-size:13px;color:var(--blue);font-weight:600;margin-bottom:16px">${hlText(m.quantLine)}</div>
      <div style="background:var(--surface);border:1px solid var(--line);border-radius:2px;padding:16px;font-size:13px;line-height:1.75;color:var(--ink-2)">
        <div class="num" style="margin-bottom:8px;color:#fff"><b>资源需求：</b>显存 ${m.vram} · 磁盘 ${m.disk}</div>
        <div class="num"><b>原始实测（懒猫微服实测）：</b>${m.raw}</div>
      </div>
      ${m.llm ? `
        <div style="margin-top:12px;font-size:12px;color:var(--ink-3);display:flex;flex-wrap:wrap;gap:6px 12px">
          <span>Mac Studio 对照来源：</span>
          <a class="source-link" href="https://github.com/ggml-org/llama.cpp/discussions/4167" target="_blank" rel="noopener noreferrer">llama.cpp #4167 ↗</a>
          <a class="source-link" href="https://github.com/ml-explore/mlx-lm" target="_blank" rel="noopener noreferrer">Apple MLX-LM ↗</a>
          <a class="source-link" href="https://www.apple.com/mac-studio/specs/" target="_blank" rel="noopener noreferrer">Apple 官方规格 ↗</a>
        </div>
      ` : ''}
    `;
    document.getElementById('modalBg').classList.add('open');
  }

  document.getElementById('modalClose').addEventListener('click', () => document.getElementById('modalBg').classList.remove('open'));
  document.getElementById('modalBg').addEventListener('click', e => { if (e.target.id === 'modalBg') e.target.classList.remove('open'); });
  document.getElementById('searchInput').addEventListener('input', e => { state.search = e.target.value; renderCards(); });

  renderFilterPills();
  renderCards();
  renderQuant();
  renderHardware();
})();
