
```markdown
# 🧠 Python Function Analyzer - VS Code Extension

This Visual Studio Code extension helps analyze the number of functions defined in Python files inside a selected folder. It leverages a Python backend script and displays the output inside a WebView panel.

---

## 🚀 Features

- 📂 Choose any folder containing `.py` files
- 🐍 Python script parses all files and counts function definitions using the `ast` module
- 🌐 Clean web-based output inside VS Code
- ⚡ One-click activation via command palette

---

## 🛠 Project Structure

```

.
├── src/
│   └── extension.ts          # Main TypeScript source
├── pythonFiles/
│   └── analyze\_functions.py  # Python script to analyze functions
├── out/                      # Compiled JS files (after build)
├── tsconfig.json             # TypeScript compiler configuration
├── webpack.config.js         # Webpack bundler config (if applicable)
├── package.json              # Project metadata and scripts
└── README.md                 # You're reading this!

````

---

## 📦 Prerequisites

Ensure the following are installed on your system:

- [Node.js](https://nodejs.org/en/download/) (v18+ recommended)
- [VS Code](https://code.visualstudio.com/)
- [Python](https://www.python.org/downloads/) (v3.6+)

---

## 🧪 How to Run It Locally

### 1️⃣ Clone or download the repository:

```bash
git clone https://github.com/<your-username>/<your-repo-name>.git
cd <your-repo-name>
````

### 2️⃣ Install Node modules:

```bash
npm install
```

### 3️⃣ Compile TypeScript:

```bash
npx tsc
```

> This will generate JavaScript files in the `/out` directory.

### 4️⃣ Launch the extension in VS Code:

* Open the project in VS Code.
* Press **F5** or go to the "Run and Debug" tab and hit ▶️.
* A new Extension Development Host window will open.
* Press **Ctrl+Shift+P** → search for `Analyze Python Function Count`.

---

## 🧠 How It Works

1. You select a folder containing `.py` files.
2. The extension triggers `analyze_functions.py`.
3. This script uses Python's `ast` module to count functions.
4. Results are returned as JSON and shown inside a clean WebView in VS Code.

---

## ⚠️ Troubleshooting

* ❗ **Python Error**: Ensure Python is installed and added to your system PATH.

* ❗ **UnicodeDecodeError**: Modify the Python script to open files with encoding fallback:

  ```python
  open(filepath, 'r', encoding='utf-8', errors='ignore')
  ```

* ❗ **F5 not working**: Make sure:

  * `tsconfig.json` is at the root
  * `main` in `package.json` points to the compiled JS: `"main": "./out/extension.js"`

---



## 🙌 Made  by MRUNAL
'''

