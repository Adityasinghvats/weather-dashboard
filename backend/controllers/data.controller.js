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

// send json for summary data (computed via MongoDB aggregation for better performance)
const getSummaryData = async (req, res) => {
    try {
        const [result] = await Data.aggregate([
            // Cast string fields to numbers, stripping potential unit suffixes
            {
                $addFields: {
                    temperatureNum: {
                        $toDouble: {
                            $replaceAll: {
                                input: { $replaceAll: { input: { $ifNull: ["$temperature", "0"] }, find: "°C", replacement: "" } },
                                find: " ",
                                replacement: ""
                            }
                        }
                    },
                    humidityNum: {
                        $toDouble: {
                            $replaceAll: {
                                input: { $replaceAll: { input: { $ifNull: ["$humidity", "0"] }, find: "%", replacement: "" } },
                                find: " ",
                                replacement: ""
                            }
                        }
                    },
                    rainfallNum: {
                        $toDouble: {
                            $replaceAll: {
                                input: { $replaceAll: { input: { $ifNull: ["$rainfall", "0"] }, find: "mm", replacement: "" } },
                                find: " ",
                                replacement: ""
                            }
                        }
                    }
                }
            },
            {
                $group: {
                    _id: null,
                    averageTemperature: { $avg: "$temperatureNum" },
                    averageHumidity: { $avg: "$humidityNum" },
                    averageRainfall: { $avg: "$rainfallNum" }
                }
            },
            {
                $project: {
                    _id: 0,
                    averageTemperature: { $round: ["$averageTemperature", 2] },
                    averageHumidity: { $round: ["$averageHumidity", 2] },
                    averageRainfall: { $round: ["$averageRainfall", 2] }
                }
            }
        ]);

        const summaryData = result || { averageTemperature: 0, averageHumidity: 0, averageRainfall: 0 };

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