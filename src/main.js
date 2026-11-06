Warning: truncated output (original token count: 9187)
Total output lines: 696

import './style.css';
import ortWasmModuleUrl from 'onnxruntime-web/ort-wasm-simd-threaded.asyncify.mjs?url';
import ortWasmBinaryUrl from 'onnxruntime-web/ort-wasm-simd-threaded.asyncify.wasm?url';

const icons = {
  music: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 18V5l12-2v13M9 18c0 1.1-1.6 2-3.5 2S2 19.1 2 18s1.6-2 3.5-2S9 16.9 9 18Zm12-2c0 1.1-1.6 2-3.5 2S14 17.1 14 16s1.6-2 3.5-2 3.5.9 3.5 2ZM9 9l12-2"/></svg>',
  upload: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 16V4m0 0L7.5 8.5M12 4l4.5 4.5M4 16v4h16v-4"/></svg>',
  play: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m8 5 12 7-12 7V5Z"/></svg>',
  pause: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5h3v14H8zm5 0h3v14h-3z"/></svg>',
  download: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v12m0 0 4.5-4.5M12 15l-4.5-4.5M4 17v4h16v-4"/></svg>',
  video: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="13" height="14" rx="2"/><path d="m16 10 5-3v10l-5-3"/></svg>',
  close: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"/></svg>',
};

