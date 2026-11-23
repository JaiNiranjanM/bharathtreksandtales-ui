# Trekker profiles & step records: data model (sketch)

Status: design only. Nothing here is built yet.
Target: **native** Android (Kotlin) and iOS (Swift) apps, no Expo, sharing this repo's Firebase project.

## Principles

1. **One Firebase project** for web and apps. Same Auth users, same Firestore.
2. **Store daily totals, not raw step samples.** The phone's health store (Health Connect / HealthKit)
   already merges phone + watch data. We save one number per user per day. That is about 365 writes
   per user per year, which is cheap and easy to chart.
3. **Document IDs make writes safe to repeat.** A day's steps live at `stepDays/{yyyy-MM-dd}`, so
   re-syncing overwrites the same document and never double counts.
4. **Roles are never stored in a document the user can edit.** Use Firebase Auth custom claims
   (`admin: true`). The current `ADMIN_EMAIL` check is replaced by this when customers can log in.
5. **Derived numbers (totals, streaks, leaderboards) are computed on the server**, not written by clients.
6. **Health data is sensitive** (India DPDP Act; Apple and Google app review). Collect only what is
   used, record consent, and support export and delete.

## Collections

```
users/{uid}                          profile
  devices/{deviceId}                 one per phone/watch the user signs in on
  stepDays/{yyyy-MM-dd}              daily step totals (local date of the user)
  activities/{activityId}            recorded treks / hikes (phase 2)
  private/medical                    optional health notes (admin + owner only)
  stats/summary                      server-written totals
  rewards/{rewardId}                 rewards the user earned (server-written)
bookings/{bookingId}                 trip bookings (phase 2, ties users to trips)
trips/{tripId}                       already built (admin AI trip flow)
guardianLinks/{minorUid_guardianUid} parent/guardian consent for a minor (server-written)
teams/{teamId}                       invite-only friend/family teams (phase 2)
leaderboards/{boardId}/entries/{uid} server-written rankings
rewardDefs/{rewardId}                reward rules defined by the admin
```

### `users/{uid}`

| Field | Type | Notes |
|---|---|---|
| `displayName` | string | |
| `photoUrl` | string? | Firebase Storage `users/{uid}/avatar.jpg` |
| `phone` | string? | E.164, from phone login |
| `email` | string? | |
| `dob` | string | `YYYY-MM-DD`, required. Used for the age check (see Minors). Never shown to other users |
| `gender` | string? | optional, free choice |
| `city`, `state` | string? | state uses the same names as `allIndianStates` |
| `trekkingLevel` | `"beginner" \| "intermediate" \| "advanced"` | helps match difficulty |
| `emergencyContact` | `{ name, phone, relation }` | needed on real treks |
| `stepGoal` | number | default 8000 |
| `leaderboardOptIn` | bool | default false; only opted-in users are ranked |
| `publicName` | string? | nickname shown on leaderboards. For minors it is auto-generated and cannot be a real name |
| `accountType` | `"adult" \| "minor"` | worked out from `dob` at sign-up; flips to adult on the 18th birthday |
| `guardianConsentStatus` | `"none" \| "pending" \| "granted" \| "revoked"` | minors only; set by the server |
| `units` | `"metric" \| "imperial"` | |
| `consent` | `{ healthData, medicalData, leaderboard, marketing }`, each `{ granted, version, at }` | `version` = privacy policy version accepted |
| `createdAt`, `updatedAt` | timestamp | |

Not stored here: role or admin flag (custom claim), totals (see `stats/summary`).

### `users/{uid}/devices/{deviceId}`

| Field | Type | Notes |
|---|---|---|
| `platform` | `"android" \| "ios"` | |
| `healthSource` | `"health_connect" \| "healthkit"` | |
| `model`, `osVersion`, `appVersion` | string | for debugging |
| `pushToken` | string? | FCM token |
| `lastSyncAt` | timestamp | |

### `users/{uid}/stepDays/{yyyy-MM-dd}`

The date is the user's **local** date. Keep `timezone` so the day boundary is unambiguous.

