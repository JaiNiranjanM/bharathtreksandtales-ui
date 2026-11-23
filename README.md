# Bharath Treks & Tales

Next.js 15 site for treks, spiritual tours and weekend trips, with an admin panel where trips are
created from an uploaded itinerary using AI.

```bash
npm install
cp .env.example .env.local   # then fill in the values (see below)
npm run dev                  # http://localhost:3000
```

## Admin trip manager

- `/admin/login`: admin sign-in (a single admin, set by `ADMIN_EMAIL`)
- `/admin`: all trips (generating / draft / published / failed)
- `/admin/trips/new`: upload an itinerary (PDF, Word, screenshots or pasted text), photos, price,
  seats and dates, then click **Generate trip page**
- `/admin/trips/<id>`: review and edit every field, check the **Preview** tab (it's the real trip page),
  then **Publish**. Published trips can be edited, updated, unpublished or deleted.

### How generation works

1. The browser uploads files to Firebase Storage under `trips/<id>/`.
2. `POST /api/admin/trips` creates a draft and, in the background (`after()`), calls Claude:
   - **Research:** Claude reads the itinerary and uses web search to gather altitude, distance, weather,
     best season, temples, permits and safety facts (optional; you can turn it off per trip).
   - **Extract:** Claude turns the itinerary and research notes into the trip page fields
     (structured output validated by `aiTripSchema` in `src/lib/trip-schema.ts`).
3. The draft becomes editable. Publishing clears the public page cache, so the trip appears in
   `/packages`, on the home page and on the map right away.

Code: `src/lib/ai/generateTrip.ts`, `src/app/api/admin/**`, `src/components/admin/**`, `src/lib/trips.ts`.

## One-time Firebase setup

1. Create a project at https://console.firebase.google.com.
2. **Authentication → Sign-in method:** enable *Email/Password*. Under **Users**, add the admin user
   (the same email as `ADMIN_EMAIL`).
3. **Firestore Database:** create it (production mode). Paste `firestore.rules` into the Rules tab.
4. **Storage:** create the default bucket. Paste `storage.rules` into the Rules tab, replacing
   `you@example.com` with your admin email.
5. **Project settings → General → Your apps:** add a Web app and copy its config into the
   `NEXT_PUBLIC_FIREBASE_*` variables.
6. **Project settings → Service accounts → Generate new private key:** copy `project_id`,
   `client_email` and `private_key` into `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL` and
   `FIREBASE_PRIVATE_KEY`.
7. Get a Claude API key from https://console.anthropic.com and set `ANTHROPIC_API_KEY`.

Once real trips are live, set `SHOW_SAMPLE_TRIPS=false` to hide the hard-coded sample trips.

## Deploying

On Vercel, add the same environment variables in the project settings. Generation runs for up to
5 minutes (`maxDuration = 300` in `src/app/api/admin/trips/route.ts`), which needs a plan that allows it.
