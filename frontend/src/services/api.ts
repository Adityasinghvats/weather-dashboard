import type { DataRow, SummaryData } from "../types/data";
export const API_CONFIG = {
    BASE_URL: "https://weather-backend-cu47.onrender.com/api/v1",
    headers: {
        accept: "application/json",
    },
};

export const fetchDataVisualize = async (): Promise<DataRow[]> => {
    const endpoint = `${API_CONFIG.BASE_URL}/visualize`

    const response = await fetch(endpoint, {
        method: "GET",
        headers: API_CONFIG.headers,
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.statusText}`);
    }

    const { data } = await response.json();
    const parsedData = data.map((item: any) => ({
        id: item._id,
        year: item.year,
        rainfall: item.rainfall,
        temperature: item.temperature,
        humidity: item.humidity,
    }));
    return parsedData;
};

export const fetchDataSummary = async (
): Promise<SummaryData> => {
    try {
        const endpoint = `${API_CONFIG.BASE_URL}/summary`

        const response = await fetch(endpoint, {
            method: "GET",
            headers: API_CONFIG.headers,
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch summary data: ${response.statusText}`);
        }

        const { data } = await response.json();
        const parsedData = {
            averageTemperature: data.averageTemperature,
            averageHumidity: data.averageHumidity,
            averageRainfall: data.averageRainfall
        };
        return parsedData as SummaryData;
    } catch (error) {
        console.error("Error fetching data summary:", error);
        throw error;
    }
};
