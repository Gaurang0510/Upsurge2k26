# Upsurge 2K26 End-to-End Audit Report

**Audit date:** 2026-07-23  
**Scope:** React/Vite frontend, Express/Mongoose backend, static admin panel, seed scripts, deployment configuration, dependencies, data flow, and CI configuration.

## Executive Summary

The repository is a functional demo with a public event site and a shortlisted-team registration workflow. The main registration path has useful baseline controls: JWT purpose checking, server-side field validation, image magic-byte checks, Cloudinary upload size/type limits, Mongoose enums, HTML escaping in the admin table, Helmet, CORS allow-list support, and rate limits on several public endpoints.

It is not production-ready. The highest-risk problems are an exposed local environment file containing database, admin, and Cloudinary secrets; a Vercel configuration that rewrites API requests to the frontend while no backend deployment target is defined; missing role enforcement for every protected admin mutation/export; public status lookups that disclose team and payment state; weak validation in admin edits; and a very large frontend bundle. The backend has no automated test suite, no isolated integration environment, and the current audit could not safely execute destructive flows against the configured external database.

## Architecture and Data Flow

- **Frontend:** React 18, React Router 6, Vite, Tailwind, Three.js/R3F, Spline, Framer Motion, and canvas-heavy visual components. Routes are defined in [frontend/src/routes/AppRoutes.jsx](frontend/src/routes/AppRoutes.jsx).
- **Backend:** Express starts in [backend/server.js](backend/server.js), connects to MongoDB through [backend/src/config/db.js](backend/src/config/db.js), serves `/api/v1/*`, and serves the static admin panel under `/admin`.
- **Public flow:** The registration page calls event lookup, invitation verification, registration submission, and public status lookup. Invitation verification returns a short-lived registration JWT containing the normalized email and six-digit invitation code.
- **Persistence:** `ShortlistEntry` maps email to invitation code; `Team` stores participant data and workflow state; `Registration` stores UTR and Cloudinary proof; `Admin` stores bcrypt password hashes and role.
- **Admin flow:** The static panel stores a bearer JWT in `sessionStorage` and calls admin list/detail/edit/review/export/shortlist APIs.
- **Deployment:** The root [vercel.json](vercel.json) builds only `frontend` and rewrites every path to `frontend/index.html`. The backend is not represented as a Vercel function or separate deployment in this repository.

## Verified Findings

### AUD-001: Secrets are present in the local environment file

**Severity:** Critical  
**Category:** Secrets management / credential exposure  
**Affected files:** `backend/.env`; the root ignore rules happen to ignore `.env`, but no backend-specific secret policy exists.

**Evidence:** The working tree contains `backend/.env` with a MongoDB connection string, admin password, JWT configuration, and Cloudinary API secret. `git ls-files` shows the file is not currently tracked, but ignored files can still be copied into archives, editor backups, logs, screenshots, or deployment artifacts.

**Impact:** Anyone who obtains the file can access or modify the database, impersonate admins if the JWT secret is usable, and access or destroy payment-proof assets. The configured default-style admin password also creates a direct takeover risk.

**Reproduction:** Open `backend/.env` in the working tree and observe database, admin, JWT, and Cloudinary credentials. Check `git ls-files backend/.env`; it is ignored, not a substitute for rotation.

**Root cause:** Credentials were placed in a developer workspace and the project has no secret scanning or deployment secret policy.

**Recommended fix:** Immediately rotate the MongoDB user password, Cloudinary secret, admin password, and JWT secret. Remove the file from all backups and shared artifacts. Add a backend-specific `.gitignore`, a pre-commit/CI secret scanner, secret-manager deployment instructions, and startup checks that reject placeholder or weak secrets.

### AUD-002: Production deployment rewrites API requests to the SPA

**Severity:** Critical  
**Category:** Deployment / availability / integration failure  
**Affected files:** [vercel.json](vercel.json), [frontend/vercel.json](frontend/vercel.json), [frontend/src/pages/Register/Register.jsx](frontend/src/pages/Register/Register.jsx)

