# BartendersHub 🥃

A sophisticated Art Deco-inspired cocktail webapp with premium mixology
experience.

## 🚀 Deployment to Vercel

### Option 1: Deploy via GitHub (Recommended)

1. **Push to GitHub:**

    ```bash
    git init
    git add .
    git commit -m "Initial commit"
    git branch -M main
    git remote add origin https://github.com/yourusername/bartendershub.git
    git push -u origin main
    ```

2. **Deploy on Vercel:**
    - Go to [vercel.com](https://vercel.com)
    - Click "New Project"
    - Import from GitHub
    - Select your repository
    - Vercel will auto-detect Vite configuration
    - Click "Deploy"

### Option 2: Deploy via CLI

1. **Install Vercel CLI:**

    ```bash
    npm install -g vercel
    ```

2. **Login:**

    ```bash
    vercel login
    ```

3. **Deploy:**
    ```bash
    vercel --prod
    ```

### Option 3: Drag & Drop

1. **Build the project:**

    ```bash
    npm run build
    ```

2. **Go to Vercel:**
    - Visit [vercel.com/new](https://vercel.com/new)
    - Drag and drop the `dist` folder

## 🛠️ Build Configuration

The project includes:

-   `vercel.json` for deployment configuration
-   Vite build system
-   React 19 with Tailwind CSS
-   Art Deco responsive design

## 📱 Features

-   Responsive mobile-first design
-   Sophisticated Art Deco styling
-   Premium cocktail experience
-   Smooth animations and transitions

## 🎨 Technologies

-   React 19
-   Vite
-   Tailwind CSS
-   Art Deco design principles
-   Mobile-optimized responsive design+ Vite

This template provides a minimal setup to get React working in Vite with HMR and
some ESLint rules.

Currently, two official plugins are available:

-   [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react)
    uses [Babel](https://babeljs.io/) for Fast Refresh
-   [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc)
    uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript
with type-aware lint rules enabled. Check out the
[TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts)
for information on how to integrate TypeScript and
[`typescript-eslint`](https://typescript-eslint.io) in your project.
