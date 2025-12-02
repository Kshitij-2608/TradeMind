# 🚀 TradeMind: AI-Powered Import/Export Analyzer

TradeMind is a comprehensive dashboard designed to revolutionize how businesses analyze global trade data. By leveraging advanced AI and modern web technologies, it provides actionable insights, automates document processing, and identifies new market opportunities.

---

## ✨ Technology Stack

This project is built using a cutting-edge stack to ensure performance, scalability, and a premium user experience.

### 🎯 Core Framework & Language
- **Next.js 15 (App Router)**: The backbone of the application, providing server-side rendering and efficient routing.
- **TypeScript 5**: Ensures type safety and code reliability across the entire codebase.
- **React 18**: The library for building dynamic and interactive user interfaces.

### 🎨 UI & Styling
- **Tailwind CSS 4**: A utility-first CSS framework for rapid and responsive styling.
- **shadcn/ui**: A collection of re-usable components built using Radix UI and Tailwind CSS.
- **Framer Motion**: Powers the smooth animations and micro-interactions seen throughout the app.
- **Lucide React**: Provides the clean and consistent icon set.
- **Next Themes**: Manages the seamless dark/light mode switching.

### 🤖 Artificial Intelligence
- **Google Gemini Flash**: The core AI engine used for:
    - **Document Digitization**: Extracting structured data from images (OCR).
    - **Market Analysis**: Generating global arbitrage opportunities.
    - **Sustainability Tips**: Providing eco-friendly shipping advice.
    - **HS Code Classification**: Automatically classifying products.

### 📊 Data Visualization & Management
- **Recharts**: Renders the interactive charts and graphs for data analysis.
- **TanStack Table**: Handles complex data tables with sorting and filtering.
- **Zustand**: Manages global application state (e.g., sidebar state).
- **React Hook Form + Zod**: Handles form inputs and validation.

### 🗄️ Backend & Database
- **Prisma ORM**: Interacts with the database in a type-safe manner.
- **NextAuth.js**: Manages secure user authentication.
- **Axios**: Handles HTTP requests to the backend APIs.

---

## 🛠️ Key Functions & Features

TradeMind offers a suite of powerful tools for trade analysts:

### 1. 📈 Interactive Dashboard
- **Overview**: Get a bird's-eye view of your trade performance.
- **Visualizations**: Dynamic charts showing imports by port, country, and product categories.
- **Recent Activity**: Track your latest shipments and document uploads.

### 2. 📄 Smart Document Digitization
- **AI-Powered OCR**: Upload invoices, Bills of Entry, or Shipping Bills (Images/PDFs).
- **Dynamic Extraction**: The system automatically detects the document type and extracts relevant fields (headers, line items, summaries) without needing a rigid template.
- **Confidence Scoring**: See exactly how confident the AI is in its extraction.

### 3. 🌍 Global Arbitrage Finder (Opportunities)
- **Market Discovery**: Automatically identifies the top 3 high-demand international markets for your most frequent products.
- **Strategic Insights**: Provides price premiums, demand drivers, and entry strategies for each recommended market.

### 4. 🔍 HS Code Classifier
- **Smart Classification**: Simply describe a product, and the AI will determine the correct Harmonized System (HS) code.
- **Compliance**: Helps ensure accurate documentation and duty calculations.

### 5. 🌱 Sustainability Analyzer
- **Carbon Footprint Estimation**: Analyzes your shipment data to estimate environmental impact.
- **Green Tips**: Generates actionable advice to reduce your logistics carbon footprint using AI.

### 6. 📊 Trade Simulator
- **Scenario Planning**: Simulate different trade scenarios (e.g., changing duties, shipping costs) to see their impact on your bottom line.

---

## 🚀 Getting Started

Follow these steps to set up the project locally:

### Prerequisites
- Node.js 18+ installed
- A Google Gemini API Key

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/trademind.git
    cd trademind
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up Environment Variables:**
    Create a `.env` file in the root directory and add your keys:
    ```env
    GOOGLE_API_KEY=your_gemini_api_key_here
    DATABASE_URL="file:./dev.db" # Or your actual database URL
    NEXTAUTH_SECRET=your_secret
    NEXTAUTH_URL=http://localhost:3000
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

5.  **Open the app:**
    Visit [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📦 Production Build

To build the application for production:

```bash
npm run build
npm start
```

This will create an optimized build and start the production server.

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
