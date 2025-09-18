import { LineChart } from '@mui/x-charts/LineChart';

interface DataRow {
    id: string;
    year: number;
    rainfall: number;
    temperature: number;
    humidity: number;
    [key: string]: string | number;
}

interface ChartProps {
    data: DataRow[];
}

const keyToLabel: { [key: string]: string } = {
    other: 'Other',
    rainfall: 'Rainfall (mm/hr)',
    temperature: 'Temperature (°C)',
    humidity: 'Humidity (%)',
};

const colors: { [key: string]: string } = {
    other: 'lightgray',
    humidity: 'lightgreen',
    temperature: 'yellow',
    rainfall: 'blue',
};

const stackStrategy = {
    stack: 'total',
    area: true,
    stackOffset: 'none', // To stack 0 on top of others
} as const;

const customize = {
    height: 350,
    hideLegend: true,
    experimentalFeatures: { preferStrictDomainInLineCharts: true },
};

export default function LineDataset({ data }: ChartProps) {
    return (
        <LineChart
            xAxis={[
                { dataKey: 'year', valueFormatter: (value: number) => value.toString() },
            ]}
            yAxis={[{ width: 50 }]}
            series={Object.keys(keyToLabel).map((key) => ({
                dataKey: key,
                label: keyToLabel[key],
                color: colors[key],
                showMark: false,
                ...stackStrategy,
            }))}
            dataset={data}
            {...customize}
        />
    );
}
