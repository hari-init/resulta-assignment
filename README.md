# Result Assignment (ACME Sports) 🏆

[![Live Demo](https://img.shields.io/badge/Live_Demo-Visit_Site-blue)](https://frontend-abln.onrender.com)

## 🚀 Features Implemented

### 💻 Frontend
1. **React with Next.js** UI along with TypeScript
2. **Plain CSS modules** for styling
3. **Fully responsive UI** design for all device sizes
4. **Key Components**:
   - `Select` - Custom dropdown component for league selection and sorting options
   - `TeamTable` - Elegant table representation for team data display
   - `Shimmer` - Animated loading states for better user experience
5. **Real-time updates** via WebSocket implementation
6. **Performance optimizations**:
   - Pure components using React.memo
   - Cached references with useCallback and useMemo hooks
7. **Test coverage** with basic test cases for all components

### ⚙️ Backend
The backend architecture consists of two parts:

#### 📊 Mock Server
- Returns updated data every 30 seconds
- Mimics live scoreboard/stream behavior

#### 🔄 Main Backend
- Listens to the mock API
- Caches data for improved performance
- Serves data to the UI using WebSocket

## 🌐 Live URLs

- **Full Application**: [https://frontend-abln.onrender.com](https://frontend-abln.onrender.com)
- **Mock Server**: [https://mock-zu2m.onrender.com](https://mock-zu2m.onrender.com)
- **Backend Service**: [https://backend-6pbu.onrender.com](https://backend-6pbu.onrender.com)

## 🔧 Running Instructions

### ⚡ Quick Start (Frontend Only)
The frontend is configured to connect to hosted backend services:

```bash
cd frontend
npm install
npm run dev
```

### 🧩 Running All Services Locally

1. **Install dependencies** in each folder:
```bash
# Option 1: In the root directory with concurrently
npm install

# Option 2: Separately in each folder
cd frontend
npm install
cd ../backend
npm install
cd ../mock
npm install
```

2. **Start all services**:
```bash
# Using concurrently from the root directory
npm start
```

3. **Note**: Remember to update the backend connection URLs in the frontend if running locally

## 📝 Additional Notes
- For the best experience, we recommend using the live demo or running just the frontend locally as it's already configured to connect to the hosted services.
- The application updates in real-time to simulate a live sports result environment.