| Field | Type | Notes |
|---|---|---|
| `steps` | int | total from the OS health store for that local day |
| `distanceM` | number? | metres, if available |
| `activeMinutes` | int? | |
| `floors` | number? | useful for climbs |
| `timezone` | string | e.g. `Asia/Kolkata` |
| `source` | `"health_connect" \| "healthkit"` | |
| `deviceId` | string | which device last synced it |
| `includesManualEntries` | bool | true if any of the day's steps were typed in by hand (see Leaderboards) |
| `flagged` | bool? | set by the server when the day fails a fair-play check |
| `syncedAt` | timestamp | |

Do not add up steps from several devices yourself. Ask the health store for the aggregated total.

### `users/{uid}/activities/{activityId}` (phase 2)

| Field | Type | Notes |
|---|---|---|
| `type` | `"trek" \| "walk" \| "run"` | |
| `tripId` | string? | link to a trip when it was a Bharath Treks & Tales trek |
| `startedAt`, `endedAt` | timestamp | |
| `steps`, `distanceM`, `elevationGainM` | number | |
| `routeFile` | string? | Storage path to a GPX/polyline file; keep GPS points out of Firestore |

### `users/{uid}/stats/summary` (server-written)

`totalSteps`, `totalDistanceM`, `daysActive`, `currentStreakDays`, `longestStreakDays`,
`trekCount`, `consecutiveTrips`, `lastTripDate`, `lastSyncDate`, `updatedAt`. Recomputed by a server job, not by the app.

### `users/{uid}/private/medical` (optional)

`bloodGroup`, `conditions[]`, `allergies[]`, `medications[]`, `notes`. Needs its own consent (`consent.medicalData`). Readable only by the owner
and admins. Admins see it on the trip manifest only for trekkers booked on that trip. The app must
say clearly why it is collected (trip safety) and let the user edit or delete it any time.

### `bookings/{bookingId}` (phase 2)

`userId`, `tripId`, `departureDate`, `seats`, `travellers[]` (name, age, phone, emergency contact),
`pickup`, `amount`, `status` (`pending | paid | cancelled | completed`), `paymentId`, `createdAt`.
Written by the server only, after payment.

## Reading steps natively

**Android (Kotlin): Health Connect**
- Use `HealthConnectClient` and an aggregate request on `StepsRecord.COUNT_TOTAL` per day .
- Ask for the steps read permission. Reading in the background and reading more than 30 days of
  history need extra permissions.
- Health Connect is built into newer Android versions; older ones need the Health Connect app installed.
  Check availability before the first sync.

**iOS (Swift): HealthKit**
- Use `HKStatisticsCollectionQuery` with the cumulative sum of `stepCount`, one bucket per day.
- Use `HKObserverQuery` with background delivery to sync without the app open.
- iOS does not tell you whether the user denied read access, so a denied permission looks like zero
  steps. Show a "check Health permissions" hint when the data is empty.

**Sync flow (both platforms)**
1. After login and consent, read the last N days (for example 30) and write `stepDays/{date}`.
2. Afterwards, sync on app open and on background delivery. Write only days that changed.
3. The Firebase SDKs queue writes offline and send them when the phone is online again.

## Leaderboards and rewards

Both are based on daily steps, so steps must be fair and tamper-resistant.

**Opt-in.** Only users with `leaderboardOptIn = true` and `consent.leaderboard.granted` are ranked.
They appear under `publicName`, never their real name, phone or date of birth.

**Scopes (what the boards compare):**
- **Trip batch** (default, everyone): the people on the same departure. Small, friendly, and a good reason to open the app after a trek.
- **Teams** (phase 2): friends or families join with an invite code. `teams/{teamId}` = `{ name, type: "trip_batch" | "family" | "friends", ownerUid, memberUids[], maxMembers, inviteCodeHash, createdAt }`. Size is not fixed: a trip batch is as big as the trip (for example 10, 20 or 30), and `maxMembers` is set per team.
- **No city boards** for now (decision). They can be added later for adults only.
- **No global all-time ranking.** It rewards cheating and over-exertion.
- **Metric:** adults see total steps. Minors are ranked by **active days** (days they reached their goal) and by team totals, so nobody is pushed to walk until they are exhausted.
- **No messaging and no profile pages** anywhere. A board shows nickname, avatar and number only.

