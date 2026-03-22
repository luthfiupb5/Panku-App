<div align="center">
  <img src="public/Assets/logo-lightbg.png" alt="Panku App" width="200" />
  <h1>🟢 Panku (പങ്ക്)</h1>
  <p><em>"Share" — Split expenses. Stay friends.</em></p>
  
  [![License: MIT](https://img.shields.io/badge/License-MIT-teal.svg)](https://opensource.org/licenses/MIT)
  [![React](https://img.shields.io/badge/React-18-blue.svg)](https://reactjs.org/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38BDF8.svg)](https://tailwindcss.com/)
  [![PWA Ready](https://img.shields.io/badge/PWA-Ready-success.svg)](#)

</div>

---

**Panku (പങ്ക്)** — meaning *“share”* in Malayalam — is a lightweight Progressive Web App (PWA) designed to help friends **track, split, and settle shared expenses effortlessly**.

Whether it’s a trip, outing, or casual meetup, Panku ensures everyone pays their fair share — **without complexity, without accounts, and without storing your data anywhere**.

## ✨ Features

- **🧾 Expense Tracking:** Add expenses one by one. Track who paid and who participated (supports partial participation).
- **👥 Group-Based Splitting:** Create events with multiple members. Panku automatically calculates individual shares and handles uneven participation.
- **⚖️ Smart Settlement:** Calculates **who owes whom**, minimizes the number of transactions, and provides a clear, human-readable settlement plan.
- **💰 Trip Fund Mode:** Add initial deposits from members to create a shared group fund. Expenses are deducted directly from the fund, displaying total fund, total spent, and remaining balance.
- **📊 Visual Insights:** View expense breakdowns with pie charts, payment comparisons with bar charts, and an interactive balance overview.
- **📄 Export Report:** Generate a clean, downloadable PDF report containing the expense list, member balances, the settlement plan, and graphs.
- **📱 PWA Ready:** Install Panku directly to your home screen and use it like a native mobile app. Works offline!

---

## 🔒 Privacy First

Panku is built with a **strict privacy-first approach**.

> ✅ **No login required**  
> ✅ **No signup required**  
> ✅ **No personal data collected**  
> ✅ **No tracking or analytics**  
> ✅ **No cloud storage**  

All your data stays **only on your device**. Panku does **not use any backend or database**. Instead, it uses browser-based `localStorage` and `sessionStorage`. Your data never leaves your device, keeping you in full control. Refreshing or clearing storage will remove the data permanently.

---

## ⚡ How It Works

1. **Create Event:** Start a new event (trip, outing, etc.) and add members.
2. **Choose Mode:** Select either the standard **Split Expenses** mode or the shared **Trip Fund** mode.
3. **Add Expenses:** Log each expense with the amount, payer, and exact participants.
4. **View Summary:** Panku calculates total expenses, individual shares, and balances instantly.
5. **Settlement:** See exactly who should pay whom and how much to settle.
6. **Export:** Download a PDF report or share the results.

---

## 🚀 Tech Stack

- **Frontend:** React + TypeScript
- **Styling:** Tailwind CSS
- **Charts:** Chart.js / Recharts
- **PDF Generation:** jsPDF / html2pdf
- **Storage:** Browser `localStorage`
- **Build Tool:** Vite
- **Deployment:** Vercel / Netlify

---


## 🎯 Why Panku?

Unlike traditional expense apps, Panku requires absolutely **zero setup friction**. 

| Feature | Typical Expense Apps | Panku 🟢 |
| :--- | :--- | :--- |
| **Login Required** | ❌ Yes | ✅ No |
| **Data Stored Online** | ❌ Yes | ✅ No (Local only) |
| **Tracking** | ❌ Yes | ✅ No |
| **Setup Complexity** | ⚠️ High | ✅ Minimal |
| **Speed** | ⚠️ Average | ⚡ Instant |

---

## 📌 Future Improvements

- [ ] QR sharing for results
- [ ] Offline-first enhancements (Service Workers)
- [ ] Multi-currency support
- [ ] Receipt scanning
- [ ] Shareable event links (via URL encoding)

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/yourusername/panku/issues).

1. Fork the project.
2. Create your feature branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

---

## 🏷️ License

Distributed under the MIT License. See `LICENSE` for more information.

---

<div align="center">
  <b>Built for friends. ❤️</b>
  <br />
  Panku isn’t just an expense tracker. It’s a small tool to keep things fair — and friendships stress-free.
</div>
