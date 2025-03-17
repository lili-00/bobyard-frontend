## Tech Stack

- **Framework:** React.js
- **Language:** TypeScript
- **Bundler:** Vite
- **Styling:** Tailwind CSS
- **HTTP Client:** Axios

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn

### Installation

1. Install dependencies
   ```bash
   npm install
   # or
   yarn
   ```

2. Set up environment variables
   ```bash
   # Make sure you have the .env file in the root directory
   # with the VITE_API_URL variable set
   ```

3. Start the development server
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

## API Integration

The frontend uses a proxy configuration to avoid CORS issues. The Vite development server will proxy all requests from `/api/*` to your backend server.

### Environment Configuration

The application uses an environment variable for the backend API URL:

| Variable       | Description                           | Default                |
|----------------|---------------------------------------|------------------------|
| VITE_API_URL   | URL of the backend API server         | http://localhost:8000  |

You can configure this in the `.env` file at the root of the project:

```
# .env
VITE_API_URL=http://localhost:8000
```

The Vite configuration in `vite.config.ts` uses this environment variable to set up the API proxy.
