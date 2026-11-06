# Stemroom

純前端音樂分軌工作室，以 [demucs-web](https://github.com/timcsy/demucs-web) 在瀏覽器本機執行 HTDemucs。音檔不會傳到應用程式伺服器；首次使用會從 Hugging Face 下載約 172 MB 的 ONNX 模型。

## 功能

- 匯入音訊或含音軌的影片，顯示基本資訊與波形。
- 在瀏覽器執行人聲、鼓組、貝斯與其他樂器四軌分離。
- 各軌獨立預聽、音量調整、納入混音，以及 WAV 下載。
- 將選定音軌混成伴奏，升降 Key（±6 半音）後預聽或輸出 WAV。
- 匯出伴奏 MV：保留影片畫面、以目前混音取代原音訊。影片以 MediaRecorder 錄製為 WebM。
- 優先使用 WebGPU；不支援或初始化失敗時回退到 WASM CPU。

「其他樂器」是 Demucs 四軌模型中的 other 聲部，會混合鋼琴、吉他、合成器等音源；目前不是獨立的吉他／鋼琴分軌模型。

## 開發

```sh
npm install
npm run dev
```

請使用 `http://localhost` 或 HTTPS。Vite 開發與預覽伺服器會設定 `Cross-Origin-Opener-Policy` 和 `Cross-Origin-Embedder-Policy`，供 SharedArrayBuffer/WASM 多執行緒使用。

```sh
npm run build
npm run preview
```

## GitHub Pages

此專案部署至 `https://inyungzzz.github.io/ok/`。`.github/workflows/deploy.yml` 會在推送到 `main` 或 `master` 時建置並部署 `dist/`。GitHub Pages 專案網站不提供自訂 COOP/COEP 標頭，因此會以單執行緒 WASM 執行；瀏覽器仍可在支援時使用 WebGPU。

正式部署也需設定下列回應標頭。若託管平台不支援，應用程式會以單執行緒 WASM 運行：

```text
Cross-Origin-Opener-Policy: same-origin
Cross-Origin-Embedder-Policy: require-corp
```

## 瀏覽器與資源

建議在桌機最新版 Chrome 或 Edge 使用。HTDemucs 在本機會使用不少記憶體和運算時間；大型或很長的影片視裝置效能而定。伴奏 MV 匯出依賴 `MediaRecorder` 與 `HTMLMediaElement.captureStream()`，輸出 WebM，Safari 或不支援此 API 的瀏覽器會停用此按鈕。

## 授權

應用程式程式碼使用 MIT License。`demucs-web` 採 MIT；ONNX Runtime Web 與 SoundTouchJS 的授權請參閱各自套件。
