# NeuroEight Freelance Marketplace

A modern freelance marketplace platform built with Astro, Supabase, and modern UI/UX principles. Connect talented designers and developers with clients seeking professional services.

![NeuroEight Platform](https://github.com/withastro/astro/assets/2244813/a0a5533c-a856-4198-8470-2d67b1d7c554)

## ✨ Features

- **Modern UI/UX Design**: Sleek interfaces with gradient effects, animations, and responsive layouts
- **User Authentication**: Secure login and registration system powered by Supabase
- **Project Marketplace**: Browse, filter, and search available projects
- **User Profiles**: Comprehensive profiles with portfolio showcasing and skill highlighting
- **Project Creation**: Post new projects with detailed requirements and budgets
- **Reviews & Ratings**: Leave and receive feedback on completed work
- **Admin Dashboard**: Manage users, projects, and platform statistics

## 🚀 Project Structure

Update the project structure to reflect the current state:

```text
/
├── public/
│   ├── assets/
│   │   └── particles.js
│   └── favicon.svg
├── src/
│   ├── assets/
│   │   ├── flags/             # SVG flags for language selector
│   │   ├── styles/            # Global CSS
│   │   ├── astro.svg
│   │   └── background.svg
│   ├── components/            # Reusable Astro/UI components
│   │   ├── AuthForm.astro
│   │   ├── Header.astro
│   │   ├── LanguageSelector.astro
│   │   ├── Notifications.astro
│   │   ├── ProjectCard.astro
│   │   └── ... (and others)
│   ├── i18n/                  # Internationalization setup
│   │   ├── locales/           # Translation JSON files (en, es, de, fr, ja)
│   │   ├── config.ts
│   │   └── utils.ts
│   ├── layouts/               # Main page layout
│   │   └── Layout.astro
│   ├── lib/                   # Core libraries/utilities (e.g., Supabase client)
│   │   └── supabase.ts
│   ├── pages/                 # Astro pages and API endpoints
│   │   ├── api/               # Server-side API routes organized by feature
│   │   │   ├── analytics/
│   │   │   ├── notifications/
│   │   │   ├── payments/
│   │   │   ├── projects/
│   │   │   ├── recommendations/
│   │   │   └── users/
│   │   ├── admin.astro
│   │   ├── index.astro
│   │   ├── login.astro
│   │   ├── profile.astro
│   │   ├── projects.astro
│   │   └── signup.astro
│   └── stores/                # Zustand state management stores
│       └── userStore.ts
├── tests/                   # (Optional location for tests if not co-located)
├── astro.config.mjs         # Astro configuration
├── tailwind.config.js       # Tailwind CSS configuration
├── tsconfig.json            # TypeScript configuration
├── vitest.config.ts         # Vitest configuration
├── package.json
├── .env.example             # Example environment variables
├── .gitignore
├── Dockerfile               # Docker configuration
└── README.md                # This file
```

## 🏁 Getting Started

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd neuroei8gt
    ```
2.  **Set up environment variables:**
    - Copy the example environment file: `cp .env.example .env`
    - Edit the `.env` file and add your actual Supabase and Stripe API keys.
3.  **Install dependencies:**
    ```bash
    npm install
    ```
4.  **Run the development server:**
    ```bash
    npm run dev
    ```
    The application should now be running at `http://localhost:4321`.

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

## 🔧 Tech Stack

- **Framework**: [Astro](https://astro.build/)
- **UI**: [Tailwind CSS](https://tailwindcss.com/), Headless UI (implied by Tailwind usage)
- **Backend & DB**: [Supabase](https://supabase.com/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Language**: TypeScript
- **Testing**: [Vitest](https://vitest.dev/)
- **Internationalization**: Custom setup (see `src/i18n/`)
- **Deployment**: Docker, Vercel

## 📚 Pages

- **Home**: Landing page showcasing platform features and recent projects
- **Projects**: Browse available projects with filtering and search capabilities
- **Profile**: User profiles with portfolio, skills, reviews, and settings
- **Admin**: Dashboard for platform management and analytics

## 🚢 Deployment

The platform is containerized using Docker for consistent development and production environments. Deployment is handled through Vercel with continuous integration.

```bash
# Build and run with Docker
docker build -t neuroei8gt .
docker run -p 4321:4321 neuroei8gt
```

## 🔒 Environment Variables

To run this project, you need to set up the following environment variables. Create a `.env` file in the project root (copy from `.env.example`) and add your keys:

```dotenv
# Supabase Configuration
SUPABASE_URL=your_supabase_url_here
SUPABASE_KEY=your_supabase_anon_key_here

# Stripe Configuration (ensure PUBLIC_ key is safe for client-side)
PUBLIC_STRIPE_KEY=your_stripe_public_key_here
STRIPE_SECRET_KEY=your_stripe_secret_key_here
```

See the `.env.example` file for a template. **Never commit your `.env` file!**

## 🌟 Future Enhancements

- Real-time messaging between clients and freelancers
- Advanced project matching algorithm
- Payment processing integration
- Mobile application with shared codebase

## 📝 License

MIT

## 👥 Contributors

- [James Prince](https://github.com/JamesrPrince)

---

Built with ❤️ using [Astro](https://astro.build)
