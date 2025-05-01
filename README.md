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

```text
/
├── public/
│   └── favicon.svg
├── src/
│   ├── assets/
│   │   ├── astro.svg
│   │   ├── background.svg
│   │   └── styles.css
│   ├── components/
│   │   ├── Analytics.astro
│   │   ├── AuthForm.astro
│   │   ├── Chat.astro
│   │   ├── Header.astro
│   │   ├── ProjectCard.astro
│   │   └── Welcome.astro
│   ├── layouts/
│   │   └── Layout.astro
│   └── pages/
│       ├── admin.astro
│       ├── index.astro
│       ├── profile.astro
│       └── projects.astro
├── astro.config.mjs
├── Dockerfile
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vercel.json
```

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

- **Frontend**: Astro, TypeScript, Modern CSS with variables and animations
- **Backend**: Supabase for authentication, database, and storage
- **Deployment**: Docker containerization, Vercel hosting

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

To run this project, you need to set up the following environment variables:

```
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_anon_key
```

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