document.querySelector('#app').innerHTML = `
  <header class="topbar">
    <a class="brand" href="#top" aria-label="Stemroom 首頁">
      <span class="brand-mark">${icons.music}</span>
      <span>stemroom<span class="brand-dot">.</span></span>
      <span class="brand-divider"></span><span class="brand-sub">AI 音軌工作室</span>
    </a>
    <div class="top-meta"><span class="privacy-dot"></span><span>本機運算，檔案不會上傳</span><a href="https://github.com/timcsy/demucs-web" target="_blank" rel="noreferrer">Demucs Web ↗</a></div>
  </header>

  <main id="top" class="shell">
    <section class="intro">
      <div class="eyebrow"><span class="eyebrow-line"></span>YOUR TRACK. YOUR MIX.</div>
      <h1>把每一軌，<span>聽清楚。</span></h1>
      <p>用 AI 分離歌曲人聲、鼓、貝斯與其他樂器。調整音量和 Key，做出你的練唱伴奏。</p>
    </section>

    <section class="workbench">
      <div class="panel input-panel">
        <div class="section-head"><div><span class="step">01</span><h2>加入歌曲</h2></div><span class="soft-tag">MP3 · WAV · MP4 · MOV</span></div>
        <input id="file-input" class="visually-hidden" type="file" accept="audio/*,video/mp4,video/webm,video/quicktime,.m4a,.aac,.flac,.ogg" />
        <div id="drop-zone" class="drop-zone" role="button" tabindex="0" aria-label="選擇或拖放音訊／影片">
          <div class="upload-icon">${icons.upload}</div>
          <div class="drop-copy"><strong>拖放音訊或影片到這裡</strong><span>或 <button id="browse-button" class="text-button" type="button">瀏覽檔案</button></span></div>
          <span class="drop-limit">媒體僅在你的裝置處理</span>
        </div>
        <div id="file-card" class="file-card hidden">
          <span class="file-type" id="file-type">AUDIO</span>
          <div class="file-copy"><strong id="file-name"></strong><span id="file-meta"></span></div>
          <button id="remove-file" class="icon-button" type="button" aria-label="移除檔案">${icons.close}</button>
        </div>
        <video id="video-preview" class="video-preview hidden" controls playsinline muted></video>
        <div class="wave-wrap"><canvas id="waveform" aria-label="音訊波形預覽"></canvas><div id="wave-empty" class="wave-empty">音訊波形會顯示在這裡</div></div>
        <div class="input-footer"><div class="capability"><span class="capability-icon">✦</span><span>AI 引擎</span><strong id="backend-label">等待載入</strong></div><button id="separate-button" class="primary-button" type="button" disabled><span>開始分離音軌</span><span class="button-arrow">↗</span></button></div>
        <div id="progress-panel" class="progress-panel hidden" aria-live="polite">
          <div class="progress-top"><span id="progress-label">準備中</span><span id="progress-percent">0%</span></div>
          <div class="progress-track"><span id="progress-fill"></span></div>
          <div class="progress-bottom"><span id="progress-detail">首次使用會下載約 172 MB 模型</span><button id="cancel-button" class="text-button hidden" type="button">取消</button></div>
        </div>
        <p id="notice" class="notice" role="status"></p>
      </div>

      <div class="right-column">
        <section class="panel settings-panel">
          <div class="section-head"><div><span class="step">02</span><h2>調整音色</h2></div><span class="soft-tag">REAL-TIME PREVIEW</span></div>
          <div class="key-card">
            <div class="key-copy"><span class="setting-label">升降 Key</span><span class="setting-note">保留歌曲速度，調整半音</span></div>
            <div class="key-control"><button class="key-step" type="button" data-step="-1" aria-label="降半音">−</button><output id="key-value">0</output><span class="key-unit">st</span><button class="key-step" type="button" data-step="1" aria-label="升半音">+</button></div>
          </div>
          <div class="key-range-row"><span>−6</span><input id="key-slider" type="range" min="-6" max="6" step="1" value="0" aria-label="調整升降 Key"/><span>+6</span></div>
          <div class="key-preset-row"><span class="setting-note">常用調性</span><div class="preset-buttons"><button type="button" data-key="-2">−2</button><button type="button" data-key="-1">−1</button><button class="active" type="button" data-key="0">原調</button><button type="button" data-key="1">+1</button><button type="button" data-key="2">+2</button></div></div>
          <div class="divider"></div>
          <div class="separation-head"><div><span class="setting-label">分離內容</span><span class="setting-note">Demucs HTDemucs · 四軌</span></div><span class="model-pill">AI MODEL</span></div>
          <div class="track-options" aria-label="選擇輸出音軌">
            <label class="track-option"><input type="checkbox" value="vocals"/><span class="track-dot vocals"></span><span>人聲</span></label>
            <label class="track-option"><input type="checkbox" value="drums" checked/><span class="track-dot drums"></span><span>鼓組</span></label>
            <label class="track-option"><input type="checkbox" value="bass" checked/><span class="track-dot bass"></span><span>貝斯</span></label>
            <label class="track-option"><input type="checkbox" value="other" checked/><span class="track-dot other"></span><span>其他樂器</span></label>
          </div>
          <p class="hint">其他樂器包含鋼琴、吉他與合成器等聲部，會依原曲編曲而有所不同。</p>
        </section>

        <section class="panel output-panel">
          <div class="section-head"><div><span class="step">03</span><h2>匯出作品</h2></div><span class="output-mark">↓</span></div>
          <div class="export-row"><span class="export-icon">♫</span><div class="export-copy"><strong>伴奏混音</strong><span>鼓組 + 貝斯 + 其他樂器</span></div><button id="download-mix" class="download-button" type="button" disabled>${icons.download}<span>WAV</span></button></div>
          <div class="export-row video-export-row"><span class="export-icon">${icons.video}</span><div class="export-copy"><strong>伴奏 MV</strong><span>原畫面 + 新伴奏音軌</span></div><button id="download-video" class="download-button" type="button" disabled>${icons.download}<span>匯出</span></button></div>
          <button id="download-stems" class="outline-button" type="button" disabled>下載所有分離音軌 <span>↗</span></button>
          <p class="export-note">WAV 保留高音質。MV 輸出為 WebM，依瀏覽器支援情況而定。</p>
        </section>
      </div>
    </section>

    <section id="results-section" class="results-section hidden">
      <div class="results-heading"><div><div class="eyebrow"><span class="eyebrow-line"></span>YOUR STEMS</div><h2>分離完成<span class="result-count">4 TRACKS</span></h2></div><button id="play-mix" class="play-button" type="button">${icons.play}<span>播放伴奏</span></button></div>
      <div class="results-toolbar"><span>個別音軌</span><span>調整音量 · 點選播放預聽</span></div>
      <div id="stem-list" class="stem-list"></div>
      <div class="master-player"><div class="master-copy"><span class="master-eq">▮▮▮</span><div><strong>目前混音</strong><span id="mix-summary">鼓組、貝斯、其他樂器</span></div></div><div class="player-actions"><span id="play-time">0:00 / 0:00</span><input id="seek-slider" type="range" min="0" max="1000" value="0" aria-label="播放位置"/><button id="player-toggle" class="player-toggle" type="button" aria-label="播放">${icons.play}</button></div></div>
    </section>

    <footer><span>STEMROOM <span class="brand-dot">●</span> 本機 AI 音樂工作室</span><span>Powered by <a href="https://github.com/timcsy/demucs-web" target="_blank" rel="noreferrer">Demucs Web</a> · ONNX Runtime</span></footer>
  </main>
`;

