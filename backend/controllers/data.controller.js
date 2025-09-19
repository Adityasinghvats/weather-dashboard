import { ApiError } from "../utils/ApiError.js";
import { Data } from "../models/data.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
// send json array for visualization
const getVisualizationData = async (req, res) => {
    try {
        const visualizationData = await Data.find({}).sort({ year: 1 });
        res.status(200).json(
            new ApiResponse(200, visualizationData, "Visualization data fetched successfully")
        )
    } catch (error) {
        console.error("Error fetching visualization data:", error);
        res.status(500).json(
            new ApiResponse(500, [], "Failed to fetch visualization data")
        );
    }
};

// send json for summary data
const getSummaryData = async (req, res) => {
    try {
        const weatherData = await Data.find({});
        const averageTemperature = (weatherData.reduce((sum, record) => sum + parseFloat(record.temperature), 0) / weatherData.length).toFixed(2);
        const averageHumidity = (weatherData.reduce((sum, record) => sum + parseFloat(record.humidity), 0) / weatherData.length).toFixed(2);
        const averageRainfall = (weatherData.reduce((sum, record) => sum + parseFloat(record.rainfall), 0) / weatherData.length).toFixed(2);
        const summaryData = {
            averageTemperature: parseFloat(averageTemperature),
            averageHumidity: parseFloat(averageHumidity),
            averageRainfall: parseFloat(averageRainfall)
        };

        res.status(200).json(
            new ApiResponse(200, summaryData, "Summary data fetched successfully")
        );
    } catch (error) {
        console.error("Error fetching summary data:", error);
        res.status(500).json(
            new ApiResponse(500, [], "Failed to fetch summary data")
        );
    }
};

// get data in json and add to db
//  verify data 
const addWeatherData = async (req, res) => {
    const { year, temperature, humidity, rainfall } = req.body;
    if (!year || !temperature || !humidity || !rainfall) {
        // error code for bad request
        return res.status(400).json(
            new ApiResponse(400, null, "All fields are required")
        );
    }
    try {
        const newData = new Data({ year, temperature, humidity, rainfall });
        await newData.save();
        res.status(201).json(
            new ApiResponse(201, newData, "Data added successfully")
        );
    } catch (error) {
        console.log("Error adding data:", error?.message);
        // error code for server side failure
        throw new ApiError(500, "Failed to add data");
    }
}

export { getVisualizationData, getSummaryData, addWeatherData };