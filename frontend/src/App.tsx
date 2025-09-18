import './App.css'
import LineDataset from './components/chart'
import DataGridDemo from './components/table'

function App() {

  return (
    <div className='grid grid-cols-2 gap-4 p-4'>
      <div className='col-span-1'>
        <DataGridDemo />
      </div>
      <div className='col-span-1'>
        <LineDataset />
      </div>
    </div>
  )
}

export default App
