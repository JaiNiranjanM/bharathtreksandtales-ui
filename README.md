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

## Trip captains & trip money

Each time a trip runs, create a **batch** (one departure) and give it a **captain** who looks after the trip.

- **Captains** (`/admin/captains`): create a login with the captain's email. The page gives you a link to send them; they use it to set their own password, then sign in at `/captain/login`. Switching a captain off signs them out straight away.
- **Batches** (`/admin/batches`): pick the trip and dates and assign captains. Travellers get into a batch in four ways:
  1. you add them one by one, 2. you import a CSV or paste from Excel (a template is provided),
  3. they **book on the trip page** (the booking is saved against that trip and date; a batch is created automatically if there is none yet),
  4. they open the batch's **registration link** (`/join/<code>`, created on the batch page and tied to that trip and date) and fill in their own details.
  People who register themselves (3 and 4) are **Pending** until you confirm them; captains only ever see **Confirmed** travellers. A batch with people waiting shows "to confirm" in the list. The link can be switched off or replaced (the old one then stops working), and it closes by itself when the trip is over.
  There are no payments on the site yet: a booking only saves the traveller's details, and BTT contacts them to confirm and collect payment.
- **Access:** captains see nothing until you click **Give captains access** (the page suggests 3 days before departure). Traveller details lock 2 days after the trip's last day, or as soon as you mark the trip settled. Expense upload stays open until you settle.
- **Money:** record the advance you give the captain. The captain adds each expense with a category, amount, date and bill photos or PDFs. You approve (fully or partly) or reject each claim with a note. The page works out who owes whom, and you record the settlement payment before marking the trip settled.

**Seats.** The "Seats per departure date" on a trip is the number of seats on *each* of its dates. A seat is held the moment someone books or registers, so a date cannot be oversold (the check and the save happen together). People you add or import take seats too. A full date shows as sold out with a waiting-list message; delete a pending person and their seat is freed. The trip page shows live seats left for the date you pick. Change a batch's seats on its page (leave blank for no limit).

**Alerts.** When someone books or registers, you get a short message with the trip, date, number of travellers, who booked, a reference, seats left and a link to confirm them. It is sent after the visitor already has their answer, and a failed alert never affects them. Turn on either or both by setting the keys in `.env.local` (see `.env.example`):
- **Email** (easiest): create a free account at resend.com, make an API key, and set `RESEND_API_KEY`. Until you verify your own domain there, Resend only delivers to your own account email, so set `ALERT_EMAIL_TO` to that address; after verifying a domain, set `ALERT_EMAIL_FROM` and send to any address.
- **WhatsApp**: needs a Meta WhatsApp Business account. Create a *Utility* message template whose body is just `{{1}}`, get it approved, then set `WHATSAPP_CLOUD_TOKEN`, `WHATSAPP_PHONE_NUMBER_ID`, `WHATSAPP_ALERT_TO` (your number, with country code) and `WHATSAPP_TEMPLATE_NAME`. This takes longer to set up than email.

Code: `src/lib/captain/` (rules, database access, bill upload), `src/app/api/admin/{captains,batches}`, `src/app/api/captain`, `src/app/captain`, `src/app/admin/(panel)/{captains,batches}`.
Everything is read and written on the server. Bill files are private and are shown through links that expire after 20 minutes. No new Firebase setup is needed.

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
