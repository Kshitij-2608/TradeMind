# Data Flow Documentation

This document outlines the data flow for each key page in the TradeMind application, detailing how user actions interact with frontend components, backend APIs, databases, and external services.

## 1. Authentication

### Signup (`/signup`)
*   **User Action**: User fills out the signup form (First Name, Last Name, Email, Password) and clicks "Sign Up".
*   **Frontend**: `src/app/(auth)/signup/page.tsx` captures input state.
*   **API Call**: `POST /api/auth/signup`
    *   **Payload**: `{ firstName, lastName, email, password }`
*   **Backend**: `src/app/api/auth/signup/route.ts`
    *   Checks if user exists in **Neon Database (PostgreSQL)** via **Prisma**.
    *   Hashes password using `crypto`.
    *   Creates new `User` record in database.
*   **Response**: Returns success message or error.
*   **Post-Action**: Frontend automatically triggers `signIn` (NextAuth) to log the user in and redirects to `/dashboard`.

### Login (`/login`)
*   **User Action**: User enters credentials and clicks "Sign In".
*   **Frontend**: `src/app/(auth)/login/page.tsx` calls `signIn('credentials', ...)` from `next-auth/react`.
*   **Backend**: `src/lib/auth.ts` (NextAuth Configuration)
    *   `authorize` function is called.
    *   Fetches user from **Neon Database** via **Prisma**.
    *   Verifies password hash.
*   **Session**: On success, a session token is issued (JWT).

## 2. Dashboard (`/dashboard`)

### Data Upload & Management
*   **User Action**: User uploads a CSV/Excel file or clicks "Generate Data".
*   **Frontend**: `src/components/dashboard/DataUpload.tsx`
    *   Parses file using `FileReader` (CSV) or `xlsx` (Excel).
    *   **Local State**: Updates `data` state in `DashboardPage`.
    *   **Persistence**: Saves data to `localStorage` ('shipmentData') for persistence across reloads.
*   **Save to Cloud**: User clicks "Save to Cloud".
    *   **API Call**: `POST /api/datasets/create`
    *   **Backend**: Saves dataset metadata and all records to **Neon Database** (Dataset & ShipmentRecord tables).

### Load Saved Dataset
*   **User Action**: User selects a dataset from the dropdown and clicks "Load".
*   **API Call**: `GET /api/datasets/[id]`
*   **Backend**: Fetches dataset and associated records from **Neon Database**.
*   **Frontend**: Updates `data` state and `localStorage`.

### Analytics & Charts
*   **Data Source**: Uses the currently loaded `data` (from file, generation, or cloud).
*   **Frontend**: `src/components/dashboard/ChartsGrid.tsx`
    *   Processes raw data locally (aggregating by port, country, product).
    *   Renders charts using `recharts` and `react-plotly.js`.

### AI Chart Generator
*   **User Action**: User types a query (e.g., "Show me top 5 ports by value") and clicks "Generate".
*   **Frontend**: `src/components/dashboard/AIChartGenerator.tsx`
*   **API Call**: `POST /api/generate-chart`
    *   **Payload**: `{ description, data (sample) }`
*   **Backend**:
    *   Constructs a prompt with data schema and user query.
    *   Calls **Google Gemini API**.
    *   Receives a JSON configuration for the chart.
*   **Frontend**: Renders the chart using the returned configuration.

### AI Report Generation
*   **User Action**: User selects a focus area and clicks "Generate Report".
*   **Frontend**: `src/components/dashboard/ReportGenerator.tsx`
*   **API Call**: `POST /api/generate-report`
    *   **Payload**: `{ focus, data (sample) }`
*   **Backend**:
    *   Calls **Google Gemini API** to analyze the data sample.
    *   Generates a Markdown-formatted report.
*   **Frontend**: Displays the report using `react-markdown`.

## 3. Saved Databases (`/dashboard/saved-databases`)

*   **Page Load**:
    *   **API Call**: `GET /api/datasets`
    *   **Backend**: Fetches list of datasets (ID, name, date, count) from **Neon Database** for the logged-in user.
*   **Delete Dataset**:
    *   **User Action**: Click trash icon.
    *   **API Call**: `DELETE /api/datasets/[id]`
    *   **Backend**: Deletes record from **Neon Database**.

## 4. Sustainability (`/dashboard/sustainability`)

*   **Data Source**: Uses currently loaded data from `localStorage` / `loadShipmentData`.
*   **Metrics Calculation**:
    *   **Frontend**: `src/lib/sustainability-utils.ts` calculates emissions, green score, and savings locally based on shipment mode and distance (simulated).
*   **AI Recommendations**:
    *   **User Action**: Click "Eco-Suggestions".
    *   **API Call**: `POST /api/generate-sustainability-tips`
    *   **Backend**: Sends calculated metrics to **Google Gemini API** to get personalized reduction tips.

## 5. HS Code Classifier (`/dashboard/classification`)

*   **User Action**: User enters a product description.
*   **API Call**: `POST /api/classify-hs`
*   **Backend**:
    *   Calls **Google Gemini API** with the product description.
    *   Asks AI to identify HS Code, Duty Rate, and Compliance Notes.
*   **Frontend**: Displays the AI-generated classification result.

## 6. Trade Simulator (`/dashboard/simulator`)

*   **Data Source**: Uses currently loaded data.
*   **Simulation**:
    *   **User Action**: Adjusts sliders (Duty Rate, Freight Cost, Demand).
    *   **Frontend**: `src/app/dashboard/simulator/page.tsx` recalculates profit margins and costs locally in real-time.
*   **AI Scenario Analysis**:
    *   **User Action**: Click "Analyze Scenario".
    *   **API Call**: `POST /api/simulate-scenario` (if implemented) or handled locally via Gemini for qualitative analysis.

## 7. Global Opportunities (`/dashboard/opportunities`)

*   **Data Source**: Uses currently loaded data to identify top products.
*   **Market Discovery**:
    *   **Page Load/Action**: Triggers analysis for top products.
    *   **API Call**: `POST /api/generate-opportunities`
    *   **Backend**:
        *   Calls **Google Gemini API** to find best export markets for the specific products.
        *   Returns market data (CAGR, Price Premium, Competition).