**Rankings are computed on the server.** A scheduled job reads `stepDays` for opted-in users,
applies the fair-play rules below, and writes `leaderboards/{periodId}/entries/{uid}`:
`{ publicName, photoUrl?, steps, distanceM, rank, updatedAt }`. Period ids look like `week-2026-W47`,
`month-2026-11` and `all-time`. Apps can only read these. Top 50 = query ordered by `rank`, limit 50.

**Fair-play rules (server side):**
- Skip steps typed in by hand. Health Connect marks manual entries and HealthKit has a "user entered"
  flag; the app sets `includesManualEntries` and the server excludes those days.
- Cap a day (start at 60,000 steps; tune with real data).
- Flag sudden jumps (for example 10x the user's recent average) and leave flagged days out until an
  admin reviews them.
- Only accept days from a device registered under that user.
- Anything with real value (discount codes, free trips) must be checked by an admin before payout.

**Rewards.**
- `rewardDefs/{rewardId}` (admin): `{ title, description, imageUrl, type, threshold, period, active, percentOff?, maxValueINR?, validityMonths }`
  where `type` is `steps_total | streak | trek_count | trips_consecutive | leaderboard_rank`,
  and `kind` is `badge | discount | free_trip`. `trips_consecutive` also has `windowDays`.
- `users/{uid}/rewards/{rewardId}` (server-written): `{ rewardId, kind, earnedAt, status: "earned" | "redeemed" | "expired", couponCode?, value?, expiresAt?, redeemedBookingId? }`.

**Starting reward ideas (to be tuned):**
| Reward | Rule |
|---|---|
| Badges | first trek, first 100,000 steps, 7-day streak, 5 treks, etc. |
| Trip discount | 3 consecutive trips: 15-20% off one trip |
| Free trip | 10 consecutive trips: voucher worth Rs 10,000-15,000 |

"Consecutive" needs a definition. Suggested: each completed trip happens within `windowDays` (for example
90 days) of the previous one. The server keeps `consecutiveTrips` and `lastTripDate` in `stats/summary`
and updates them when a booking is marked `completed`. Discounts are single-use coupon codes with an
expiry; a free trip is a voucher up to a set value. The percentage and voucher value are fields on the
reward (`percentOff`, `maxValueINR`), so you can set them inside 15-20% and Rs 10,000-15,000 and change
them without code. Suggested start: 15% and Rs 10,000; if a trip costs more than the voucher, the trekker
pays the difference. Coupons and vouchers last 12 months from the day they are earned
(`validityMonths = 12`) and cannot be combined with other offers or with each other; the booking system
must reject a second code on the same booking. A minor's voucher is redeemed by the guardian when
they book.
- The server job awards rewards from validated data only. The app never decides what a user earned.

**Minors.** See "Minors and parental consent" below.

## Minors and parental consent

The app is meant to help teens build healthy trekking habits, so under-18 users are supported with a
parent/guardian consent flow. Minimum age: **13** (can be changed later).

**Account states for a minor**
1. Teen signs up with their date of birth, so `accountType = "minor"` and `guardianConsentStatus = "pending"`.
   The account is limited: no health sync, no leaderboard, no rewards.
2. Teen enters a parent's phone number. The server sends the parent an invite link (SMS).
3. The parent signs in with their own account (phone OTP), proves they are over 18 with a **DigiLocker age check**, confirms they are the
   parent/legal guardian, reads what will be collected, and ticks each consent: health data, medical data,
   leaderboard, rewards.
4. The **server** records the consent in `guardianLinks/{minorUid}_{guardianUid}`, sets
   `guardianConsentStatus = "granted"` and sets the custom claim `guardianConsent = true` on the teen's
   login. A teen can never approve themselves.
5. The parent can change or withdraw any consent, view the teen's steps and treks, and delete the
   account. Withdrawing health consent stops syncing right away.
6. On the 18th birthday the account becomes an adult account. The user must give their own consent.

**Extra protections for minors**
- Nickname only (auto-generated), no photo on boards, no messaging, no profile pages.
- Boards limited to their trip batch or a team a guardian approved.
- No marketing consent, no targeted ads.
- Medical notes are entered and edited by the guardian only.
- Payments and bookings are made by the guardian. The minor appears as a traveller on the booking.
- Rewards that cost money (discount, free trip) are redeemed through the guardian.

**`guardianLinks/{minorUid}_{guardianUid}`** (server-written)

| Field | Type | Notes |
|---|---|---|
| `minorUid`, `guardianUid` | string | the id is `minorUid_guardianUid` so rules can look it up |
| `relation` | `"mother" \| "father" \| "legal_guardian"` | |
| `guardianPhone` | string | E.164, verified by OTP |
| `status` | `"invited" \| "granted" \| "revoked" \| "expired"` | |
| `consent` | `{ healthData, medicalData, leaderboard, rewards }` | each `{ granted, version, at }` |
| `verification` | `{ method, at }` | how adulthood and relationship were checked |
| `inviteCodeHash`, `expiresAt` | string, timestamp | invite expires (for example after 7 days) |
| `createdAt`, `grantedAt`, `revokedAt` | timestamp | |

**Parent verification (two steps).**
1. **Phone OTP** confirms the number and signs the parent in.
2. **DigiLocker age check** confirms the adult is 18 or older. Store only the result and the time in
   `verification`, never the documents.
Using DigiLocker means registering with the government's API platform (API Setu) as a requesting
organisation. That has eligibility rules and approval time, so start early and check the current process.
Do not launch minor accounts on OTP alone unless your lawyer says that is enough.

**Legal note.** India's DPDP Act requires *verifiable* parental consent for children and restricts
tracking or monitoring children's behaviour. Step tracking for minors might count as monitoring, and the
rules include exemptions and a specific way to verify a parent. A lawyer should confirm the consent flow,
the verification method, and whether the step-sync and leaderboard features are allowed for minors,
before you launch it. Apple's and Google's store policies for children's apps also apply.

## Deleting an account

On request (by the user, or the guardian for a minor), a server job deletes everything:
- Firestore: `users/{uid}` and all its subcollections (`recursiveDelete` in the Admin SDK; Firestore
  does not cascade on its own), the user's entries in `leaderboards`, their `guardianLinks`, and
  their membership in `teams`.
- Storage: everything under `users/{uid}/`.
- Firebase Auth: the login itself.
- **Bookings and payment records are the exception.** Tax and accounting rules usually require keeping
  them for a number of years. Keep only what is needed and remove the rest of the personal details;
  confirm the retention period with an accountant.
- Backups age out after their retention period; say so in the privacy policy.
Confirm to the user by email or SMS when it is done.

## Security rules (sketch, not tested)

Because the native apps talk to Firestore directly, `firestore.rules` can no longer deny everything.

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function signedIn() { return request.auth != null; }
    function isOwner(uid) { return signedIn() && request.auth.uid == uid; }
    function isAdmin() { return signedIn() && request.auth.token.admin == true; }
    function isMinor() { return request.auth.token.get('minor', false); }
    // A minor's data is usable only after the guardian has consented (claim set by the server).
    function consentOk() { return !isMinor() || request.auth.token.get('guardianConsent', false); }
    function isGuardianOf(uid) {
      return signedIn() && exists(/databases/$(database)/documents/guardianLinks/$(uid + '_' + request.auth.uid))
        && get(/databases/$(database)/documents/guardianLinks/$(uid + '_' + request.auth.uid)).data.status == 'granted';
    }
    function canRead(uid) { return isOwner(uid) || isAdmin() || isGuardianOf(uid); }

    match /users/{uid} {
      allow read: if canRead(uid);
      allow create, update: if isOwner(uid);          // add a field allow-list before shipping
      allow delete: if canRead(uid);

      match /stepDays/{day} {
        allow read: if canRead(uid);
        allow write: if isOwner(uid) && consentOk()
          && day.matches('[0-9]{4}-[0-9]{2}-[0-9]{2}')
          && request.resource.data.steps is int
          && request.resource.data.steps >= 0
          && request.resource.data.steps <= 100000;
      }
      match /devices/{deviceId} { allow read, write: if isOwner(uid); }
      match /activities/{id} { allow read, write: if isOwner(uid) || (isAdmin() && request.method == 'get'); }
      match /private/{doc}  { allow read: if canRead(uid); allow write: if (isOwner(uid) && !isMinor()) || isGuardianOf(uid); }  // minors: guardian writes
      match /stats/{doc}    { allow read: if canRead(uid); allow write: if false; }
    }

    match /leaderboards/{period}/entries/{uid} { allow read: if signedIn(); allow write: if false; }
    match /guardianLinks/{linkId} { allow read: if signedIn() && (resource.data.minorUid == request.auth.uid || resource.data.guardianUid == request.auth.uid); allow write: if false; }
    match /rewardDefs/{id} { allow read: if signedIn(); allow write: if isAdmin(); }

    match /bookings/{id} { allow read: if signedIn() && resource.data.userId == request.auth.uid; allow write: if false; }
    match /trips/{id}    { allow read, write: if false; }   // still served through the Next.js server only
  }
}
```

`storage.rules` also changes: `users/{uid}/...` writable by that user, and the admin check moves from
the email to the `admin` claim.

## Login for native apps

- **Phone OTP** is the most common in India; add **Google** sign-in. If you offer Google (or any
  other social login) on iOS, Apple requires **Sign in with Apple** as well.
- A guardian is just a normal adult account linked to the minor through `guardianLinks`. The same login methods apply.
- Use the native Firebase Auth SDKs (Android and iOS). Link accounts so one person who signs in by
  phone and later by Google stays one user.
- The website admin login keeps working. Give the admin account the `admin` claim and drop `ADMIN_EMAIL`
  once customers can sign in.

## Where each part runs

| Task | Where |
|---|---|
| Profile read/write, step sync | App writes straight to Firestore (offline queue, cheap) |
| Totals, streaks, leaderboards | Server job (Next.js route on a schedule, or a Cloud Function) |
| Trips list and details | Existing Next.js server |
| Booking and payment | Next.js API routes (server only), writes `bookings` |

## Decisions

1. **Date of birth:** full `dob`, required. Drives `accountType`.
2. **Medical notes:** yes, with separate consent. Owner and admins can read them; shown on a trip manifest only for trekkers booked on it. For minors, only the guardian writes them.
3. **Leaderboards and rewards:** yes, opt-in, computed on the server with fair-play checks. Boards are **trip batch and teams only**; no city or global ranking.
4. **Step detail:** daily totals only. Per-trek detail comes from `activities`.
5. **Minors:** supported from **age 13** (changeable later), with a verified parent/guardian consent flow.
6. **Parent verification:** phone OTP plus a DigiLocker age check.
7. **Rewards:** badges; trip discount of 15-20% after 3 consecutive trips; free trip worth Rs 10,000-15,000 after 10 consecutive trips. More to be explored later.
8. **"Consecutive":** each completed trip within 90 days of the previous one.
9. **Deleting an account** removes all data, except booking/payment records the law requires keeping.
10. **Teams:** a minor joins only teams their guardian approved; mixed adult/minor teams are created by the guardian (family teams). Team size is per team (trip batches follow the trip size: 10, 20, 30...).
11. **Coupons and vouchers:** valid 12 months from the day earned, not combinable with other offers.
12. **Fair-play step cap:** 60,000 steps per day to start.

## Still open

1. **DigiLocker:** access still has to be applied for (API Setu). Start now, since approval takes time.
2. **Lawyer review** of the minors flow, parent verification and leaderboard rules before launch (you are arranging this).

## Suggested build order

0. Start the DigiLocker (API Setu) application now; it runs in parallel with everything else.
1. Customer accounts and the `admin` claim on the website (Auth + rules), including the guardian consent flow (web page for parents).
2. Native app: login, profile, consent.
3. Native app: Health Connect / HealthKit sync into `stepDays`, plus a simple progress screen.
4. `stats/summary` and leaderboard server jobs, then rewards.
5. Bookings and payments, then activities with GPS routes.