**Impact:** The root Vercel configuration builds only the frontend and rewrites `/(.*)` to `index.html`. With the frontend's default empty `VITE_API_BASE_URL`, `/api/v1/events` and all registration requests resolve to the SPA document rather than Express JSON. Registration is therefore broken unless an independently configured backend URL and routing arrangement exist outside this repository.

**Reproduction:** Deploy using the root Vercel configuration, then request `GET /api/v1/events`. The rewrite matches the request before any backend route exists in the deployment and returns the frontend entry document.

**Root cause:** Frontend and backend deployment concerns are mixed without a backend function definition, reverse proxy rule, or required production API URL.

**Recommended fix:** Deploy the backend separately and set a required production `VITE_API_BASE_URL`, or convert Express routes to explicitly configured serverless functions. Add a deployment smoke test that asserts `/api/v1/events` returns JSON and that `/admin` reaches the backend.

### AUD-003: STAFF receives all ADMIN capabilities

**Severity:** High  
**Category:** Broken access control / privilege escalation  
**Affected files:** [backend/src/middleware/auth.js](backend/src/middleware/auth.js), [backend/src/routes/adminRoutes.js](backend/src/routes/adminRoutes.js)

**Impact:** `protectAdmin` accepts both `ADMIN` and `STAFF`. `requireRole` exists but is never used. Any STAFF token can edit teams, verify or reject payments, import shortlist entries, export PII/payment URLs, and view all admin data.

**Reproduction:** Authenticate as a database user with `role: "STAFF"`, then send its bearer token to `PATCH /api/v1/admin/teams/:id/review-payment`, `POST /api/v1/admin/shortlist/import`, or `GET /api/v1/admin/export`. The routes are protected only by `router.use(protectAdmin)`.

**Root cause:** Authentication and authorization are implemented as one middleware boundary; route-level role policy was defined but not wired.

**Recommended fix:** Apply explicit policy middleware per route. Allow staff read/detail operations only if intended, and require `ADMIN` for shortlist import, team mutation, payment review, and export. Add tests for every role and endpoint.

### AUD-004: Public status lookup is an IDOR and discloses workflow state

**Severity:** High  
**Category:** Broken access control / privacy  
**Affected files:** [backend/src/controllers/registrationController.js](backend/src/controllers/registrationController.js), [frontend/src/pages/Register/Register.jsx](frontend/src/pages/Register/Register.jsx)

**Impact:** Anyone can query a known six-digit team code or shortlisted email and receive team name, status, payment status, fee amount, update timestamp, and rejection reason. When both query parameters are supplied, the controller uses `teamCode` and does not verify that the email matches the team.

**Reproduction:** Send `GET /api/v1/registrations/status?teamCode=KNOWN_CODE&email=unrelated@example.com`. No authenticated ownership proof is required, and the email is ignored for team-code lookups.

**Root cause:** A public convenience lookup is treated as authorization. Six-digit codes are identifiers, not secrets.

**Recommended fix:** Require a one-time status token issued after invitation verification, or require a high-entropy registration code plus a second matching factor. Enforce consistency when both fields are supplied, minimize returned fields, and avoid returning private rejection reasons publicly.

### AUD-005: Admin edits bypass registration validation and workflow invariants

**Severity:** High  
**Category:** Input validation / data integrity / business logic  
**Affected files:** [backend/src/controllers/adminController.js](backend/src/controllers/adminController.js), [backend/src/models/Team.js](backend/src/models/Team.js)

**Impact:** `updateTeam` accepts leader and member values without email, phone, length, uniqueness, or character validation. It permits a leader email that no longer matches `shortlistEmail`, duplicate member identities, arbitrary problem statements up to the schema's unconstrained string size, and an arbitrary `paymentReviewReason` field. Mongoose required/enum checks do not provide the business validation performed by public registration.