const $ = (selector) => document.querySelector(selector);
const els = {
  fileInput: $('#file-input'), drop: $('#drop-zone'), browse: $('#browse-button'), fileCard: $('#file-card'),
  fileName: $('#file-name'), fileMeta: $('#file-meta'), fileType: $('#file-type'), remove: $('#remove-file'),
  video: $('#video-preview'), waveform: $('#waveform'), waveEmpty: $('#wave-empty'), separate: $('#separate-button'),
  backend: $('#backend-label'), progress: $('#progress-panel'), progressLabel: $('#progress-label'), progressDetail: $('#progress-detail'),
  progressPercent: $('#progress-percent'), progressFill: $('#progress-fill'), notice: $('#notice'), cancel: $('#cancel-button'),
  keySlider: $('#key-slider'), keyValue: $('#key-value'), results: $('#results-section'), stemList: $('#stem-list'),
  downloadMix: $('#download-mix'), downloadVideo: $('#download-video'), downloadStems: $('#download-stems'),
  playMix: $('#play-mix'), playerToggle: $('#player-toggle'), seek: $('#seek-slider'), playTime: $('#play-time'),
};

const trackMeta = {
  vocals: { label: '人聲', english: 'VOCALS', tone: 'coral', defaultOn: false },
  drums: { label: '鼓組', english: 'DRUMS', tone: 'lime', defaultOn: true },
  bass: { label: '貝斯', english: 'BASS', tone: 'violet', defaultOn: true },
  other: { label: '其他樂器', english: 'OTHER', tone: 'amber', defaultOn: true },
};
const modelUrl = 'https://huggingface.co/timcsy/demucs-web-onnx/resolve/main/htdemucs_embedded.onnx';
const sampleRate = 44100;

let audioContext;
let sourceFile = null;
let audioUrl = null;
let audioBuffer = null;
let tracks = null;
let processor = null;
let ProcessorClass = null;
let ortRuntime = null;
let usingWebGpu = false;
let modelPromise = null;
let selected = new Set(['drums', 'bass', 'other']);
let volumes = { vocals: 0.72, drums: 0.78, bass: 0.78, other: 0.78 };
let keyShift = 0;
let playing = null;
let playbackFrame = 0;
let cancelRequested = false;
let workletPromise = null;

function ensureAudioContext() {
  if (!audioContext) audioContext = new AudioContext({ sampleRate });
  return audioContext;
}

function formatTime(seconds) {
  if (!Number.isFinite(seconds)) return '0:00';
  const mins = Math.floor(seconds / 60);
  return `${mins}:${String(Math.floor(seconds % 60)).padStart(2, '0')}`;
}

function setNotice(message = '', kind = '') {
  els.notice.textContent = message;
  els.notice.className = `notice ${kind}`;
}

function setProgress(percent, label, detail) {
  els.progress.classList.remove('hidden');
  els.progressLabel.textContent = label;
  els.progressDetail.textContent = detail;
  els.progressPercent.textContent = `${Math.round(percent)}%`;
  els.progressFill.style.width = `${Math.max(0, Math.min(100, percent))}%`;
}

function clearProgress() {
  els.progress.classList.add('hidden');
  els.progressFill.style.width = '0%';
  els.cancel.classList.add('hidden');
}

function drawWaveform(buffer) {
  const canvas = els.waveform;
  const rect = canvas.getBoundingClientRect();
  const ratio = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.max(1, Math.floor(rect.width * ratio));
  canvas.height = Math.max(1, Math.floor(rect.height * ratio));
  const ctx = canvas.getContext('2d');
  ctx.scale(ratio, ratio);
  ctx.clearRect(0, 0, rect.width, rect.height);
  const data = buffer.getChannelData(0);
  const bars = Math.floor(rect.width / 3.5);
  const step = Math.floor(data.length / bars);
  const mid = rect.height / 2;
  for (let i = 0; i < bars; i++) {
    let peak = 0;
    for (let j = 0; j < step; j += 4) peak = Math.max(peak, Math.abs(data[i * step + j] || 0));
    const height = Math.max(2, peak * rect.height * 0.9);
    ctx.fillStyle = i < bars * 0.14 ? '#b6ef65' : 'rgba(183, 216, 157, .36)';
    ctx.fillRect(i * 3.5, mid - height / 2, 1.7, height);
  }
  els.waveEmpty.classList.add('hidden');
}

function normalizeMediaBuffer(decoded) {
  if (decoded.sampleRate === sampleRate) return Promise.resolve(decoded);
  const offline = new OfflineAudioContext(decoded.numberOfChannels, Math.ceil(decoded.duration * sampleRate), sampleRate);
  const source = offline.createBufferSource();
  source.buffer = decoded;
  source.connect(offline.destination);
  source.start();
  return offline.startRendering();
}

