export interface DataRow {
    id: string;
    year: string;
    rainfall: string;
    temperature: string;
    humidity: string;
}

export interface SummaryData {
    averageRainfall: number;
    averageTemperature: number;
    averageHumidity: number;
}