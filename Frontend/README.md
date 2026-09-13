# FoodApp Frontend (Next.js)

React frontend for the FoodApp backend API.

## Run

1. Start the backend on port `3000`:
   ```bash
   cd ../Backend
   npm run dev
   ```

2. Start the frontend on port `3001`:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3001](http://localhost:3001)

## End-to-end flow

1. **Login** → Go to `/login` and click **Continue as Demo User**
2. **Browse restaurants** → Home page lists seeded restaurants
3. **View menu** → Click **View Menu** on any restaurant
4. **Add to cart** → Add items and click **Place Order**
5. **View orders** → Open **My Orders** in the navbar
6. **Profile** → Update address/phone on the **Profile** page

Sample data (3 restaurants with menus) is seeded automatically when the backend starts.

## API proxy

Next.js rewrites `/api/*` to `http://localhost:3000/*` (see `next.config.ts`).

## Project structure

```
app/             # Next.js App Router pages (routes)
src/
  components/    # UI components
  context/       # Auth and cart state
  lib/           # API client
  types/         # TypeScript types
```
