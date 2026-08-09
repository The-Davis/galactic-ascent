# Galactic Ascent

Galactic Ascent is a minimal viable product (MVP) for a sci-fi browser-based strategy game inspired by the gameplay loops of games like *Game of Thrones: Ascent*.

The player takes on the role of a commander of a newly claimed star system. Throughout the game, they build up their base, accumulate resources, recruit leaders, complete story-driven missions, and align with galactic factions to gain unique permanent bonuses via a reincarnation (prestige) system.

## 🚀 Features

- **Base Building & Resource Management:** Construct and upgrade buildings to passively generate 4 core resources: Credits, Minerals, Research, and Influence.
- **Faction Alignment:** Choose from 5 distinct galactic factions, each granting unique passive bonuses and exclusive buildings.
- **Story Missions:** Complete branching story missions that unlock new buildings, leaders, and story progress. Real-time countdowns add a time-management aspect.
- **Leader System:** Recruit and assign specialized leaders (Military, Science, Economic, Subterfuge) of varying rarities to buildings to boost production or to missions to increase success chances. Leaders gain XP and level up.
- **Reincarnation (Prestige):** Reset your progress to start fresh, taking your current faction's permanent bonus with you into the next incarnation.
- **Persistence:** Progress is automatically saved locally to `localStorage` and calculates offline earnings upon returning to the game.

## 🛠 Tech Stack

- **Framework:** [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool:** [Vite](https://vitejs.dev/)
- **State Management:** [Zustand](https://github.com/pmndrs/zustand)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Fonts:** Orbitron & Rajdhani (Google Fonts)

## 📖 Documentation

- [**Contributing Guide**](contributing.md) - Learn how to add new content (factions, buildings, missions, leaders) using the data-driven architecture.
- [**Planning & Roadmap**](planning.md) - See what features are coming next (e.g., gear systems, combat, fleet management).

## 🌐 Play Online

Galactic Ascent is configured to automatically deploy to GitHub Pages! Any code merged into the `main` branch will trigger a GitHub Action that builds the game and deploys it live. 

Because the game utilizes your browser's local storage to save your progress, you can play directly from the GitHub Pages site and pick up right where you left off when you return.

## 🎮 Running Locally

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:5173](http://localhost:5173) in your browser.

## 🏗 Building for Production

To build the project for production, run:
```bash
npm run build
```
The optimized bundle will be placed in the `dist` directory.
