# TVARIT (त्वरित) - "Fast. Local. Delivered."

> **Hyperlocal On-Demand Delivery Platform for Tier-2 & Tier-3 Indian Cities**  
> *Zero-Warehouse Architecture · Empowering Local Neighborhood Commerce · Competition-Ready Full-Stack MVP*

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Available%20Now-00B373?style=for-the-badge&logo=google-chrome&logoColor=white)](https://geological-cities-relax-humans.trycloudflare.com)
[![GitHub Repo](https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/dattananduri/Tvarit-Demo)

### 🌐 Working Live Demo URL:
👉 **[https://geological-cities-relax-humans.trycloudflare.com](https://geological-cities-relax-humans.trycloudflare.com)**

#### 🔑 Instant Demo Login Accounts:
| Persona | Email | Password | Role & Highlights |
|---------|-------|----------|-------------------|
| **Customer** | `rahul@tvarit.com` | `password123` | Ask Tvarit NLP, Snap & Shop Vision, Voice to Cart, 5★ Delivery Review |
| **Customer 2** | `priya@tvarit.com` | `password123` | Active broadcast order waiting for partner acceptance |
| **Delivery Partner** | `vikram@tvarit.com` | `partner123` | Online radar, 2/4 item checklist, ₹320 wallet earnings, 8 trips |
| **Admin** | `admin@tvarit.com` | `admin123` | Operations headquarters, Gross Platform Value, orders table, customer reviews |

*(Tip: You can also use the **Quick Demo Switcher bar** at the top of the interface to switch personas in 1 click!)*

---

## 🚀 The Core Tvarit Concept

In traditional quick-commerce apps (Blinkit, Zepto, Swiggy Instamart), companies build expensive dark-store warehouses in tier-1 metros and manage rigid inventories. 

**Tvarit operates on a fundamentally different, decentralized model:**

> **THE CUSTOMER DOES NOT NEED TO SELECT A SHOP.**  
> The customer simply tells Tvarit what they need through:
> 1. **Ask Tvarit (AI Shopping Assistant)** — e.g. *"I want to make chicken biryani for 6 people"* $\rightarrow$ AI generates recipe ingredients.
> 2. **Voice to Cart** — e.g. *"I need two litres milk, one bread and twelve eggs"* $\rightarrow$ Voice parsed into structured cart items.
> 3. **Snap & Shop (Vision AI)** — Upload a photo of a cake, dish, or handwritten note $\rightarrow$ Vision AI deconstructs raw ingredients.
> 4. **Smart Item Builder** — Manual custom item lists & local staples.
>
> A nearby independent local delivery partner receives the request on their radar, visits **any local shop of their choice**, purchases the items at transparent local retail rates, and delivers them directly to the customer's doorstep.

```
 CUSTOMER (Types / Speaks / Snaps Photo)
         │
         ▼
 AI INGREDIENT & ITEM STRUCTURER (Customer Reviews & Adds to Cart)
         │
         ▼
 ORDER PLACED (Razorpay Test Mode / Simulated Payment)
         │
         ▼
 DELIVERY PARTNER RADAR (Single-Partner Atomic Claim)
         │
         ▼
 ANY LOCAL NEIGHBORHOOD STORE (Partner Checks Off Items in Store)
         │
         ▼
 CUSTOMER DOORSTEP (Real-Time Live Timeline & Notifications)
```

---

## 🌟 Key Features & Competition Highlights

### 1. 🤖 Ask Tvarit (AI Smart Shopping Assistant)
- Natural language recipe and intent parser (e.g. *"Chicken biryani for 6"*, *"Chocolate fudge cake"*, *"South Indian breakfast"*, *"Home cleaning kit"*, *"Cold & fever relief"*).
- Automatically scales quantities based on party/people size.
- **Safety guarantee**: AI never auto-orders; the customer reviews, edits, removes, and confirms before adding to Cart.

### 2. 🎙️ Voice to Cart (Speech AI)
- Web Speech API integration with microphone animation.
- Converts speech into structured items with intelligent unit and quantity detection.
- Includes 1-click test phrases for competition demo without microphone setup.

### 3. 📸 Snap & Shop (Visual AI Ingredient Extractor - WOW Feature)
- Upload or snap photos of baked goods, cooked meals, grocery assortments, or handwritten paper slips.
- Vision AI analyzes the image, identifies the item, and extracts the individual grocery items needed.
- Includes **1-Click Demo Presets** (Chocolate Cake, Biryani, Handwritten Note, Masala Dosa) for presentation judges.

### 4. 🛒 Dedicated Shopping Cart & Slide-Over Drawer
- Global persistent cart (`CartContext`) with quantity increments, notes, and transparent bill calculation.
- Displays disclaimer: *"Final price may vary based on local shop prices."*

### 5. 🔔 In-App Live Notifications Center
- Real-time alerts across order status updates: *Runner Assigned*, *Shopping in Progress*, *Items Picked Up*, *Out for Delivery*, *Order Delivered*.

### 6. 🛵 Partner Radar & Interactive In-Store Shopping Screen
- Online/Offline toggle with incoming order radar.
- **Accept / Decline** controls with single-partner concurrency protection.
- **In-Store Shopping Checklist**: Interactive checkboxes `[x] 2 kg Rice` with percentage progress tracking (`2 / 4 items purchased · 50%`) and sequential 1-tap progression buttons.

### 7. 🛡️ Admin Operations Console
- Live platform telemetry, gross order values, filterable order feeds, fleet roster, and customer directory.

### 8. ⚡ 1-Click Persona Switcher
- Instant demo switcher bar at the top of the app to switch between **Customer (Rahul)**, **Delivery Partner (Vikram)**, and **Admin (Ops Console)**.

---

## 🛠️ Technology Stack

### Backend
- **Framework**: Spring Boot 3.3.5
- **Language**: Java 21 LTS
- **Database**: MySQL 8.0 with Spring Data JPA & Hibernate
- **Security**: Spring Security + Stateless JWT (`jjwt 0.12.6`) + BCrypt Password Hashing
- **Architecture**: Controller ➔ Service ➔ Repository ➔ Database

### Frontend
- **Framework**: React 19 + Vite
- **Styling**: Tailwind CSS v4 + Plus Jakarta Sans Typography
- **Icons**: Lucide React
- **Routing**: React Router DOM v7
- **HTTP Client**: Axios with JWT request interceptors

---

## 🔐 Pre-Seeded Test Credentials

| Role | Name | Email | Password | Details |
| :--- | :--- | :--- | :--- | :--- |
| **Customer** | Rahul Sharma | `rahul@tvarit.com` | `password123` | Active customer with saved addresses and past orders |
| **Customer** | Priya Patel | `priya@tvarit.com` | `password123` | Customer with an open pending order request |
| **Delivery Partner** | Vikram Singh | `vikram@tvarit.com` | `partner123` | Online partner, 4.9⭐ rating, active radar |
| **Delivery Partner** | Amit Kumar | `amit@tvarit.com` | `partner123` | Online partner, 4.8⭐ rating |
| **Admin** | Ops Console | `admin@tvarit.com` | `admin123` | Full telemetry and dispatch monitoring |

---

## 🔄 Order Lifecycle & State Machine

Strict state transitions with server-side validation. Illegal skips or backward jumps (e.g. `DELIVERED -> SHOPPING`) are rejected with HTTP 400.

```
  [CREATED] ──────────► [ACCEPTED] ──────────► [SHOPPING]
     │                      │                      │
     ▼ (Cancel)             ▼ (Cancel)             ▼
[CANCELLED]            [CANCELLED]            [PICKED_UP]
                                                   │
                                                   ▼
[DELIVERED] ◄────────────────────────────── [OUT_FOR_DELIVERY]
```

---

## 🌐 Live Cloud Deployment Guide (Get a Working URL in 3 Minutes)

This repository includes a multi-stage `Dockerfile` and `render.yaml` for instant 1-click cloud deployment.

### Option 1: Render.com (Recommended - Free Web Service)
1. Fork or open your GitHub repo: **[dattananduri/Tvarit-Demo](https://github.com/dattananduri/Tvarit-Demo)**
2. Go to **[Render Dashboard](https://dashboard.render.com/)** and click **New +** $\rightarrow$ **Web Service**.
3. Select **Build and deploy from a Git repository** and pick `Tvarit-Demo`.
4. Render will auto-detect the `Dockerfile`:
   - **Environment**: `Docker`
   - **Region**: Choose any (e.g. Oregon or Singapore)
   - **Plan**: `Free`
5. In **Environment Variables**, add:
   - `SPRING_PROFILES_ACTIVE` = `demo` *(Enables zero-config embedded database with full demo data auto-seeded!)*
   - `JWT_SECRET` = *(Any secure random 32+ character string, or leave empty if Render auto-generates via render.yaml)*
   - *(Optional)* `GEMINI_API_KEY` = *(Your Google Gemini API key for live multimodal AI, if desired)*
6. Click **Deploy Web Service**! Render will provide your public live URL (e.g. `https://tvarit-demo.onrender.com`).

---

### Option 2: Railway.app
1. Go to **[Railway.app](https://railway.app)** $\rightarrow$ **New Project** $\rightarrow$ **Deploy from GitHub repo**.
2. Select `dattananduri/Tvarit-Demo`.
3. Add Environment Variable:
   - `SPRING_PROFILES_ACTIVE` = `demo`
   - `PORT` = `8084`
4. Railway will build the Docker container and provide a live working public domain.

---

## ⚡ Step-by-Step Local Setup & Startup Guide

### Prerequisites
- **Java 21 LTS** installed
- **Node.js 18+** & npm installed
- **MySQL Server 8.0** running on port `3306`

### 1. Backend Startup (Port 8084)
```powershell
cd h:\TvaritFinal
.\mvnw.cmd spring-boot:run
```

### 2. Frontend Startup (Port 5173)
```powershell
cd h:\TvaritFinal\frontend
npm run dev
```
Open **`http://localhost:5173`** or **`http://localhost:8084`** in your browser.

---

## 🧪 Testing & Verification
```powershell
# Run the complete test suite (14 backend unit & integration tests passing)
.\mvnw.cmd test

# Build production frontend bundle
cd frontend
npm run build
```

---

**TVARIT** — *Fast. Local. Delivered.*  
Repository: [https://github.com/dattananduri/Tvarit-Demo](https://github.com/dattananduri/Tvarit-Demo)  
Built for Startup Competitions & Next-Generation Local Commerce.