async function loadFile(file) {
  if (!file) return;
  stopPlayback();
  tracks = null;
  sourceFile = file;
  clearProgress();
  els.results.classList.add('hidden');
  els.downloadMix.disabled = true;
  els.downloadStems.disabled = true;
  els.downloadVideo.disabled = true;
  els.separate.disabled = true;
  setNotice('正在讀取媒體…');
  if (audioUrl) URL.revokeObjectURL(audioUrl);
  audioUrl = URL.createObjectURL(file);
  const isVideo = file.type.startsWith('video/') || /\.(mp4|mov|webm|mkv)$/i.test(file.name);
  els.fileCard.classList.remove('hidden');
  els.fileType.textContent = isVideo ? 'VIDEO' : 'AUDIO';
  els.fileName.textContent = file.name;
  els.fileMeta.textContent = `${(file.size / 1024 / 1024).toFixed(1)} MB · 讀取音訊中`;
  els.video.classList.toggle('hidden', !isVideo);
  els.video.pause();
  els.video.src = isVideo ? audioUrl : '';
  try {
    const ctx = ensureAudioContext();
    if (ctx.state === 'suspended') await ctx.resume();
    const decoded = await ctx.decodeAudioData(await file.arrayBuffer());
    audioBuffer = await normalizeMediaBuffer(decoded);
    const duration = formatTime(audioBuffer.duration);
    els.fileMeta.textContent = `${duration} · ${(file.size / 1024 / 1024).toFixed(1)} MB · ${isVideo ? '影片音訊' : '音訊'}`;
    els.separate.disabled = false;
    els.waveform.classList.remove('hidden');
    drawWaveform(audioBuffer);
    setNotice('準備就緒。開始分離後，音檔會留在此裝置處理。', 'success');
    if (isVideo) {
      els.video.onloadedmetadata = () => { els.video.currentTime = 0; };
    }
  } catch (error) {
    audioBuffer = null;
    setNotice(`無法讀取這個檔案：${error.message || '格式可能不受瀏覽器支援。'}`, 'error');
  }
}

async function ensureModel() {
  if (modelPromise) return modelPromise;
  if (processor?.session) return processor;
  modelPromise = (async () => {
    setProgress(2, '載入 AI 引擎', '首次使用會下載約 172 MB 的模型；之後可由瀏覽器快取。');
    const [{ DemucsProcessor }, ort] = await Promise.all([
      import('demucs-web'),
      import('onnxruntime-web/webgpu'),
    ]);
    ProcessorClass = DemucsProcessor;
    ortRuntime = ort;
    // Vite emits ONNX Runtime's WASM files as hashed assets. Point ORT at
    // those emitted URLs instead of letting it look beside the page URL.
    ort.env.wasm.wasmPaths = { mjs: ortWasmModuleUrl, wasm: ortWasmBinaryUrl };
    const isolated = window.crossOriginIsolated === true;
    ort.env.wasm.numThreads = isolated ? Math.max(1, Math.min(8, navigator.hardwareConcurrency || 4)) : 1;
    let hasGpu = false;
    if ('gpu' in navigator) {
      try { hasGpu = Boolean(await navigator.gpu.requestAdapter()); } catch { hasGpu = false; }
    }
    els.backend.textContent = hasGpu ? 'WebGPU / WASM' : 'WASM CPU';
    const callbacks = {
      onDownloadProgress: (loaded, total) => {
        const pct = total ? 3 + (loaded / total) * 30 : 12;
        setProgress(pct, '下載 AI 模型', `${(loaded / 1024 / 1024).toFixed(0)} / ${(total / 1024 / 1024).toFixed(0)} MB`);
      },
      onProgress: ({ progress, currentSegment, totalSegments }) => {
        if (cancelRequested) throw new Error('已取消分離。');
        setProgress(35 + progress * 63, 'AI 分離音軌', `處理片段 ${currentSegment} / ${totalSegments} · 請保持此分頁開啟`);
      },
      onLog: (phase, message) => console.debug(`[Demucs:${phase}] ${message}`),
    };
    const createProcessor = (providers) => new DemucsProcessor({
      ort,
      ...callbacks,
      sessionOptions: {
        executionProviders: providers,
        enableCpuMemArena: false,
        enableMemPattern: false,
        graphOptimizationLevel: 'basic',
      },
    });
    setProgress(3, '下載 AI 模型', '約 172 MB · 模型只需載入一次');
    try {
      processor = createProcessor(hasGpu ? ['webgpu', 'wasm'] : ['wasm']);
      await processor.loadModel(modelUrl);
      usingWebGpu = hasGpu;
    } catch (error) {
      if (!hasGpu) { processor = null; throw error; }
      els.backend.textContent = 'WASM CPU · GPU 回退';
      processor = createProcessor(['wasm']);
      await processor.loadModel(modelUrl);
      usingWebGpu = false;
    }
    return processor;
  })();
  try { return await modelPromise; } finally { modelPromise = null; }
}

