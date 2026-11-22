# 🎬 Moxi

> **Freedom to Stream** — A cinematic media streaming platform for Windows.

---

## 🌟 Overview
Moxi brings together a modern, hardware-accelerated desktop shell with a cinematic streaming interface.

- **`moxi-shell`**: Native Windows container written in Rust, leveraging Microsoft Edge WebView2 and MPV hardware video decoding (4K, HDR, HEVC/AV1, advanced subtitle rendering).
- **`moxi-web`**: Responsive streaming user interface built with React 18, TypeScript, and WebAssembly.

---

## 📥 Downloads
You can download the latest Windows installer from the [Releases](https://github.com/ursir1/moxi/releases) page.
- **`MoxiSetup-*.exe`**: Standard Windows installer with desktop shortcuts and file associations.
- **`moxi.exe`**: Standalone portable executable.

---

## 🛠️ Building Locally

### Prerequisites
- [Node.js (v22+)](https://nodejs.org/) & [pnpm](https://pnpm.io/)
- [Rust & Cargo](https://rustup.rs/) (MSVC target)
- [Inno Setup 6](https://jrsoftware.org/isdl.php) (for creating the installer)

### Build Steps

1. **Build Web Frontend**:
   ```powershell
   cd moxi-web
   pnpm install
   pnpm build
   ```

2. **Build Desktop Shell**:
   ```powershell
   cd ../moxi-shell
   cargo build --release --target x86_64-pc-windows-msvc
   ```

3. **Package Installer**:
   ```powershell
   cd setup
   .\create_setup.bat
   ```

---

## 🚀 Automated Cloud Releases
This repository uses GitHub Actions. Whenever a commit message includes `[release]`, GitHub automatically builds the application and publishes an official release with downloadable `.exe` assets.