**Reproduction:** With an admin token, PATCH a team with `leader.email: "not-an-email"`, a member with the same email/phone as another member, or a leader email different from the shortlisted email. The route does not call `validatePerson` or equivalent validation.

**Root cause:** Public and admin update paths have separate, inconsistent validation logic.

**Recommended fix:** Centralize DTO/schema validation and apply it to every write path. Validate and normalize nested people, enforce team membership constraints and identity uniqueness, whitelist mutable fields, and record an audit trail for administrative changes.

### AUD-006: Payment review is not transactional

**Severity:** High  
**Category:** Data consistency / race condition  
**Affected files:** [backend/src/controllers/adminController.js](backend/src/controllers/adminController.js)

**Impact:** Team and registration documents are saved concurrently with `Promise.all`. If one save succeeds and the other fails, payment and team state diverge. Concurrent review requests can also overwrite one another without an optimistic version check or transaction.

**Reproduction:** Interrupt or fail one write after the other has committed, or send concurrent `PATCH /review-payment` requests with opposite decisions. The operation has no MongoDB session transaction and no conditional state transition.

**Root cause:** The registration submission path uses a transaction, but the corresponding admin workflow does not.

**Recommended fix:** Use a MongoDB transaction for both documents, require an expected current status/version, and make review transitions idempotent. Add concurrent approval/rejection tests.

### AUD-007: Production error responses disclose internal messages

**Severity:** Medium  
**Category:** Information disclosure / error handling  
**Affected files:** [backend/src/middleware/errorHandler.js](backend/src/middleware/errorHandler.js)

**Impact:** The handler returns `err.message` for all errors, including database, Cloudinary, validation, and infrastructure errors. These can reveal collection/index details, provider responses, or operational configuration to unauthenticated callers.

**Reproduction:** Trigger a database or Cloudinary failure on a route and inspect the JSON response in production mode.

**Root cause:** Internal exception text is used directly as the public API message.

**Recommended fix:** Map known operational errors to safe public messages, generate a correlation ID, log the detailed error server-side, and return stack traces only through protected diagnostics.

### AUD-008: Search accepts unbounded regex input

**Severity:** Medium  
**Category:** Denial of service / query abuse  
**Affected files:** [backend/src/controllers/adminController.js](backend/src/controllers/adminController.js)

**Impact:** Admin search interpolates arbitrary user input into MongoDB `$regex` clauses. Long or pathological patterns can cause expensive collection scans/regex evaluation; page values can also produce very large `skip` operations.

**Reproduction:** As an authorized user, request `/api/v1/admin/teams?search=<very-long-or-pathological-pattern>&page=999999999`. Repeat concurrently.

**Root cause:** Search input is neither length-bounded nor escaped/translated to a safe literal search, and pagination has no maximum page.

**Recommended fix:** Limit and normalize search length, escape regex metacharacters or use a properly indexed text/Atlas Search query, cap page numbers, add indexes for supported filters, and rate-limit admin search separately.

### AUD-009: JWT sessions cannot be revoked and are stored in browser storage

**Severity:** Medium  
**Category:** Authentication / session management  
**Affected files:** [backend/src/controllers/adminController.js](backend/src/controllers/adminController.js), [backend/src/middleware/auth.js](backend/src/middleware/auth.js), [backend/admin-panel/login.html](backend/admin-panel/login.html), [backend/admin-panel/js/app.js](backend/admin-panel/js/app.js)

**Impact:** Admin tokens last up to seven days, are accepted after logout, and are not invalidated on password reset or role change. `sessionStorage` is better than persistent storage but remains readable by same-origin JavaScript, so an XSS or compromised dependency can exfiltrate the token.

**Recommended fix:** Use short-lived access tokens with refresh-token rotation and server-side revocation/version checks, or use secure, HttpOnly, SameSite cookies with CSRF protection. Invalidate sessions on credential and role changes, and add CSP.

