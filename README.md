# 🚀 Next.js Prisma Blog App

![Next.js](https://img.shields.io/badge/Next.js-black?style=for-the-badge&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

A modern, full-stack blog application built with performance and scalability in mind. Features a robust authentication system, role-based access control, and a dynamic content management system.

## ✨ Features

- **🔐 Secure Authentication**: Powered by **NextAuth.js v4**.
  - Social Login (Google, GitHub, etc.)
  - Email/Password Credentials with `bcrypt` encryption.
  - Email Verification via `nodemailer`.
- **🛡️ Role-Based Access Control (RBAC)**:
  - **Admin**: Full system control.
  - **Author**: Create and manage own posts.
  - **User**: Read and comment.
- **📝 Content Management**:
  - Rich Text support (`react-markdown`).
  - Image handling.
  - Slug generation for SEO-friendly URLs.
- **💬 Interactive Community**:
  - **Nested Comments**: Multi-level reply system.
  - Comment approval workflow (Admin/Author moderation).
- **🎨 Modern UI/UX**:
  - Responsive design with **Tailwind CSS 4**.
  - Dark mode support (configurable).
  - Clean icons using `react-icons` and `lucide-react`.

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Database**: [PostgreSQL](https://www.postgresql.org/)
- **ORM**: [Prisma](https://www.prisma.io/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Validation**: [Zod](https://zod.dev/)

## 🚀 Getting Started

Follow these steps to set up the project locally.

### Prerequisites

- Node.js 18+ installed.
- PostgreSQL database running (local or cloud like Neon/Supabase).

### Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/yourusername/next.js-prisma-blog-app.git
    cd next.js-prisma-blog-app
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Environment Setup:**
    Create a `.env` file in the root directory and add the following variables:

    ```env
    # Database
    DATABASE_URL="postgresql://user:password@localhost:5432/mydb?schema=public"

    # NextAuth
    NEXTAUTH_URL="http://localhost:3000"
    NEXTAUTH_SECRET="your-super-secret-key"

    # OAuth Providers (if using)
    GOOGLE_CLIENT_ID="your-google-client-id"
    GOOGLE_CLIENT_SECRET="your-google-client-secret"

    # Email (Nodemailer)
    SMTP_USER="your-email@example.com"
    SMTP_PASS="your-email-password"
    ```

4.  **Database Setup:**
    Push the Prisma schema to your database:

    ```bash
    npx prisma generate
    npx prisma db push
    ```

5.  **Run the development server:**

    ```bash
    npm run dev
    ```

    Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📂 Project Structure

```bash
├── app/                # Next.js App Router pages & API routes
├── components/         # Reusable UI components
├── lib/                # Utility functions & libraries
├── prisma/             # Database schema & migrations
├── public/             # Static assets
└── types/              # TypeScript type definitions
```