async function separateAudio() {
  if (!audioBuffer || !sourceFile) return;
  cancelRequested = false;
  els.separate.disabled = true;
  els.cancel.classList.remove('hidden');
  els.progress.classList.remove('hidden');
  setNotice('分離音軌會使用裝置的記憶體與運算資源…187 tokens truncated…nProgress: ({ progress, currentSegment, totalSegments }) => {
          if (cancelRequested) throw new Error('已取消分離。');
          setProgress(35 + progress * 63, 'AI 分離音軌', `處理片段 ${currentSegment} / ${totalSegments} · WASM CPU`);
        },
        sessionOptions: { executionProviders: ['wasm'], enableCpuMemArena: false, enableMemPattern: false, graphOptimizationLevel: 'basic' },
      });
      await fallback.loadModel(modelUrl);
      processor = fallback;
      usingWebGpu = false;
      output = await processor.separate(left, right);
    }
    if (cancelRequested) throw new Error('已取消分離。');
    tracks = output;
    selected = new Set([...document.querySelectorAll('.track-option input:checked')].map((item) => item.value));
    renderTracks();
    setProgress(100, '分離完成', '你的音軌已準備好，可以預聽或下載。');
    els.cancel.classList.add('hidden');
    els.results.classList.remove('hidden');
    els.downloadMix.disabled = false;
    els.downloadStems.disabled = false;
    els.downloadVideo.disabled = !isVideoFile(sourceFile) || !supportsVideoExport();
    setNotice('分離完成。調整音軌音量或 Key，建立你的伴奏混音。', 'success');
    setTimeout(() => els.progress.classList.add('hidden'), 900);
  } catch (error) {
    console.error(error);
    clearProgress();
    if (error.message === '已取消分離。') setNotice(error.message);
    else setNotice(`分離失敗：${error.message || '無法啟動 AI 模型。請使用 Chrome 或 Edge，並以 localhost／HTTPS 開啟。'}`, 'error');
  } finally {
    els.separate.disabled = !audioBuffer;
    cancelRequested = false;
  }
}

function isVideoFile(file) {
  return file?.type.startsWith('video/') || /\.(mp4|mov|webm|mkv)$/i.test(file?.name || '');
}

function supportsVideoExport() {
  return Boolean(window.MediaRecorder && (els.video.captureStream || els.video.mozCaptureStream));
}

function createBufferFromTrack(track) {
  const ctx = ensureAudioContext();
  const output = ctx.createBuffer(2, track.left.length, sampleRate);
  output.copyToChannel(track.left, 0);
  output.copyToChannel(track.right, 1);
  return output;
}

function createMixBuffer() {
  if (!tracks) return null;
  const activeTracks = [...selected].filter((key) => tracks[key]);
  if (!activeTracks.length) return null;
  const length = tracks[activeTracks[0]].left.length;
  const left = new Float32Array(length);
  const right = new Float32Array(length);
  for (const key of activeTracks) {
    const gain = volumes[key];
    const track = tracks[key];
    for (let i = 0; i < length; i++) {
      left[i] += track.left[i] * gain;
      right[i] += track.right[i] * gain;
    }
  }
  let peak = 0;
  for (let i = 0; i < length; i++) peak = Math.max(peak, Math.abs(left[i]), Math.abs(right[i]));
  const scale = peak > 0.98 ? 0.98 / peak : 1;
  for (let i = 0; i < length; i++) { left[i] *= scale; right[i] *= scale; }
  const ctx = ensureAudioContext();
  const buffer = ctx.createBuffer(2, length, sampleRate);
  buffer.copyToChannel(left, 0);
  buffer.copyToChannel(right, 1);
  return buffer;
}

function renderTracks() {
  if (!tracks) return;
  els.stemList.innerHTML = '';
  for (const key of ['vocals', 'drums', 'bass', 'other']) {
    const meta = trackMeta[key];
    const on = selected.has(key);
    const row = document.createElement('article');
    row.className = `stem-row ${meta.tone} ${on ? '' : 'muted'}`;
    row.dataset.track = key;
    row.innerHTML = `
      <button type="button" class="stem-play" aria-label="播放${meta.label}">${icons.play}</button>
      <div class="stem-info"><div><strong>${meta.label}</strong><span class="stem-tag">${meta.english}</span></div><span class="stem-wave" aria-hidden="true"></span></div>
      <label class="stem-volume" aria-label="${meta.label}音量"><input type="range" min="0" max="100" value="${Math.round(volumes[key] * 100)}"/><span>${Math.round(volumes[key] * 100)}%</span></label>
      <label class="stem-switch" aria-label="${on ? '包含' : '排除'}${meta.label}"><input type="checkbox" ${on ? 'checked' : ''}/><span></span></label>
      <button type="button" class="stem-download" aria-label="下載${meta.label}">${icons.download}</button>
    `;
    row.querySelector('.stem-play').addEventListener('click', () => playBuffer(createBufferFromTrack(tracks[key])));
    row.querySelector('.stem-volume input').addEventListener('input', (event) => {
      volumes[key] = Number(event.target.value) / 100;
      row.querySelector('.stem-volume span').textContent = `${event.target.value}%`;
      row.classList.toggle('muted', volumes[key] === 0);
    });
    row.querySelector('.stem-switch input').addEventListener('change', (event) => {
      if (event.target.checked) selected.add(key); else selected.delete(key);
      row.classList.toggle('muted', !event.target.checked);
      updateMixSummary();
    });
    row.querySelector('.stem-download').addEventListener('click', () => downloadWav(createBufferFromTrack(tracks[key]), `${safeStemName(sourceFile.name)}_${meta.english.toLowerCase()}.wav`));
    els.stemList.append(row);
  }
  updateMixSummary();
}

