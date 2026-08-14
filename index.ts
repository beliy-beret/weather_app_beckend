import axiosImport, { type AxiosStatic } from 'axios';
import cors from 'cors';
import dotenv from 'dotenv';
import express, { type Request, type Response } from 'express';

dotenv.config();

const axios = axiosImport as unknown as AxiosStatic;

const app = express();
const PORT = Number(process.env.PORT) || 3001;
const OPENWEATHERMAP_API_KEY = process.env.OPENWEATHERMAP_API_KEY;
const OPENWEATHERMAP_URL = 'https://api.openweathermap.org/data/2.5/weather';
const ALLOWED_UNITS = ['standard', 'metric', 'imperial'] as const;

type WeatherQuery = {
  city?: string;
  unit?: string;
};

type WeatherUnit = (typeof ALLOWED_UNITS)[number];

function isWeatherUnit(value: string): value is WeatherUnit {
  return ALLOWED_UNITS.includes(value as WeatherUnit);
}

app.use(cors());
app.use(express.json());

app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

app.get(
  '/api/weather',
  async (req: Request<unknown, unknown, unknown, WeatherQuery>, res: Response) => {
    const city = req.query.city?.trim();
    const unit = req.query.unit ?? 'metric';

    if (!OPENWEATHERMAP_API_KEY) {
      return res.status(500).json({
        message: 'Server config error: OPENWEATHERMAP_API_KEY is missing.',
      });
    }

    if (!city) {
      return res.status(400).json({
        message: 'Query parameter "city" is required.',
      });
    }

    if (!isWeatherUnit(unit)) {
      return res.status(400).json({
        message: 'Query parameter "unit" must be one of: standard, metric, imperial.',
      });
    }

    try {
      const response = await axios.get(OPENWEATHERMAP_URL, {
        params: {
          appid: OPENWEATHERMAP_API_KEY,
          q: city,
          units: unit,
          lang: 'ru',
        },
      });

      return res.json(response.data);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return res.status(404).json({
          message: 'City not found.',
        });
      }

      return res.status(500).json({
        message: 'Failed to load weather data.',
      });
    }
  }
);

app.listen(PORT, () => {
  console.log(`Weather backend is running on port ${PORT}`);
});
