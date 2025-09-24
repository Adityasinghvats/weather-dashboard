// Unit tests for the controller using Jest (no server or DB needed)
import { addWeatherData, getSummaryData } from '../controllers/data.controller.js';
import { Data } from '../models/data.model.js';
import { ApiError } from '../utils/ApiError.js';

const createRes = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};

describe('getSummaryData controller', () => {
    afterEach(() => {
        jest.restoreAllMocks();
    });

    test('returns 200 with computed summary data', async () => {
        const mockAggregateResult = [
            { averageTemperature: 21.11, averageHumidity: 55.22, averageRainfall: 12.33 }
        ];
        jest.spyOn(Data, 'aggregate').mockResolvedValue(mockAggregateResult);

        const req = {};
        const res = createRes();
        const next = jest.fn();

        await getSummaryData(req, res, next);

        expect(next).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledTimes(1);
        const payload = res.json.mock.calls[0][0];
        // payload is ApiResponse; ensure it contains expected data
        expect(payload).toEqual(
            expect.objectContaining({
                data: mockAggregateResult[0],
                message: 'Summary data fetched successfully'
            })
        );
    });

    test('returns 200 with zeroed data when no records', async () => {
        jest.spyOn(Data, 'aggregate').mockResolvedValue([]);

        const req = {};
        const res = createRes();
        const next = jest.fn();

        await getSummaryData(req, res, next);

        expect(next).not.toHaveBeenCalled();

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledTimes(1);
        const payload = res.json.mock.calls[0][0];
        expect(payload.data).toEqual({
            averageTemperature: 0,
            averageHumidity: 0,
            averageRainfall: 0
        });
        expect(payload.message).toBe('Summary data fetched successfully');
    });

    test('returns 500 when aggregation throws', async () => {
        jest.spyOn(Data, 'aggregate').mockRejectedValue(new Error('aggregation failed'));

        const req = {};
        const res = createRes();
        const next = jest.fn();

        await getSummaryData(req, res, next);
        expect(next).toHaveBeenCalledWith(expect.any(ApiError));

        expect(res.status).not.toHaveBeenCalled();
        expect(res.json).not.toHaveBeenCalled();
    });
});

describe('create data controller', () => {
    afterEach(() => {
        jest.restoreAllMocks();
    });
    test('return 400 when data is missing', async () => {
        const req = { body: { year: 2023, humidity: 76 } };
        const res = createRes();
        const next = jest.fn();

        await addWeatherData(req, res, next);
        expect(next).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledTimes(1);
        const payload = res.json.mock.calls[0][0];
        expect(payload).toEqual(
            expect.objectContaining({
                message: 'All fields are required'
            })
        );
    });
    test('test 201 when data is uploaded', async () => {
        const data = { year: "1986", temperature: "25.85000038", humidity: "97", rainfall: "216.5476837" };
        const mockDataResult = [{ data }];
        jest.spyOn(Data.prototype, 'save').mockResolvedValue(mockDataResult);
        const req = {
            body: data
        }
        const res = createRes();
        const next = jest.fn();

        await addWeatherData(req, res, next);
        expect(next).not.toHaveBeenCalled();
        expect(res.json).toHaveBeenCalledTimes(1);
        expect(res.status).toHaveBeenCalledWith(201);
        const payload = res.json.mock.calls[0][0];
        expect(payload).toEqual(
            expect.objectContaining({
                message: 'Data added successfully'
            })
        )
    })
    test('return 500 when error occurs during save', async () => {
        jest.spyOn(Data.prototype, 'save').mockRejectedValue(new ApiError('save failed'));
        const req = { body: { year: 2023, temperature: 25.5, humidity: 76, rainfall: 12.3 } };
        const res = createRes();
        const next = jest.fn();

        await addWeatherData(req, res, next);
        expect(next).toHaveBeenCalledWith(expect.any(ApiError));

        expect(res.status).not.toHaveBeenCalled();
        expect(res.json).not.toHaveBeenCalled();
    });
});