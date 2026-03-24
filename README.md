# Anti-Apartheid Legacy Centre - Interactive Storyline

<p align="center">
  <img src="client/src/assets/logo/Logo%20pack%20AAL%202-01.png" alt="AALC Logo" width="200"/>
  <br/>
  <a href="https://antiapartheidlegacy.org.uk/">Anti-Apartheid Legacy Centre</a>
</p>

An interactive educational web application built for the **Anti-Apartheid Legacy Centre (AALC)** as a Final Year BSc project.
The app introduces users aged 10–14 or anyone new to the apartheid regime in South Africa and the resistance movements centred around
**28 Penton Street** - the African National Congress(ANC's) London office - through a series of engaging, puzzle-based learning experiences.

---

## Live Demo

> Note: the backend is hosted on Render's free tier and may take ~30-120 seconds to wake up on first request.

| Service                   | URL                                                                                |
|---------------------------|------------------------------------------------------------------------------------|
| Frontend (on Vercel)      | https://aalc-individual-project.vercel.app/                                        |
| Backend API (on Renderer) | [aalc-individualproject.onrender.com](https://aalc-individualproject.onrender.com) |
| PostgreSQL (on Neon.tech) | N/A                                                                                |

---

## Features

PUZZLE PATTERN ---> [Context] --> [Fill-in-the-blanks] --> [Shard specific puzzle] (except for Shard-9)

- **9 interactive Shards** = puzzle-gated learning modules covering apartheid history
- **10 puzzle types** = Fill-in-the-Blank, Jigsaw, Redacted Reveal, Drag & Categorise, Decision Tree, Audio Matching, and more
- **3 narrative tracks** = Apartheid (South Africa), UK Actions, and Global Solidarity
- **Progressive unlock system** = users must complete shards sequentially
- **User accounts** = register/login with auto-generated usernames; progress is saved per user
- **Interactive tutorial** = guided onboarding tour powered by driver.js
- **Confetti celebrations** on puzzle completion

---

## Tech Stack

### Frontend
| Technology | Version |
|---|---|
| React | 19.2.0 |
| TypeScript | 5.9.3 |
| Vite + SWC | 7.2.4 |
| React Router DOM | 7.12.0 |
| driver.js | 1.4.0 |
| react-jigsaw-puzzle | 1.0.5 |
| react-canvas-confetti | 2.0.7 |

### Backend
| Technology | Version |
|---|---|
| Java | 21 |
| Spring Boot | 4.0.0 |
| Spring Data JPA | — |
| Spring Web MVC | — |
| Lombok | — |

### Database & Infrastructure
| Technology | Details |
|---|---|
| PostgreSQL | 16 (Docker locally, managed DB in production) |
| Docker / Docker Compose | Local development |
| Vercel | Frontend deployment |
| Render | Backend deployment |

---

## Project Structure

```
AALC-IndividualProject/
├── client/                          # React + TypeScript frontend
│   ├── src/
│   │   ├── pages/                   # Route-level page components
│   │   │   ├── HomePage.tsx
│   │   │   ├── TimelinePage.tsx
│   │   │   ├── ShardPage.tsx
│   │   │   ├── LoginPage.tsx
│   │   │   ├── Settings.tsx
│   │   │   ├── WhoWeAre.tsx
│   │   │   ├── AdminPage.tsx
│   │   │   └── FinalMessage.tsx
│   │   ├── components/
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── GlossaryTerm.tsx
│   │   │   ├── ReportForm.tsx
│   │   │   ├── RewardPopup.tsx
│   │   │   └── puzzles/             # Individual puzzle type components
│   │   │       ├── FillInTheBlank.tsx
│   │   │       ├── JigSaw.tsx
│   │   │       ├── RedactedReveal.tsx
│   │   │       ├── OrderEventsChronological.tsx
│   │   │       ├── DecisionTree.tsx
│   │   │       ├── DragAndCategorise.tsx
│   │   │       ├── CommunicationNetwork.tsx
│   │   │       ├── ConnectMatching.tsx
│   │   │       ├── InkDropReveal.tsx
│   │   │       ├── AudioMatching.tsx
│   │   │       └── ContextView.tsx
│   │   ├── data/                    # Static shard content in ContextView.tsx
│   │   ├── styles/                  # Per-component CSS
│   │   ├── types.ts                 # Shared TypeScript interfaces
│   │   └── utils.ts
│   ├── .env.local                   # Dev environment variables
│   ├── .env.production              # Production environment variables
│   └── vercel.json                  # SPA rewrite rule for Vercel
│
├── server/                          # Spring Boot backend
│   ├── src/main/java/com/example/server/
│   │   ├── config/                  # CORS + database seeder
│   │   ├── controller/              # REST controllers
│   │   ├── model/                   # JPA entities
│   │   ├── service/                 # Business logic services
│   │   ├── repository/              # Spring Data repositories using JpaRepository
│   │   └── converter/               # JSON type converters (Need for FITB attribute in shard)
│   ├── src/main/resources/
│   │   └── application.properties
│   └── Dockerfile                   # Multi-stage build (Maven → JRE 21)
│
└── docker-compose.yml               # Local PostgreSQL container
```

---

## Getting Started

### Prerequisites

- **Node.js** 18+
- **Java** 21
- **Maven** 3.9+
- **Docker** (for local database)

---

### 1. Start the Database

If you prefer another username and password simply change those fields inside docker-compose.yml file before running cmd below. 

```bash
docker-compose up
```

This starts a PostgreSQL 16 container on port `5433` with database `aalcDB`.

---

### 2. Start the Backend

Set the required environment variables:

```bash
export DB_URL=jdbc:postgresql://localhost:5433/aalcDB
export DB_USERNAME=sujitbhatta
export DB_PASSWORD=root
```

Then run:

> **Note:** Dataseeder in config seeds default data automatically on server startup when database is empty. To reseed(delete and restart db) simply set FORCE_RESEED=true before running server.

```bash
cd server
./mvnw spring-boot:run     # Using local Maven wrapper if global use mvn not ./mvnw
```

The API will be available at `http://localhost:8080`.

> **IDE alternative:** In IntelliJ go to Run → Edit Configurations → Modify Options → Environment Variables and enter `DB_URL`, `DB_USERNAME`, and `DB_PASSWORD`, then run `ServerApplication.java` directly.

---

### 3. Start the Frontend

Create `client/.env.local` with the following content:

```env
VITE_API_URL=http://localhost:8080
```

Then install dependencies and start the dev server:

```bash
cd client
npm install
npm run dev
```

The app will be available at `http://localhost:5173`.

---

## Environment Variables

### Frontend (`client/.env.local`)

```env
VITE_API_URL=http://localhost:8080
```

### Backend (`server` — passed as environment variables)

| Variable           | Description                          | Example                                   |
|--------------------|--------------------------------------|-------------------------------------------|
| `DB_URL`           | JDBC connection string               | `jdbc:postgresql://localhost:5433/aalcDB` |
| `DB_USERNAME`      | PostgreSQL username                  | `sujitbhatta`                             |
| `DB_PASSWORD`      | PostgreSQL password                  | `root`                                    |
| `PORT`             | Server port (optional, default 8080) | `8080`                                    |
| `ALLOWED_ORIGINS`  | Comma-separated CORS origins         | `http://localhost:5173`                   |

---

## API Reference

All endpoints are prefixed with `/api`.

### Authentication

| Method | Endpoint                        | Description                  |
|--------|---------------------------------|------------------------------|
| `GET`  | `/api/accounts/generate_username` | Generate a random username |
| `POST` | `/api/accounts/register`        | Register a new user          |
| `POST` | `/api/accounts/login`           | Login an existing user       |

**Register / Login body:**
```json
{
  "username": "string",
  "password": "string"
}
```

### Shards (Puzzles)

| Method | Endpoint                  | Description                               |
|--------|---------------------------|-------------------------------------------|
| `GET`  | `/api/shard`              | Get all shards                            |
| `GET`  | `/api/shard/{id}`         | Get a specific shard by ID                |
| `POST` | `/api/shard/{id}/complete`| Mark shard as completed, unlock the next  |

**Shard response shape:**
```json
{
  "id": 1,
  "title": "string",
  "fitb_question": "string",
  "fitb_answer": { "0": ["option1", "answer", "option2"] },
  "rewardsText": "string",
  "puzzleType": "FITB",
  "trackNumber": 1,
  "unlocked": true,
  "completed": false
}
```

---

## Available Scripts

### Frontend

```bash
npm run dev       # Start development server
npm run build     # Production build (TypeScript compile + Vite)
npm run preview   # Preview production build locally
npm run lint      # Run ESLint
```

### Backend

```bash
./mvnw spring-boot:run    # Run the server
./mvnw clean package      # Build JAR
./mvnw test               # Run tests
```

---

## Deployment

### Frontend → Vercel

- Auto-deploys from the `main` branch
- `vercel.json` rewrites all routes to `index.html` for client-side routing
- Set `VITE_API_URL` in Vercel project settings to the production backend URL

### Backend → Render

- Deployed via the included `Dockerfile` (multi-stage: Maven build → JRE 21 runtime)
- Set `DB_URL`, `DB_USERNAME`, `DB_PASSWORD`, and `ALLOWED_ORIGINS` in the Render environment

---

## License

This project is licensed under the terms in the [LICENSE](LICENSE) file.

---

*Built as a Final Year BSc Individual Project in collaboration with the Anti-Apartheid Legacy Centre.*
