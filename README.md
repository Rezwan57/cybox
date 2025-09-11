# CYBOX

This project is a **Tauri desktop application** powered by a **Next.js frontend**.  
It combines the flexibility of modern web technologies (React/Next.js) with the performance and security of Rust via Tauri.

---

## Requirements

Before running, make sure you have the following installed:

- **Node.js** (v18+ recommended)  
- **npm**
- **Rust & Cargo** ([Install Rust](https://www.rust-lang.org/tools/install))  
- **Tauri CLI**  
  ```bash
  cargo install tauri-cli


## Getting Started

Follow these steps to set up and run the project on your local machine:

### 1. Clone the repository
```bash
git clone https://github.com/Rezwan57/cybox.git
cd your-project
```
### 2. Install dependencies
```bash
npm install
```
### 3. Create .env file in the project directory and add
```bash
DATABASE_URL=mysql://root:EXfcIzMizHCSmtjRuloLfFwGPWhQLlxF@yamabiko.proxy.rlwy.net:42351/railway
```
### 4. Run the Tauri app (desktop)
```bash
npm run tauri dev
```

