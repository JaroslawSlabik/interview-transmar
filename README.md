# TRANSMAR interview app

A system for managing assembly lines, products, workstations, and allocations in a production environment.

## Project Description

The application consists of three main components:
- **Backend (BE)** - REST API built with Node.js/Express and TypeScript
- **Frontend (FE)** - Web application built with Angular 18
- **Database** - PostgreSQL with Redis for session caching

The system enables:
- User management and authentication
- Product management
- Assembly line management
- Workstation management
- Allocation of workstations to assembly lines

## Project Structure

```
.
├── BE/                          # Backend (Node.js + Express + TypeScript)
│   ├── config/                  # Database and Redis configuration
│   ├── controllers/             # REST API controllers
│   ├── dto/                     # Data Transfer Objects with validation
│   ├── errors/                  # Error handling
│   ├── middleware/              # Middleware (auth, validation)
│   ├── models/                  # Data models
│   ├── routes/                  # API endpoint definitions
│   ├── services/                # Business logic
│   ├── tests/                   # Unit tests (Jest)
│   └── app.ts                   # Main application file
│
├── FE/                          # Frontend (Angular 18)
│   └── src/
│       └── app/
│           ├── components/      # Angular components
│           ├── services/        # Services (API, Toast)
│           ├── models/          # TypeScript models
│           └── *.interceptor.ts # HTTP interceptors (auth, error)
│
├── SQL/                         # SQL scripts
│   ├── init_structure.sql       # Database structure
│   └── init_example_values.sql  # Sample data
│
├── .env                         # Environment variables
└── docker-compose.yml           # Docker Compose configuration
```

## Technologies and Libraries

### Backend
- **Node.js** with **TypeScript** - runtime environment
- **Express.js** - web framework
- **PostgreSQL (pg)** - relational database
- **Redis** - session and token caching
- **bcrypt** - password hashing
- **class-validator** + **class-transformer** - DTO validation
- **cors** - CORS handling
- **Jest** + **Supertest** - unit testing

### Frontend
- **Angular 18** - frontend framework
- **RxJS** - reactive programming
- **TailwindCSS** - styling
- **Jest** - unit testing

### Infrastructure
- **Docker** + **Docker Compose** - containerization
- **PostgreSQL 15 Alpine** - database
- **Redis 7 Alpine** - cache

## Database Schema

Main tables:
- `users` - system users
- `products` - products
- `assembly_lines` - assembly lines
- `workstations` - workstations
- `assembly_line_workstations` - workstation allocations to lines

## Running the Project

### Requirements
- Docker
- Docker Compose

### Starting the Application

```bash
docker-compose up
```

The first run usually takes a long time, as it builds the Docker image, initializes the SQL database, installs packages, builds the project, and finally starts everything.

The application will be available at:
- **Frontend**: http://0.0.0.0:4200
- **Backend**: http://0.0.0.0:3000
- **PostgreSQL**: localhost:5432
- **Redis**: localhost:6379

### Stopping the Application

```bash
docker-compose down
```

## Default Credentials

Login: admin
Password: ----

