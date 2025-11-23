# Social Support Application Wizard (with AI Assistance)

This is a front-end case study project: a 3-step application wizard for a government social support portal.

The app lets citizens:

- Enter **personal**, **family**, and **financial** information
- Describe their **situation** in their own words
- Use an **AI assistant (“Help Me Write”)** to generate clear, respectful text for the descriptive fields

Everything runs in the browser. The AI assistance uses the OpenAI Chat Completions API (`gpt-3.5-turbo`).

---

## 1. Quick start

If you just want to run and click around:

```bash
# Clone the repo
git clone https://github.com/muhammadshiraz/social-support-app.git social-support-app
cd social-support-app

# Install dependencies
npm install

# Create .env and add your OpenAI key (see below)
cp .env.example .env
# then edit .env and set VITE_OPENAI_API_KEY

# Start dev server
npm run dev
````

Open the URL shown in the terminal (usually `http://localhost:5173`).

You should see:

* The app title in the header
* An English/Arabic language toggle
* Step 1 (Personal Information) with the stepper and progress bar

If you don’t provide an OpenAI key, the app will still load, but the “Help Me Write” buttons will show a friendly error when used.

---

## 2. Environment variables

The app uses one environment variable for AI:

```bash
VITE_OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxx
```

### Recommended workflow

1. Copy the example file:

   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and set your OpenAI key.

3. Restart `npm run dev` after updating `.env`.

If `VITE_OPENAI_API_KEY` is missing or invalid, AI calls will fail gracefully with a clear error message in the dialog.

---

## 3. Tech stack

* **React** (Vite, TypeScript)
* **Material UI (MUI)** – layout, inputs, theme
* **React Hook Form** – form state and validation
* **Context API** – multi-step form state + local storage
* **React-i18next + i18next** – English/Arabic, RTL
* **OpenAI Chat Completions API** – GPT-3.5-turbo for “Help Me Write”

There is **no backend** in this case study; the final submission is mocked on the client.

---

## 4. Project structure

```text
src/
  api/
    openaiClient.ts            # OpenAI client with timeout + error handling
  components/
    ai/
      AiAssistButton.tsx       # “Help Me Write” button + AI call
      AiSuggestionDialog.tsx   # Modal dialog (suggestion, loading, errors)
    layout/
      Layout.tsx               # Header, container, language switcher
      LanguageSwitcher.tsx     # EN/AR toggle, sets lang + dir
      ErrorBoundary.tsx        # Global error boundary
    steps/
      Step1PersonalInformation.tsx
      Step2FamilyFinancialInformation.tsx
      Step3SituationDescriptions.tsx
    ProgressStepper.tsx        # MUI Stepper + linear progress bar
  context/
    ApplicationFormContext.tsx # Shared form data + current step + localStorage
  hooks/
    useLocalStorage.ts         # Reusable localStorage hook
  locales/
    en/translation.json        # English strings
    ar/translation.json        # Arabic strings (RTL)
  types/
    application.ts             # Strongly typed form models
  i18n.ts                      # i18next / react-i18next setup
  App.tsx                      # Wizard orchestration + mock submission
  main.tsx                     # Providers (Theme, i18n, Context, ErrorBoundary)
  styles.css                   # Minimal global styling
```

---

## 5. Form flow (case study mapping)

### Step 1 – Personal Information

Fields:

* Name
* National ID
* Date of Birth
* Gender
* Address
* City
* State
* Country
* Phone
* Email

Notes:

* All fields required.
* Email has pattern validation.
* This step **does not** use AI assistance (as per case study).

### Step 2 – Family & Financial Information

Fields:

* Marital Status
* Number of Dependents
* Employment Status
* Monthly Income
* Housing Status

Notes:

* `dependents` and `monthlyIncome` are numeric.
* Values are parsed to numbers in the submit handler.
* This step also does **not** use AI assistance.

### Step 3 – Situation Descriptions (with AI)

Fields:

* Current Financial Situation
* Employment Circumstances
* Reason for Applying

Each of these has a **“Help Me Write”** button. Clicking it:

1. Calls OpenAI’s Chat Completions API with:

   * The field label
   * Any text the user already typed
   * Constraints for tone and length
2. Opens a dialog with:

   * A loading state while the AI responds
   * An editable textarea containing the suggestion
   * Error messaging if the request fails

User can then:

* **Accept** → Apply suggestion to the field and close dialog
* **Accept & Edit** → Apply suggestion and then fine-tune in the main textarea
* **Discard** → Close dialog without changing the field

### Progress bar and navigation

* MUI `Stepper` at the top shows step labels and current step.
* A linear progress bar below shows overall completion percentage.
* Buttons:

  * Step 1: `Next`
  * Step 2: `Back` / `Next`
  * Step 3: `Back` / `Submit Application`

---

## 6. Data & state management

### Form state

* The entire application data lives in `ApplicationFormContext`.
* It stores:

  * `personal` (Step 1)
  * `familyFinancial` (Step 2)
  * `situations` (Step 3)
  * Current `step` (1–3)

Each step:

* Uses `react-hook-form` for its own sub-form.
* On submit, merges its values into the global context.

