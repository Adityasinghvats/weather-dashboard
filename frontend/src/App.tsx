import LineDataset from './components/chart'
import DataTable from './components/table';
import { fetchDataVisualize, fetchDataSummary } from './services/api'
import useFetch from './services/usefetch'

function parseData(data: { id: string; year: string; rainfall: string; temperature: string; humidity: string }[]) {
  return data.map(item => ({
    ...item,
    year: parseInt(item.year),
    rainfall: parseFloat(item.rainfall.replace('mm', '')),
    temperature: parseFloat(item.temperature.replace('°C', '')),
    humidity: parseFloat(item.humidity.replace('%', '')),
  }))
}

function App() {
  const { data, error, loading } = useFetch(() => fetchDataVisualize());
  const parsedData = parseData(data || []);
  const { data: summaryData } = useFetch(() => fetchDataSummary());

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <svg className="animate-spin h-12 w-12 text-blue-600 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
      </svg>
      <span className="text-lg text-gray-700 font-semibold">Loading data...</span>
    </div>
  )
  if (error) return <div>Error: {error.message}</div>

  return (
    <>
      <header className="w-full bg-gray-700 shadow p-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-100">Weather Data Dashboard</h1>
      </header>
      <div className="min-h-screen flex bg-gray-100">

        {/* Main Content */}
        <main className="flex-1 p-8">
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-2">Weather Analytics</h2>
            <p className="text-gray-500">Visualize and analyze weather data trends.</p>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-white p-4 rounded-lg shadow">
                <h4 className="text-md font-semibold text-gray-600">Avg Temperature</h4>
                <p className="text-2xl font-bold text-gray-800">{summaryData?.averageTemperature ?? 'N/A'} °C</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow">
                <h4 className="text-md font-semibold text-gray-600">Avg Humidity</h4>
                <p className="text-2xl font-bold text-gray-800">{summaryData?.averageHumidity ?? 'N/A'} %</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow">
                <h4 className="text-md font-semibold text-gray-600">Avg Rainfall</h4>
                <p className="text-2xl font-bold text-gray-800">{summaryData?.averageRainfall ?? 'N/A'} mm</p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <section className="bg-white rounded-xl shadow p-6">
              <h3 className="text-lg font-bold mb-4">Trends Over Years</h3>
              <LineDataset data={parsedData || []} />
            </section>
            <section className="bg-white rounded-xl shadow p-6">
              <h3 className="text-lg font-bold mb-4">Data Table</h3>
              <DataTable data={data || []} />
            </section>
          </div>
        </main>
      </div>
      <footer className="w-full bg-gray-800 text-center p-4 text-white">
        &copy; 2025 Weather Data Dashboard. All rights reserved.
      </footer>
    </>
  );
}

export default App