### AUD-010: Missing brute-force and abuse controls on identity/status workflows

**Severity:** Medium  
**Category:** Authentication abuse / privacy  
**Affected files:** [backend/server.js](backend/server.js), [backend/src/controllers/registrationController.js](backend/src/controllers/registrationController.js)

**Impact:** Invitation verification and status checks are limited only by IP. There is no per-email/team-code lockout, distributed abuse control, CAPTCHA/challenge, or account-level audit. Attackers can rotate IPs while enumerating six-digit codes or harvesting status data.

**Recommended fix:** Add per-identity throttles, progressive delays, anomaly logging, a bounded retry state, and a privacy-preserving response that does not distinguish existence unnecessarily.

### AUD-011: CORS is permissive when configuration is missing

**Severity:** Medium  
**Category:** Security configuration  
**Affected files:** [backend/server.js](backend/server.js)

**Impact:** An empty `FRONTEND_URL` allows every origin while `credentials: true` is enabled. Current authentication uses an Authorization header, but this default is still an unsafe production posture and makes future cookie authentication vulnerable to cross-origin requests.

**Recommended fix:** Fail startup in production when the allowed-origin list is empty; use exact origins only; set `credentials` according to the selected authentication mechanism; and add CORS integration tests.

### AUD-012: No HTTPS enforcement or explicit production security policy

**Severity:** Medium  
**Category:** Transport security / headers  
**Affected files:** [backend/server.js](backend/server.js), [vercel.json](vercel.json)

**Impact:** The Express app does not redirect or reject plain HTTP and disables Helmet CSP. HSTS is not meaningful unless the deployment is guaranteed HTTPS, and there is no documented proxy/TLS policy. Admin tokens and registration data can be exposed on an incorrectly terminated connection.

**Recommended fix:** Terminate TLS at a trusted edge, enforce HTTPS using trusted proxy configuration, enable a tested CSP, set explicit HSTS only on HTTPS deployments, and document the production proxy boundary.

### AUD-013: Excel-compatible export remains vulnerable to formula injection

**Severity:** Medium  
**Category:** Output encoding / data exfiltration  
**Affected files:** [backend/src/utils/exportWorkbook.js](backend/src/utils/exportWorkbook.js), [backend/src/controllers/adminController.js](backend/src/controllers/adminController.js)

**Impact:** HTML escaping prevents HTML markup but does not prevent spreadsheet formulas when exported cells begin with `=`, `+`, `-`, or `@`. Admin-edited names or fields could execute a formula when opened in a spreadsheet application.

**Recommended fix:** Prefix dangerous cell values with an apostrophe, use a real XLSX writer with explicit string cell types, and add export tests for formula payloads.

### AUD-014: Registration writes are replayable and have a partial external side effect

**Severity:** Medium  
**Category:** Business logic / reliability  
**Affected files:** [backend/src/controllers/registrationController.js](backend/src/controllers/registrationController.js), [backend/src/utils/cloudinary.js](backend/src/utils/cloudinary.js)

**Impact:** The two-hour invitation JWT is a bearer credential with no nonce or one-time-use record. Replays are currently useful for rejected-payment resubmission, but duplicate rapid requests can race around reads and external Cloudinary uploads. Cloudinary `fetch` calls have no timeout or cancellation, so stalled provider requests hold server resources.

**Recommended fix:** Add an idempotency key and persisted submission state, use conditional updates/versioning, make the intended rejected-resubmission policy explicit, and add `AbortSignal.timeout()` plus provider retry/backoff and cleanup reconciliation.

### AUD-015: Team/member identity and case normalization are incomplete

**Severity:** Medium  
**Category:** Data integrity  
**Affected files:** [backend/src/controllers/registrationController.js](backend/src/controllers/registrationController.js), [backend/src/models/Team.js](backend/src/models/Team.js)