### Local storage

Progress is saved in `localStorage` under a single key, e.g. `socialSupportApp`.

On load:

* The app reads previous data (if present).
* The user’s step and form values are restored.

On change:

* Whenever context data or step changes, it’s written back to `localStorage`.

A user can close the tab, come back later, and continue where they left off.

---

## 7. AI integration (OpenAI)

The OpenAI logic lives in `src/api/openaiClient.ts`.

### Endpoint / model

* URL: `https://api.openai.com/v1/chat/completions`
* Model: `gpt-3.5-turbo`

### Request behavior

`generateAiText` builds a prompt that:

* Explains we’re filling a **social support application**
* Names the field (e.g. “Current Financial Situation”)
* Includes rough notes from the user (if any)
* Sets constraints:

  * Neutral, formal tone
  * No exaggeration
  * Don’t invent facts
  * 3–6 sentences

### Error handling

The client:

* Uses an `AbortController` with a 15s timeout.
* Wraps errors in a small `AiError` class with:

  * `code` (e.g. `MISSING_API_KEY`, `TIMEOUT`, `RATE_LIMIT`, `SERVER_ERROR`, `EMPTY_RESPONSE`)
  * Optional `status` (HTTP status code)

Handled cases:

* Missing/undefined `VITE_OPENAI_API_KEY`
* Timeout
* 401 (bad API key)
* 429 (rate limited)
* 5xx (server errors)
* Empty or malformed responses
* Anything unexpected falls back to a generic, human-readable error

The UI shows these errors inside the dialog using a Material-UI `Alert`.

---

## 8. Accessibility

Accessibility is built into the UI in a few ways:

* MUI components provide keyboard and screen reader support by default.
* Form fields use `TextField` with labels, and Step 3 labels are associated via `htmlFor`.
* The progress bar uses:

  * `role="progressbar"`
  * `aria-valuenow`, `aria-valuemin`, `aria-valuemax`
* The AI dialog uses `aria-labelledby` connecting `<DialogTitle>` and `<Dialog>`.

This isn’t a full WCAG audit, but the core patterns are in place and can be extended.

---

## 9. Internationalization & RTL

Internationalization is set up with `react-i18next` and `i18next`.

* English strings: `src/locales/en/translation.json`
* Arabic strings: `src/locales/ar/translation.json`

The `LanguageSwitcher`:

* Changes `i18n.language`
* Updates:

  * `document.documentElement.lang`
  * `document.documentElement.dir`

    * `ltr` for English
    * `rtl` for Arabic

All visible text goes through `t('...')` (labels, buttons, errors, AI messages), so adding another language is just a matter of creating another translation file and wiring it into `i18n.ts`.

---

## 10. Mock submission

The final submit on Step 3 is intentionally mocked:

* In `App.tsx`, `handleMockSubmit`:

  * Waits a bit (`setTimeout`) to simulate network latency
  * Shows a success `Snackbar` on completion
  * Resets the context state and localStorage
* In case of errors (simulated or real), it:

  * Logs the error
  * Shows an error `Snackbar` with a human-readable message

In a real system, this function would call a backend endpoint instead.

---

## 11. Error boundaries and robustness

### Error boundary

The entire app is wrapped in `ErrorBoundary`:

* If a React component throws during render, it:

  * Logs the error to the console
  * Shows a simple fallback with a message and **Reload** button

This is intended as a safety net, not a replacement for good runtime checks.

### Validation

* All required fields are validated with React Hook Form.
* Email uses a simple pattern check.
* Numeric fields validate that the value is a number and non-negative.
* Validation messages are localized (EN/AR).

---

## 12. Testing (optional but supported)

Tests are not mandatory for the case study, but the code is structured so you can add them easily with Jest + React Testing Library.

Examples of useful tests:

* Step 1:

  * Required fields prevent moving to Step 2
  * Email validation
* Step 3:

  * AI dialog opens and shows loading state
  * Handles AI success and error states
* Full flow:

  * Step 1 → Step 2 → Step 3 → submit → success snackbar
* LocalStorage:

  * Fill a step, reload, confirm values are restored

---

## 13. Deployment notes

To create a production build:

```bash
npm run build
npm run preview
```

You can then deploy the `dist` folder to any static host (Vercel, Netlify, S3, or behind a government gateway).

### Important for real deployments

For an actual government system, the OpenAI calls **should not** go directly from the browser:

* Move `openaiClient` logic to a backend service (Node, .NET, etc.).
* The frontend then calls your backend (e.g. `/api/ai/suggest`) instead of `api.openai.com` directly.
* The backend stores the API key, applies rate limiting, logging, and any data handling policies.

The UI flow stays the same; only the endpoint changes.

---

## 14. Summary

If you’ve cloned this repo and run `npm install` + `npm run dev`, you can:

* Walk through a fully working 3-step application wizard
* Switch between English and Arabic (including RTL layout)
* See form validation in action
* Use “Help Me Write” to generate text via OpenAI (with your API key)
* Watch how the app handles errors, persists state, and shows progress

Everything here is focused on the front-end behavior and architecture described in the case study.