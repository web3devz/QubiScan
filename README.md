# 🔐 QubiScan — The Smart Contract Auditor for the Qubic Network

**QubiScan** is an AI-powered, browser-based auditing platform designed to help developers write secure, reliable smart contracts on the [Qubic Network](https://qubic.org/). It’s lightweight, fast, and built entirely in the frontend—no backend or database required.

🟢 **Live Site:** [https://qubiscan.vercel.app](https://qubiscan.vercel.app)

## 🧠 Why QubiScan?

Qubic enables blazing-fast C++ smart contracts, but the developer experience is still raw: there's no linting, auditing, or educational tooling. **QubiScan bridges this gap** by offering developers:

- Real-time code analysis
- AI-powered code review and security suggestions
- In-browser simulations and testnet mock deployments
- Interactive tutorials to learn secure smart contract development

Whether you're building DeFi, AI agents, bridges, or games on Qubic, QubiScan ensures your code is clean, safe, and production-ready.

## ✨ Key Features

### ✅ **1. Instant Static Analysis**
- Real-time detection of risky code patterns (e.g., buffer overflows, unchecked input)
- C++-specific contract vulnerabilities flagged
- Severity-tagged issue list with line references

### 🤖 **2. OpenAI-Powered Audit**
- GPT-based explanation of code behavior
- Suggestions to fix logic flaws or unsafe practices
- Natural language output for beginners and pros alike

### 📄 **3. PDF Report Generation**
- One-click download of a clean, developer-friendly security report
- Contains: audit summary, issues, suggestions, and code snapshot

### 🚀 **4. Testnet Deployment (Simulated)**
- Select from preloaded Qubic testnet accounts
- Deploy button confirms and simulates deployment success
- Perfect for hackathons, demos, and early prototypes

### 🧑‍🏫 **5. Learn-as-You-Build Tutorials**
- Curated list of security scenarios
- Includes vulnerable code, explanation, and fixed version
- Learn C++ security concepts hands-on

### 🗂️ **6. Local Audit Gallery**
- Your audit history is saved in the browser (via localStorage)
- Quickly review past contracts, rerun audits, and generate new reports


## 🎯 Use Cases

- 🔍 Audit contracts before deploying to Qubic
- 🧪 Prototype safely during hackathons
- 📚 Learn secure C++ contract development interactively
- 🧾 Create audit reports to submit with grant or DAO proposals
- 🚧 Detect flaws in community-submitted open source contracts


## 🔧 Built With

- **React + Tailwind CSS** — Clean, responsive UI
- **Monaco Editor** — Syntax highlighting for C++
- **OpenAI GPT-4 API** — AI audit engine
- **jsPDF** — PDF export of audit reports
- **LocalStorage** — No backend, fully browser-based

## 🌐 Hosted On

> 🟢 **Live Demo**: [https://qubiscan.vercel.app](https://qubiscan.vercel.app)

Deployed on **Vercel**, optimized for performance and developer access.


## 📌 Roadmap (Coming Soon)

- [ ] GitHub integration: auto-audit PRs
- [ ] Real deploy-to-Qubic flow via DevKit CLI
- [ ] Public audit sharing & link generation
- [ ] AI-generated risk scores + reputations
- [ ] DAO-vetted audit badges for open source projects


## 🙌 Contribute

Want to add new static rules, create tutorial content, or improve the AI prompt logic? Contributions are welcome!

> Reach out or fork the project — and help make Qubic development safer for everyone.


## 📣 Attribution

Created with 💙 by builders who believe in a safer, smarter future for Qubic.
 
Documentation reference: [https://docs.qubic.org](https://docs.qubic.org)  
Design inspired by web3 security tooling like Slither, MythX, and Remix.

