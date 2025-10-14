# Weather Dashboard

This project is a full-stack weather analytics dashboard with a React (Vite) frontend and an Express.js backend.

## [Live Project Link](https://visual-kohl.vercel.app/)

## [Find API Docs](https://weather-backend-cu47.onrender.com/api-docs)

## [Get Prometheus Metrics Data](https://weather-backend-cu47.onrender.com/metrics)

## Getting Started

### 1. Clone the Repository

```sh
git clone https://github.com/Adityasinghvats/weather-dashboard.git
cd weather-dashboard
```

---

## Backend Setup

1. Navigate to the backend folder:
   ```sh
   cd backend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Create a `.env` file in the `backend` directory (see `.env.example` if available) and add your environment variables:
   ```env
   MONGO_URI=your_mongodb_connection_string
   PORT=3000
   CORS_ORIGIN=http://localhost:5173
   NODE_ENV=development
   ```
4. Start the backend server:
   ```sh
   npm start
   ```
   The backend will run on [http://localhost:3000](http://localhost:3000).

---

## Frontend Setup

1. Open a new terminal and navigate to the frontend folder:
   ```sh
   cd frontend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the frontend development server:
   ```sh
   npm run dev
   ```
   The frontend will run on [http://localhost:5173](http://localhost:5173).

---

## Usage

1. Make sure both backend and frontend servers are running.
2. Open [http://localhost:5173](http://localhost:5173) in your browser to use the dashboard.

---

## Run the app locally using Docker

1. Simply go the root folder where `compose.yaml` file is located and run the command.

```bash
docker compose --env-file backend/.env up --build -d
```

2. Your app will be running at `http://localhost/5173`.

## Project Structure

```
weather-dashboard/
  backend/    # Express.js backend
  frontend/   # React (Vite) frontend
```

3. Setup monitoring and onbervalbility using Prometheus and Grafana

- Visualize using Grafana
  - Grafana will be available at `http://localhost/3001`
  - Now to add prometheus as the data source go to `Connections/DataSources/`
  - Choose prometheus and add URL `http://prometheus:9090`.
  - Test the connection after adding the URL.
  - Now you can create the dashboard using the queries
    - up{job="pribex-be"}
    - process_resident_memory_bytes
    - process_cpu_user_seconds_total
    - nodejs_eventloop_lag_seconds

---

## UI State Handling

The dashboard UI provides clear feedback for different data states:

- **Loading State:**
  - While data is being fetched, a centered spinner animation and a loading message are displayed to inform the user that data is loading.
- **Error State:**
  - If an error occurs during data fetching, a user-friendly error message is shown.
- **Empty State:**
  - If no data is available, the summary and table sections display 'N/A' or remain empty, ensuring the UI does not break and users are aware that no data is present.

These states ensure a smooth and informative user experience, even when network or backend issues occur.

For performance and user experience testing, the following methods were used:

- **Browser-based Network Throttling:**

  - Used Chrome DevTools to simulate slow 3G/4G networks and test the dashboard's responsiveness and loading times under constrained conditions.

- **Lighthouse Audits:**
  - Ran Google Lighthouse to check for page performance, accessibility, best practices, and SEO. The dashboard achieved high scores, reflecting fast load times and good user experience.

These results are possible due to the use of React server components and the highly optimized Vite bundler, which ensures efficient code splitting and minimal bundle sizes.

---

- All API ednpoints can found here `backend/routers/data.router.js`.
- All controllers can found here `backend/controllers/data.controller.js`.
- Error response configurations and request and response validation can be found

  - `backend/controllers/data.controller.js` - logic to validate malformed data.
  - `backend/models/data.model.js` - MongoDB schema makes sure to validate the request and response data.
  - `backend/utils/ApiError.js` - Custom error class for consistent error handling and HTTP status codes throughout the backend.
  - `backend/utils/ApiResponse.js` - Standardizes API responses with a common structure for status, data, message, and success flag.
  - `backend/utils/AsyncHandler.js` - Utility to wrap async route handlers and forward errors to Express error middleware, reducing repetitive try/catch blocks.

- Aggregated Data for summary is being generated using the following code in `backend/controllers/data.controller.js`.

```javascript
const getSummaryData = async (req, res) => {
  try {
    const [result] = await Data.aggregate([
      // Cast string fields to numbers, stripping potential unit suffixes
      {
        $addFields: {
          temperatureNum: {
            $toDouble: {
              $replaceAll: {
                input: {
                  $replaceAll: {
                    input: { $ifNull: ["$temperature", "0"] },
                    find: "°C",
                    replacement: "",
                  },
                },
                find: " ",
                replacement: "",
              },
            },
          },
          humidityNum: {
            $toDouble: {
              $replaceAll: {
                input: {
                  $replaceAll: {
                    input: { $ifNull: ["$humidity", "0"] },
                    find: "%",
                    replacement: "",
                  },
                },
                find: " ",
                replacement: "",
              },
            },
          },
          rainfallNum: {
            $toDouble: {
              $replaceAll: {
                input: {
                  $replaceAll: {
                    input: { $ifNull: ["$rainfall", "0"] },
                    find: "mm",
                    replacement: "",
                  },
                },
                find: " ",
                replacement: "",
              },
            },
          },
        },
      },
      {
        $group: {
          _id: null,
          averageTemperature: { $avg: "$temperatureNum" },
          averageHumidity: { $avg: "$humidityNum" },
          averageRainfall: { $avg: "$rainfallNum" },
        },
      },
      {
        $project: {
          _id: 0,
          averageTemperature: { $round: ["$averageTemperature", 2] },
          averageHumidity: { $round: ["$averageHumidity", 2] },
          averageRainfall: { $round: ["$averageRainfall", 2] },
        },
      },
    ]);

    const summaryData = result || {
      averageTemperature: 0,
      averageHumidity: 0,
      averageRainfall: 0,
    };

    res
      .status(200)
      .json(
        new ApiResponse(200, summaryData, "Summary data fetched successfully")
      );
  } catch (error) {
    console.error("Error fetching summary data:", error);
    res
      .status(500)
      .json(new ApiResponse(500, [], "Failed to fetch summary data"));
  }
};
```

- All the data sent and received is in the `JSON` format.

- Frontend components for the Chart and Table are from `MUI` component library and can be found here.

  - `frontend/src/components`

- For making API calls the frontend used native `fetch` apis for data fetching using error logic and fallback protection. Related code files are available here.
  - `frontend/src/services/api.ts` && `frontend/src/services/usefetch.ts`
  - All the data from api endpoints is validated and transformed using Typescript interfaces and validation.

---

## API DOCS

- Can be tested using Postman or Hoppscotch, resposne might be delayed in first try, as the backend is serverless.
- Simply run the app and go to the url `http://localhost:3000/api-docs`.

### 1. Get Visualization Data

**Endpoint:** `GET https://weather-backend-cu47.onrender.com/api/v1/visualize`

**Description:**
Returns an array of all weather data records for visualization.

**Response:**

```
Status: 200 OK
{
	"statusCode": 200,
	"data": [
		{
			"_id": "650f1c...",
			"year": "2020",
			"temperature": "25.5",
			"humidity": "80",
			"rainfall": "120.5",
			"createdAt": "2023-09-24T12:34:56.789Z",
			"updatedAt": "2023-09-24T12:34:56.789Z",
			"__v": 0
		},
		// ...more records
	],
	"message": "Visualization data fetched successfully",
	"success": true
}
```

---

### 2. Get Summary Data

**Endpoint:** `GET https://weather-backend-cu47.onrender.com/api/v1/summary`

**Description:**
Returns average temperature, humidity, and rainfall across all records.

**Response:**

```
Status: 200 OK
{
	"statusCode": 200,
	"data": {
		"averageTemperature": 25.5,
		"averageHumidity": 80.0,
		"averageRainfall": 120.5
	},
	"message": "Summary data fetched successfully",
	"success": true
}
```

---

### 3. Add Weather Data

**Endpoint:** `POST https://weather-backend-cu47.onrender.com/api/v1/`

**Description:**
Add a new weather data record.

**Request Body:**

```
{
	"year": "2021",
	"temperature": "26.1",
	"humidity": "78",
	"rainfall": "110.2"
}
```

**Response:**

```
Status: 201 Created
{
	"statusCode": 201,
	"data": {
		"_id": "650f1c...",
		"year": "2021",
		"temperature": "26.1",
		"humidity": "78",
		"rainfall": "110.2",
		"createdAt": "2023-09-24T12:34:56.789Z",
		"updatedAt": "2023-09-24T12:34:56.789Z",
		"__v": 0
	},
	"message": "Data added successfully",
	"success": true
}
```

**Error Response (missing fields):**

```
Status: 400 Bad Request
{
	"statusCode": 400,
	"data": null,
	"message": "All fields are required",
	"success": false
}
```
