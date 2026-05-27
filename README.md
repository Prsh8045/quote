# Quote Management Application

A web-based quote management system built with Next.js, TypeScript, Prisma, and PostgreSQL. The application allows users to manage products, create quotes, and handle pricing workflows efficiently.

## Tech Stack

* Next.js
* TypeScript
* Prisma ORM
* PostgreSQL
* Tailwind CSS

## Features

* Create and manage quotes
* Product management
* Tier-based pricing
* Authentication and authorization
* Responsive user interface
* Database integration with Prisma

## Prerequisites

Before running the project, ensure you have installed:

* Node.js (v18 or later)
* PostgreSQL
* npm

## Installation

### 1. Clone the repository

```bash
git clone <repository-url>
cd quote
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the root directory and copy the values from `.env.example`.

Example:

```env
DATABASE_URL="your_database_url"
```

### 4. Run database migrations

```bash
npx prisma migrate dev
```

### 5. Generate Prisma Client

```bash
npx prisma generate
```

### 6. Start the development server

```bash
npm run dev
```

The application will be available at:

```text
http://localhost:3000
```

## Project Structure

```text
app/
components/
prisma/
public/
lib/
```

## Author

Prashant Kumar