function updateMixSummary() {
  const names = [...selected].map((key) => trackMeta[key].label);
  $('#mix-summary').textContent = names.length ? names.join('、') : '請至少選擇一個音軌';
}

function safeStemName(name) {
  return name.replace(/\.[^.]+$/, '').replace(/[\\/:*?"<>|]/g, '_');
}

function audioBufferToWav(buffer) {
  const channels = buffer.numberOfChannels;
  const frames = buffer.length;
  const bytesPerSample = 2;
  const blockAlign = channels * bytesPerSample;
  const array = new ArrayBuffer(44 + frames * blockAlign);
  const view = new DataView(array);
  const writeString = (offset, value) => [...value].forEach((letter, index) => view.setUint8(offset + index, letter.charCodeAt(0)));
  writeString(0, 'RIFF'); view.setUint32(4, array.byteLength - 8, true); writeString(8, 'WAVE');
  writeString(12, 'fmt '); view.setUint32(16, 16, true); view.setUint16(20, 1, true);
  view.setUint16(22, channels, true); view.setUint32(24, buffer.sampleRate, true);
  view.setUint32(28, buffer.sampleRate * blockAlign, true); view.setUint16(32, blockAlign, true);
  view.setUint16(34, 16, true); writeString(36, 'data'); view.setUint32(40, frames * blockAlign, true);
  const samples = Array.from({ length: channels }, (_, channel) => buffer.getChannelData(channel));
  let offset = 44;
  for (let frame = 0; frame < frames; frame++) {
    for (let channel = 0; channel < channels; channel++) {
      const sample = Math.max(-1, Math.min(1, samples[channel][frame]));
      view.setInt16(offset, sample < 0 ? sample * 32768 : sample * 32767, true);
      offset += 2;
    }
  }
  return new Blob([array], { type: 'audio/wav' });
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 60_000);
}

function downloadWav(buffer, filename) {
  downloadBlob(audioBufferToWav(buffer), filename);
}

async function prepareShiftedMix() {
  const mix = createMixBuffer();
  if (!mix) throw new Error('請至少選擇一個音軌加入混音。');
  if (!keyShift) return mix;
  setNotice(`正在將混音調整 ${keyShift > 0 ? '+' : ''}${keyShift} 個半音…`);
  const [{ processOffline }, processorUrl] = await Promise.all([
    import('@soundtouchjs/audio-worklet'),
    import('@soundtouchjs/audio-worklet/processor?url'),
  ]);
  const shifted = await processOffline({ input: mix, processorUrl: processorUrl.default, pitchSemitones: keyShift, playbackRate: 1 });
  setNotice('Key 調整完成。', 'success');
  return shifted;
}

async function ensureWorklet() {
  if (workletPromise) return workletPromise;
  workletPromise = Promise.all([
    import('@soundtouchjs/audio-worklet'),
    import('@soundtouchjs/audio-worklet/processor?url'),
  ]).then(async ([module, processorUrl]) => {
    await module.SoundTouchNode.register(ensureAudioContext(), processorUrl.default);
    return module.SoundTouchNode;
  });
  return workletPromise;
}

async function playBuffer(buffer, startAt = 0) {
  if (!buffer) return;
  stopPlayback();
  const ctx = ensureAudioContext();
  await ctx.resume();
  let playbackBuffer = buffer;
  if (keyShift) {
    try {
      const [{ processOffline }, processorUrl] = await Promise.all([
        import('@soundtouchjs/audio-worklet'),
        import('@soundtouchjs/audio-worklet/processor?url'),
      ]);
      playbackBuffer = await processOffline({ input: buffer, processorUrl: processorUrl.default, pitchSemitones: keyShift, playbackRate: 1 });
    } catch (error) {
      setNotice(`Key 調整無法啟動：${error.message}`, 'error');
      return;
    }
  }
  const source = ctx.createBufferSource();
  source.buffer = playbackBuffer;
  source.connect(ctx.destination);
  source.onended = () => { if (playing?.source === source) finishPlayback(); };
  const startedAt = ctx.currentTime;
  source.start(0, Math.min(startAt, Math.max(0, playbackBuffer.duration - 0.01)));
  playing = { source, buffer: playbackBuffer, startedAt: startedAt - startAt, offset: startAt };
  updatePlayState(true);
  animatePlayback();
}

function finishPlayback() {
  playing = null;
  cancelAnimationFrame(playbackFrame);
  updatePlayState(false);
  els.seek.value = 0;
  els.playTime.textContent = `0:00 / ${formatTime(audioBuffer?.duration || 0)}`;
}

function stopPlayback() {
  if (playing?.source) {
    const source = playing.source;
    playing = null;
    source.onended = null;
    try { source.stop(); } catch { /* already stopped */ }
  }
  cancelAnimationFrame(playbackFrame);
  updatePlayState(false);
}

function updatePlayState(isPlaying) {
  els.playerToggle.innerHTML = isPlaying ? icons.pause : icons.play;
  els.playerToggle.setAttribute('aria-label', isPlaying ? '暫停' : '播放');
  els.playMix.querySelector('span').textContent = isPlaying ? '暫停伴奏' : '播放伴奏';
  els.playMix.querySelector('svg').outerHTML = isPlaying ? icons.pause : icons.play;
}

function animatePlayback() {
  if (!playing) return;
  const position = Math.min(playing.buffer.duration, audioContext.currentTime - playing.startedAt);
  const duration = playing.buffer.duration;
  els.seek.value = String(duration ? Math.round(position / duration * 1000) : 0);
  els.playTime.textContent = `${formatTime(position)} / ${formatTime(duration)}`;
  playbackFrame = requestAnimationFrame(animatePlayback);
}

function setKey(value) {
  keyShift = Math.max(-6, Math.min(6, Number(value)));
  els.keySlider.value = String(keyShift);
  els.keyValue.textContent = keyShift > 0 ? `+${keyShift}` : String(keyShift);
  document.querySelectorAll('[data-key]').forEach((button) => button.classList.toggle('active', Number(button.dataset.key) === keyShift));
  if (playing) stopPlayback();
  setNotice(keyShift ? `預聽與混音匯出會套用 ${keyShift > 0 ? '+' : ''}${keyShift} 個半音。` : '目前使用原調。');
}

async function exportVideo() {
  if (!sourceFile || !isVideoFile(sourceFile) || !tracks) return;
  if (!supportsVideoExport()) {
    setNotice('這個瀏覽器不支援影片擷取。請改用最新版 Chrome 或 Edge。', 'error');
    return;
  }
  els.downloadVideo.disabled = true;
  els.downloadVideo.querySelector('span').textContent = '準備中';
  try {
    const buffer = await prepareShiftedMix();
    const capture = els.video.captureStream ? els.video.captureStream() : els.video.mozCaptureStream();
    const audioDestination = ensureAudioContext().createMediaStreamDestination();
    const audioSource = ensureAudioContext().createBufferSource();
    audioSource.buffer = buffer;
    audioSource.connect(audioDestination);
    const stream = new MediaStream([...capture.getVideoTracks(), ...audioDestination.stream.getAudioTracks()]);
    const mimeType = ['video/webm;codecs=vp9,opus', 'video/webm;codecs=vp8,opus', 'video/webm'].find((type) => MediaRecorder.isTypeSupported(type));
    if (!mimeType) throw new Error('目前瀏覽器無法錄製 WebM 影片。');
    const recorder = new MediaRecorder(stream, { mimeType, videoBitsPerSecond: 5_000_000, audioBitsPerSecond: 192_000 });
    const chunks = [];
    const done = new Promise((resolve, reject) => {
      recorder.ondataavailable = (event) => { if (event.data.size) chunks.push(event.data); };
      recorder.onerror = (event) => reject(event.error || new Error('影片錄製失敗。'));
      recorder.onstop = resolve;
    });
    els.video.pause();
    els.video.currentTime = 0;
    els.video.muted = true;
    await new Promise((resolve) => {
      if (els.video.readyState >= 2) resolve();
      else els.video.addEventListener('loadeddata', resolve, { once: true });
    });
    await ensureAudioContext().resume();
    recorder.start(1000);
    await els.video.play();
    audioSource.start();
    setNotice('正在即時擷取畫面並混入伴奏，請保持頁面開啟…');
    els.downloadVideo.querySelector('span').textContent = '錄製中';
    await new Promise((resolve, reject) => {
      const timeout = setTimeout(() => reject(new Error('影片錄製逾時。')), Math.max(60_000, (buffer.duration + 30) * 1000));
      els.video.onended = () => { clearTimeout(timeout); resolve(); };
      audioSource.onended = () => { if (els.video.ended) { clearTimeout(timeout); resolve(); } };
    });
    if (recorder.state !== 'inactive') recorder.stop();
    await done;
    const blob = new Blob(chunks, { type: mimeType });
    if (!blob.size) throw new Error('錄製結果是空檔。');
    downloadBlob(blob, `${safeStemName(sourceFile.name)}_伴奏MV.webm`);
    setNotice('伴奏 MV 已匯出。', 'success');
  } catch (error) {
    console.error(error);
    setNotice(`MV 匯出失敗：${error.message}`, 'error');
  } finally {
    if (els.video) { els.video.onended = null; els.video.pause(); }
    els.downloadVideo.disabled = !tracks || !supportsVideoExport();
    els.downloadVideo.querySelector('span').textContent = '匯出';
  }
}

function exportAllStems() {
  if (!tracks) return;
  for (const key of Object.keys(trackMeta)) {
    downloadWav(createBufferFromTrack(tracks[key]), `${safeStemName(sourceFile.name)}_${trackMeta[key].english.toLowerCase()}.wav`);
  }
}

els.browse.addEventListener('click', () => els.fileInput.click());
els.drop.addEventListener('click', (event) => { if (event.target.closest('button')) return; els.fileInput.click(); });
els.drop.addEventListener('keydown', (event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); els.fileInput.click(); } });
els.fileInput.addEventListener('change', (event) => loadFile(event.target.files?.[0]));
els.drop.addEventListener('dragover', (event) => { event.preventDefault(); els.drop.classList.add('drag-over'); });
els.drop.addEventListener('dragleave', () => els.drop.classList.remove('drag-over'));
els.drop.addEventListener('drop', (event) => { event.preventDefault(); els.drop.classList.remove('drag-over'); loadFile(event.dataTransfer.files?.[0]); });
els.remove.addEventListener('click', () => {
  stopPlayback();
  sourceFile = null; audioBuffer = null; tracks = null;
  if (audioUrl) URL.revokeObjectURL(audioUrl);
  audioUrl = null; els.video.pause(); els.video.removeAttribute('src'); els.video.load();
  els.fileCard.classList.add('hidden'); els.video.classList.add('hidden'); els.waveEmpty.classList.remove('hidden');
  els.separate.disabled = true; els.results.classList.add('hidden'); els.downloadMix.disabled = true; els.downloadStems.disabled = true; els.downloadVideo.disabled = true;
  els.fileInput.value = ''; setNotice('選擇一首歌曲開始。');
});
els.separate.addEventListener('click', separateAudio);
els.cancel.addEventListener('click', () => { cancelRequested = true; els.cancel.classList.add('hidden'); setNotice('正在停止…'); });
els.keySlider.addEventListener('input', (event) => setKey(event.target.value));
document.querySelectorAll('[data-step]').forEach((button) => button.addEventListener('click', () => setKey(keyShift + Number(button.dataset.step))));
document.querySelectorAll('[data-key]').forEach((button) => button.addEventListener('click', () => setKey(button.dataset.key)));
document.querySelectorAll('.track-option input').forEach((input) => input.addEventListener('change', () => {
  if (input.checked) selected.add(input.value); else selected.delete(input.value);
  if (tracks) renderTracks();
}));
els.downloadMix.addEventListener('click', async () => {
  try { downloadWav(await prepareShiftedMix(), `${safeStemName(sourceFile.name)}_伴奏${keyShift ? `_key${keyShift > 0 ? '+' : ''}${keyShift}` : ''}.wav`); }
  catch (error) { setNotice(error.message, 'error'); }
});
els.downloadStems.addEventListener('click', exportAllStems);
els.downloadVideo.addEventListener('click', exportVideo);
els.playMix.addEventListener('click', async () => {
  if (playing) { stopPlayback(); return; }
  try { await playBuffer(createMixBuffer()); } catch (error) { setNotice(error.message, 'error'); }
});
els.playerToggle.addEventListener('click', async () => {
  if (playing) { stopPlayback(); return; }
  try { await playBuffer(createMixBuffer()); } catch (error) { setNotice(error.message, 'error'); }
});
els.seek.addEventListener('change', async () => {
  if (!playing) return;
  const position = Number(els.seek.value) / 1000 * playing.buffer.duration;
  const buffer = playing.buffer;
  await playBuffer(buffer, position);
});
window.addEventListener('resize', () => { if (audioBuffer) drawWaveform(audioBuffer); });
window.addEventListener('beforeunload', () => { if (audioUrl) URL.revokeObjectURL(audioUrl); stopPlayback(); });

if ('gpu' in navigator) els.backend.textContent = '支援 WebGPU';
else els.backend.textContent = 'WASM CPU';
setNotice('選擇一首歌曲開始。');
