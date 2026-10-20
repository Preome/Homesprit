# Homesprit – Architectural Real Estate Property Listing & Management Platform

> **Technical Assessment Submission**  
> **Candidate / Developer:** Tasdid Anawaz  
> **Position:** Software & Website Development  
> **Application:** Homesprit Real Estate Platform

---

## 1. Executive Summary & Concept

**Homesprit** is a real estate property listing and management platform engineered for luxury residences, contemporary architectural homes, high-rise penthouses, and commercial headquarters.

The application delivers an end-to-end digital experience covering all key functional requirements:
- **Home Page**: Professional brand presence, 3-zone clean navigation (`Home`, `Properties`, `About`, `Contact`, `Admin Dashboard`), responsive hero section with a property search bar, and featured properties showcase.
- **Property Listing Page**: Multi-category catalog displaying Houses, Apartments, and Commercial properties with photos, prices, locations, bedrooms, bathrooms, and square footage. Features multi-facet filters (Location, Property Type, Price Range, Bedrooms, Sale vs. Rent) and instant sorting (Price, Newest, Area).
- **Property Details Page**: Interactive multi-photo gallery, specifications (price, address, beds, baths, sq ft, year built), description, signature amenities grid, and a direct "Schedule a Private Viewing / Contact Agent" form.
- **Admin Dashboard**: Comprehensive management interface allowing brokers to add new property listings, edit existing listings, delete properties, view customer viewing requests/inquiries, update inquiry statuses, and track brokerage portfolio KPIs.

---

## 2. Technologies Used & Architectural Rationale

| Layer | Technology | Key Rationale |
| :--- | :--- | :--- |
| **Frontend Framework** | **React 19 / Next.js Architecture** | Declarative components, concurrent rendering, instant state reactivity, zero-flash navigation. |
| **Styling & Design System** | **Tailwind CSS v4** | Clean 60-30-10 neutral color discipline, zero-pill typography, tabular numerals, accessible contrast. |
| **Icons & Micro-Interactions** | **Lucide React** | Cohesive vector iconography, responsive layout geometry. |
| **Database** | **MongoDB Atlas** | Distributed Cloud NoSQL database matching cluster `cluster0.9yxdz1b.mongodb.net`, native ObjectId generation, document scalability. |
| **ORM / Data Modeling** | **Prisma ORM (`prisma/schema.prisma`)** | Type-safe schema definition with MongoDB provider, structured models for Properties, Inquiries, Agents, and Users. |
| **API Server** | **Node.js Express + TSX** | High-performance RESTful API endpoints for property CRUD, inquiry handling, metrics calculation, and database synchronization. |

---

## 3. Database Setup & MongoDB Atlas Configuration

### Provided Cluster Connection String:
```env
DATABASE_URL="mongodb+srv://tasdidanawaz_db_user:zTKxBe4Ti84gxoV0@cluster0.9yxdz1b.mongodb.net/homesprit?retryWrites=true&w=majority"
```

### Prisma Schema (`prisma/schema.prisma`):
The database schema defines 4 primary models:
- **`Property`**:
  - `id`: MongoDB ObjectId (`@map("_id") @db.ObjectId`)
  - `title`, `slug`, `type` (`House`, `Apartment`, `Commercial`), `listingType` (`Sale`, `Rent`)
  - `price`, `priceUnit`
  - `address`, `neighborhood`, `city`, `zip`
  - `bedrooms`, `bathrooms`, `areaSqFt`, `yearBuilt`
  - `description`, `amenities`, `images`, `featured`, `status` (`Available`, `Under Contract`, `Sold`, `Leased`)
  - `agentId`: Reference to `Agent`
- **`Inquiry`**:
  - `id`: MongoDB ObjectId
  - `propertyId`, `propertyTitle`, `customerName`, `customerEmail`, `customerPhone`
  - `preferredDate`, `preferredTime`, `message`
  - `status` (`New`, `Contacted`, `Viewing Scheduled`, `Archived`)
- **`Agent`**:
  - `id`: MongoDB ObjectId
  - `name`, `title`, `phone`, `email`, `avatar`
  - Relation: `properties Property[]`
- **`User`**:
  - `id`: MongoDB ObjectId
  - `email`, `name`, `role` (`CUSTOMER`, `AGENT`, `ADMIN`), `phone`

