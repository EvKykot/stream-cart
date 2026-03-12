# Stream Cart

Microservice ordering platform — a learning project covering NestJS, PostgreSQL, RabbitMQ, Docker, and AWS.

## Structure

```
stream-cart/
├── backend/   — NestJS API server
├── frontend/  — Client application
└── docker-compose.yml
```

## Getting Started

### Prerequisites

- Node.js 20+
- Docker & Docker Compose

### Development

```bash
# Start everything (PostgreSQL + backend)
npm run dev

# Or separately
npm run infra:up        # Start PostgreSQL
npm run backend:dev     # Start NestJS in watch mode
npm run infra:down      # Stop PostgreSQL
```

### Backend manually

```bash
cd backend
cp .env.example .env
npm install
npm run start:dev
```

## Roadmap

### Stage 1 — Monolith NestJS + PostgreSQL

- [x] TypeORM + ConfigModule setup
- [x] Docker Compose with PostgreSQL
- [x] Environment config (.env + .env.example)
- [x] Root package.json with dev scripts
- [x] Users module — entity, service (create, findByEmail, findById, findAll)
- [x] Auth module — register, login, JWT tokens, bcrypt password hashing
- [x] JWT Strategy — token validation on protected endpoints
- [x] Guards — JwtAuthGuard, RolesGuard + @Roles decorator
- [x] Products module — entity, CRUD service + controller
- [x] Products — pagination, search, price filtering, sorting
- [x] Products — POST/PUT/DELETE protected (admin only)
- [x] Orders module — Order + OrderItem entities with relations
- [x] Orders — creation with transaction (stock validation, stock decrement, rollback on failure)
- [x] Orders — pagination + status filter
- [x] Orders — all endpoints protected with JwtAuthGuard
- [x] Validation — class-validator + class-transformer, global ValidationPipe
- [x] ESLint + Prettier configuration
- [x] Repository cleanup (consolidated .gitignore, removed boilerplate)
- [ ] Launch Docker + NestJS, verify DB connection
- [ ] Test all endpoints (Postman or curl)
- [ ] UsersController — GET /users/profile, GET /users (admin only)
- [ ] Swagger — @nestjs/swagger for API documentation
- [ ] Commit and wrap up Stage 1

### Stage 2 — Microservices + RabbitMQ

- [ ] Add RabbitMQ to docker-compose
- [ ] Split monolith into separate NestJS apps (auth, products, orders, payments, notifications)
- [ ] API Gateway — single entry point, proxy requests to services
- [ ] Payments service — payment emulation (always succeeds after 5 sec)
- [ ] Notifications service — react to events (user.registered, order.paid)
- [ ] Event-driven communication via RabbitMQ (order.created → payment.succeeded → order.paid)
- [ ] Dead letter queue for failed events (optional)

### Stage 3 — Dockerization

- [ ] Dockerfile for each service (multi-stage build)
- [ ] Update docker-compose — all services + postgres + rabbitmq + pgadmin
- [ ] Environment files for Docker Compose
- [ ] Verify full stack starts with `docker-compose up`

### Stage 4 — AWS Deployment

- [ ] AWS RDS — managed PostgreSQL
- [ ] AWS ECR — push Docker images
- [ ] AWS ECS Fargate — task definitions, services
- [ ] Application Load Balancer — traffic routing
- [ ] AWS CloudWatch — service logs
- [ ] (Optional) AWS S3 — product images with signed URL upload
- [ ] (Optional) AWS SQS — replace RabbitMQ for notifications

### Extras

- [ ] Refresh tokens (JWT access + refresh)
- [ ] Unit tests (Jest)
- [ ] E2E tests (supertest)
- [ ] Architecture diagram (draw.io)
- [ ] Postman collection or OpenAPI spec

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Runtime | Node.js |
| Framework | NestJS |
| Database | PostgreSQL |
| ORM | TypeORM |
| Auth | JWT + Passport + bcrypt |
| Validation | class-validator |
| Queue | RabbitMQ (Stage 2) |
| Containerization | Docker + Docker Compose |
| Cloud | AWS (RDS, ECR, ECS Fargate, ALB) |