**Impact:** Public registration checks the leader against existing teams but does not reject duplicate member emails/phones or a member duplicating the leader. Team names are unique but not lowercased or otherwise canonicalized, so case variants bypass the intended uniqueness rule.

**Recommended fix:** Normalize with a defined locale-independent policy, add duplicate identity checks across all participants, and choose case-insensitive unique indexes or canonical fields for team names.

### AUD-016: Admin panel displays payment proof URLs as original external assets

**Severity:** Low  
**Category:** Privacy / asset access control  
**Affected files:** [backend/src/controllers/adminController.js](backend/src/controllers/adminController.js), [backend/admin-panel/js/app.js](backend/admin-panel/js/app.js)

**Impact:** Export and team detail responses expose Cloudinary URLs to every accepted admin role. If those URLs are public, anyone receiving an export can view payment screenshots outside the panel. The comment says proofs are administrator-readable, but no signed/private delivery policy is enforced.

**Recommended fix:** Use private Cloudinary delivery or short-lived signed URLs generated only for authorized viewers; avoid including proof URLs in bulk exports unless explicitly requested.

### AUD-017: Admin/API contract and documentation contain dead or stale behavior

**Severity:** Low  
**Category:** Maintainability / correctness  
**Affected files:** [backend/src/controllers/adminController.js](backend/src/controllers/adminController.js), [backend/src/routes/adminRoutes.js](backend/src/routes/adminRoutes.js), [backend/README.md](backend/README.md), [backend/admin-panel/index.html](backend/admin-panel/index.html), [README.md](README.md)

**Impact:** `resendConfirmation` is imported/described but has no route or implementation path, and the backend README says confirmation email is sent although the current README also says no email service exists. The root README describes a static-only site and omits the now-present backend. This makes operations and QA acceptance criteria unreliable.

**Recommended fix:** Remove dead references or implement the feature, update both READMEs and API documentation from the route table, and add an OpenAPI contract tested against the running app.

### AUD-018: Frontend production bundle is too large and routes are mostly eager-loaded

**Severity:** Medium  
**Category:** Performance / scalability  
**Affected files:** [frontend/src/routes/AppRoutes.jsx](frontend/src/routes/AppRoutes.jsx), [frontend/vite.config.js](frontend/vite.config.js)

**Evidence:** `npm run build` succeeded but produced approximately 1.71 MB, 1.99 MB, and 2.06 MB minified chunks, with gzip sizes around 502 KB, 723 KB, and 586 KB. Vite warned about chunks over 500 KB. All route pages are imported eagerly, and several pages load Three.js/Spline/canvas effects.

**Impact:** Slow first load, high mobile CPU/memory use, poor low-bandwidth experience, and increased failure risk for the registration flow.

**Recommended fix:** Lazy-load route pages and heavy visual components, split Three/Spline/vendor chunks, use responsive media and `prefers-reduced-motion`, measure Core Web Vitals on mobile, and keep the registration route free of unrelated 3D dependencies.

### AUD-019: Backend has no CI test, dependency audit, or isolated integration environment

**Severity:** Medium  
**Category:** QA / DevOps / production readiness  
**Affected files:** [.github/workflows/ci.yml](.github/workflows/ci.yml), [backend/package.json](backend/package.json)

**Impact:** CI installs, lints, and builds only the frontend. Backend controllers, auth, schema constraints, rate limits, export encoding, Cloudinary validation, and deployment behavior can regress without detection. `npm audit` could not be completed in this environment because the npm security endpoint is blocked, so dependency risk remains unverified.

**Recommended fix:** Add backend lint/test scripts, Supertest integration tests with an isolated MongoDB replica set or test container, contract tests for every endpoint and role, secret scanning, `npm audit`/Dependabot in network-enabled CI, and deployment smoke tests.

### AUD-020: Startup and operational resilience are weak

