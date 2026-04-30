# ScamGuard AI Prototype

An AI-powered scam detection tool built with Next.js (Frontend) and FastAPI (Backend).

## Features
- **Text Analysis:** Uses Gemini 1.5 Flash to identify deceptive intent, urgency, and common scam patterns in messages/emails.
- **Scam Risk Scoring:** Provides a percentage risk score and categorizes the type of scam.
- **Red Flag Callouts:** Explicitly lists reasons why a message is suspicious.
- **Safety Recommendations:** Actionable advice on what to do next.

## Tech Stack
- **Frontend:** Next.js 14, TypeScript, Tailwind CSS, shadcn/ui.
- **Backend:** FastAPI, Python, Google Generative AI (Gemini).

## Getting Started

### 1. Prerequisites
- Python 3.10+
- Node.js & pnpm
- Google AI Studio API Key (for Gemini)

### 2. Backend Setup
1. Navigate to the `api` directory:
   ```bash
   cd api
   ```
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Configure your API key in the `.env` file at the root:
   ```env
   GOOGLE_API_KEY=your_key_here
   ```
4. Start the FastAPI server from the root directory:
   ```bash
   export PYTHONPATH=$PYTHONPATH:.
   uvicorn api.main:app --reload
   ```

### 3. Frontend Setup
1. Navigate to the `web` directory:
   ```bash
   cd web
   ```
2. Install dependencies:
   ```bash
   pnpm install
   ```
3. Start the development server:
   ```bash
   pnpm dev
   ```

### 4. Usage
Open [http://localhost:3000](http://localhost:3000) in your browser. Paste a suspicious message into the analysis box and click "Check for Scams".

## Deployment to Google Cloud Run

This project is configured for easy deployment to Cloud Run.

### 1. Build and Deploy Backend
```bash
gcloud run deploy scam-guard-api \
  --source . \
  --command "sh,-c,uvicorn api.main:app --host 0.0.0.0 --port \${PORT:-8080}" \
  --set-env-vars GOOGLE_API_KEY=your_key_here \
  --allow-unauthenticated \
  --region us-central1
```

### 2. Build and Deploy Frontend
1. Get your Backend URL from the step above.
2. Deploy the frontend:
```bash
gcloud run deploy scam-guard-web \
  --source . \
  --command "node,server.js" \
  --set-env-vars NEXT_PUBLIC_API_URL=your_backend_url_here \
  --allow-unauthenticated \
  --region us-central1
```

Alternatively, you can use the provided `cloudbuild.yaml` for a consolidated CI/CD pipeline.