### Seeding the Database:
You can seed or reset the MongoDB Atlas database at any time:
```bash
# Run the seed script:
npx tsx prisma/seed.ts

# Or trigger via the backend API:
curl -X POST http://localhost:3000/api/db/seed
```

---

## 4. How to Run the Application Locally

### Prerequisites:
- **Node.js**: $\ge 20.0.0$
- **npm**: $\ge 10.0.0$

### Step-by-Step Installation & Launch:
```bash
# 1. Clone the repository and enter directory
git clone <repository_url>
cd homesprit

# 2. Install all dependencies
npm install

# 3. Environment Setup
cp .env.example .env
# Ensure DATABASE_URL is set in .env:
# DATABASE_URL="mongodb+srv://tasdidanawaz_db_user:zTKxBe4Ti84gxoV0@cluster0.9yxdz1b.mongodb.net/homesprit?retryWrites=true&w=majority"

# 4. Push Prisma Schema to MongoDB Atlas (Optional)
npx prisma db push
npx prisma generate

# 5. Start the Full-Stack Application
npm run dev

# 6. Open in Browser
# Access the live application at: http://localhost:3000
```

---

## 5. Demo & Login Credentials

For evaluation testing of user journeys across the platform:

| Role / Persona | Email | Password | Access & Capabilities |
| :--- | :--- | :--- | :--- |
| **Customer / Buyer** | `client@homesprit.com` | `client123` | Search properties, apply multi-facet filters, view specifications and galleries, submit private viewing requests. |
| **Listing Agent** | `julian.thorne@homesprit.com` | `agent123` | Review property representations and manage client appointment schedules. |
| **Operations Admin** | `admin@homesprit.com` | `admin123` | Access **Admin Dashboard**: Add new listings, edit pricing and details, delete properties, and update viewing inquiry workflow statuses. |

> **Note:** To access the admin management portal, sign in with the Admin credentials (`admin@homesprit.com` / `admin123`) using the **"Sign In"** button in the top navigation bar. Once signed in, click on your user profile to open the **"Admin Dashboard"**.

---

## 6. API Endpoints Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Server health and database connection status. |
| `GET` | `/api/properties` | List all properties (supports `search`, `type`, `listingType`, `city`, `bedrooms`, `sort`). |
| `GET` | `/api/properties/:id` | Fetch details for a single property. |
| `POST` | `/api/properties` | Create a new property listing (Admin). |
| `PUT` | `/api/properties/:id` | Update an existing property listing (Admin). |
| `DELETE` | `/api/properties/:id` | Delete a property listing (Admin). |
| `GET` | `/api/inquiries` | Retrieve all customer viewing requests. |
| `POST` | `/api/inquiries` | Submit a private viewing request / contact agent. |
| `PATCH` | `/api/inquiries/:id` | Update inquiry status (`New`, `Contacted`, `Viewing Scheduled`, `Archived`). |
| `GET` | `/api/admin/metrics` | Portfolio KPI metrics (Total Properties, Active, Inquiries, Volume). |
| `GET` | `/api/db/status` | Real-time MongoDB Atlas latency and collections count. |
| `POST` | `/api/db/seed` | Programmatically re-seed properties and inquiries into Atlas. |

---

## 7. How to Deploy to Vercel

The application is pre-configured with `vercel.json` and a serverless API entry point (`api/index.ts`).

### Option A: Deploy via GitHub (Recommended)
1. Push this project to your GitHub repository.
2. Go to [vercel.com](https://vercel.com) and click **"Add New Project"**.
3. Import your GitHub repository.
4. In the **Environment Variables** section, add:
   - **Key:** `DATABASE_URL`
   - **Value:** `mongodb+srv://tasdidanawaz_db_user:zTKxBe4Ti84gxoV0@cluster0.9yxdz1b.mongodb.net/homesprit?retryWrites=true&w=majority`
5. Click **"Deploy"**. Vercel will build the frontend (`dist`) and deploy the API as serverless functions.

### Option B: Deploy via Vercel CLI
```bash
npm i -g vercel
vercel
# Follow the interactive prompts and add the DATABASE_URL environment variable when prompted.
```
