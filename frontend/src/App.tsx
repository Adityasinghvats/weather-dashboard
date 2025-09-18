import './App.css'
import LineDataset from './components/chart'
import DataGridDemo from './components/table'

const data = [
  { id: 1, year: '2020', rainfall: '1200mm', temperature: '22°C', humidity: '60%' },
  { id: 2, year: '2021', rainfall: '1100mm', temperature: '23°C', humidity: '65%' },
  { id: 3, year: '2022', rainfall: '1300mm', temperature: '21°C', humidity: '70%' },
  { id: 4, year: '2023', rainfall: '1250mm', temperature: '22.5°C', humidity: '68%' },
  { id: 5, year: '2024', rainfall: '1150mm', temperature: '23.5°C', humidity: '66%' },
]

const parseData = (data: { id: number; year: string; rainfall: string; temperature: string; humidity: string }[]) => {
  return data.map(item => ({
    ...item,
    year: parseInt(item.year),
    rainfall: parseFloat(item.rainfall.replace('mm', '')),
    temperature: parseFloat(item.temperature.replace('°C', '')),
    humidity: parseFloat(item.humidity.replace('%', '')),
  }))
}

const parsedData = parseData(data);

function App() {

  return (
    <div className='grid grid-cols-2 gap-4 p-4'>
      <div className='col-span-1'>
        <DataGridDemo data={data} />
      </div>
      <div className='col-span-1'>
        <LineDataset data={parsedData} />
      </div>
    </div>
  )
}

export default App
