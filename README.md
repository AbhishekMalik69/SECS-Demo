---

# 📚 Smart Exam Coordination System — UI (SECS-UI)

<p align="center">
  <img src="https://i.imgur.com/R4B6rEB.png" alt="SECS UI Banner" width="100%" />
</p>

---

## 📖 Introduction

**Smart Exam Coordination System (SECS-UI)** is a front-end demonstration model designed for educational institutions to automate and manage examination processes more efficiently.

This UI project focuses on providing:
- Student eligibility verification
- Medical certificate review
- Seating allocation
- Invigilation assignment
- Messaging simulation

> ⚡ **Note:** This is a **demonstration model**. It is not a full production-ready system. Backend functionality integration (Laravel / Supabase) is needed for complete deployment.

---

## 🚀 Features

- **Student Eligibility Upload:** Upload and analyze attendance Excel sheets.
- **Review System:** Allow HODs to review medical justifications and attendance eligibility.
- **Seating Allocation:** Assign students to exam rooms and manage seat numbers.
- **Invigilation Assignment:** Allocate faculty invigilators to exam sessions systematically.
- **Notification Preview:** Simulate WhatsApp-style message announcements.
- **Modern Responsive UI:** Built using cutting-edge libraries for seamless interaction.

---

## ⚙️ Project Setup

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Then, open [http://localhost:3000](http://localhost:3000) in your browser to view it.

You can start editing the main page by modifying:

```bash
app/page.tsx
```

> The page auto-updates as you edit the file!

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a modern font family developed by Vercel.

---

## 🛠️ Tech Stack

- **Framework:** [Next.js 14](https://nextjs.org)
- **Styling:** [Tailwind CSS](https://tailwindcss.com)
- **UI Components:** [shadcn/ui](https://ui.shadcn.dev) and [v0.dev](https://v0.dev)
- **Form Management:** React Hooks
- **Optional Backend:** Laravel PHP or Supabase (for dynamic data)
- **Authentication:** Role-based UI simulation (Admin, HOD, AMC, etc.)

---

## 🗂️ Folder Structure

```bash
├── app/
│   ├── dashboard/
│   │   ├── eligibility/
│   │   ├── review/
│   │   ├── allocation/
│   │   ├── invigilation/
│   │   └── message/
│   ├── components/
│   └── contexts/
├── lib/
├── public/
├── styles/
├── README.md
└── package.json
```

---

## 🖼️ Screenshots

| Eligibility Upload | Review Page | Allocation Page | Invigilation Assignment |
|:-------------------:|:------------:|:---------------:|:------------------------:|
| ![Eligibility Upload](https://i.imgur.com/EzdeVD4.png) | ![Review Page](https://i.imgur.com/y9M8wOe.png) | ![Allocation Page](https://i.imgur.com/OLPkw8J.png) | ![Invigilation Page](https://i.imgur.com/jan3Wmp.png) |

_Add your own screenshots above!_ 📸

---

## 📚 Learn More

To learn more about Next.js:

- [Next.js Documentation](https://nextjs.org/docs)
- [Learn Next.js](https://nextjs.org/learn) (Interactive Tutorial)
- [Next.js GitHub Repository](https://github.com/vercel/next.js)

---

## 🚀 Deployment

The easiest way to deploy your Next.js app is using the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for detailed steps.

---

## 📢 Disclaimer

This project is a **UI demonstration only**.  
It does **not** yet include full backend validation, real WhatsApp integration, production-grade security, or final optimizations.

Final production deployment requires additional backend work.

---

## 🧡 Special Thanks

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.dev/)
- [v0.dev](https://v0.dev/)

---

<p align="center">
  <b>Made with passion to automate and innovate the examination system! ✨</b>
</p>

---