**Severity:** Low  
**Category:** Reliability / observability  
**Affected files:** [backend/server.js](backend/server.js), [backend/src/config/db.js](backend/src/config/db.js), [backend/src/utils/cloudinary.js](backend/src/utils/cloudinary.js)

**Impact:** The app calls `connectDB()` without awaiting readiness before listening, exits the process from the connection helper, has no graceful shutdown, no readiness/liveness distinction, no request correlation IDs, and no timeout around external uploads. Requests arriving during startup can fail unpredictably and provider stalls can exhaust workers.

**Recommended fix:** Await database readiness before listening, implement SIGTERM shutdown and readiness endpoints, configure MongoDB/server timeouts, add structured logs and correlation IDs, and bound all external requests.

## Test and Review Matrix

| Area | Result | Notes |
|---|---|---|
| Frontend syntax/lint | Pass | `npm run lint` completed with no output/errors. |
| Frontend production build | Pass with warning | Build completed; multiple chunks exceed 500 KB. |
| Backend JavaScript parse | Pass | `node --check` passed for every backend `.js` file. |
| Backend unit/integration tests | Not available | No backend test script or test files were found. |
| Live API CRUD and auth tests | Not safely executable | No isolated test database/provider fixture was supplied; the local environment contains external credentials. |
| Browser interaction matrix | Partial static review | Route and form handlers were inspected; browser automation against a safe deployed/test instance was not available. |
| Dependency vulnerability audit | Blocked | npm audit endpoint returned HTTP 403 due to the environment network allowlist. |
| Secret exposure scan | Fail | Local ignored `backend/.env` contains sensitive values; rotate immediately. |

The following should be run in an isolated staging environment before release: every public and admin endpoint with valid/invalid JSON types, missing fields, Unicode/HTML/script strings, oversized base64 images, malformed JWTs, expired tokens, role permutations, duplicate submissions, concurrent review/submission requests, pagination extremes, regex search payloads, CORS origins, HTTP/HTTPS behavior, offline/slow-network browser flows, refresh during submission, multiple tabs, and export formula payloads.

## Scores

Scores reflect the repository as audited, not the quality of the visual demo alone.

- **Overall project:** 4.0/10
- **Security:** 3.0/10
- **Performance:** 3.5/10
- **Code quality:** 6.0/10
- **Architecture:** 4.5/10
- **Maintainability:** 5.0/10
- **Production readiness:** 2.5/10

## Top Priority Fixes

1. Rotate all secrets found in `backend/.env` and establish secret management/scanning.
2. Repair the production deployment architecture so `/api/v1/*` reaches the backend, then add a deployment smoke test.
3. Enforce route-level roles; restrict payment review, edits, shortlist import, and export to the intended role.
4. Replace public team-code status lookup with an authenticated or high-entropy, two-factor status flow.
5. Centralize validation for public and admin writes and make payment review transactional/idempotent.
6. Add backend tests and CI coverage before changing workflow behavior.
7. Code-split the frontend and remove heavy visual dependencies from the registration critical path.

## Quick Wins

- Fail production startup when `JWT_SECRET`, `FRONTEND_URL`, Cloudinary settings, or admin credentials are missing/placeholder values.
- Cap and escape admin search, page, batch label, and all user-controlled text lengths.
- Return generic production errors with a correlation ID.
- Add `rel="noopener noreferrer"` consistently to external links and a tested CSP.
- Prefix spreadsheet-dangerous values or switch to typed XLSX output.
- Add unique `Registration.teamId` indexing and indexes for common admin filters.
- Update stale README/admin copy and remove the unused confirmation-email surface.

## Long-Term Recommendations

Adopt a versioned API contract, typed request DTOs, centralized authorization policies, audit logging for all admin actions, private payment-proof delivery, a queue for external image processing, observability with metrics/traces, staged migrations and backups, MongoDB replica-set testing, load tests for search/status/submission, automated browser tests for registration and admin workflows, and a documented disaster-recovery/credential-rotation procedure.
