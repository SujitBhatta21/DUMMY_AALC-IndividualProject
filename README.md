# Anti-Apartheid Legacy Centre — Interactive Timeline

An interactive educational web application built for the **Anti-Apartheid Legacy Centre (AALC)** as a Final Year BSc project. 
The app teaches by introducing users aged 10–14 about the apartheid regime in South Africa and the resistance movements 
centred around **28 Penton Street** — the ANC's London office — through a series of engaging, puzzle-based learning experiences.
(NOTE: apartheid regime was not just)

---

## Live Demo

| Service                   | URL                                                                                |
|---------------------------|------------------------------------------------------------------------------------|
| Frontend (on Vercel)      | https://aalc-individual-project.vercel.app/                                        |
| Backend API (on Renderer) | [aalc-individualproject.onrender.com](https://aalc-individualproject.onrender.com) |
| PostgreSQL (on Neon.tech) | N/A                                                                                |

---

## Features

PUZZLE PATTERN ---> [Context] --> [Fill-in-the-blanks] --> [Shard specific puzzle]

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
| TypeScript | — |
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

## Project Structure (NOTE: DON"T THINK I NEED THIS)

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
│   │   │   └── WhoWeAre.tsx
│   │   ├── components/
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
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
│   │   │       └── AudioMatching.tsx
│   │   ├── data/                    # Static shard content & seed data
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
│   │   ├── service/                 # Business logic
│   │   ├── repository/              # Spring Data repositories
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

## EITHER THIS:
```bash
cd server
```

Set the required environment variables (or create a `.env` / add them to your shell):

```bash
export DB_URL=jdbc:postgresql://localhost:5433/aalcDB
export DB_USERNAME=sujitbhatta
export DB_PASSWORD=root
```

Then run:

```bash
mvn spring-boot:run
```

The API will be available at `http://localhost:8080`.

## OR THIS:
```bash
cd server
```

Go To: Run > Edit Configuration > Build and Run (Click Modify options) 
-> Environment Variables (enter this in inputfield)
```bash
DB_URL=jdbc:postgresql://localhost:5433/aalcDB;
DB_USERNAME=sujitbhatta;
DB_PASSWORD=root
```

(Run ServerApplication.java file inside server once if not found.)

```aiignore
Simply run ServerApplication.java using run icon don't need 
to touch terminal if you're not comfortable.
```

---

### 3. Start the Frontend

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
mvn spring-boot:run    # Run the server
mvn clean package      # Build JAR
mvn test               # Run tests
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