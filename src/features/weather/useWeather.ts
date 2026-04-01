import { useQuery } from '@tanstack/react-query'

interface WeatherData {
    temp: number
    description: string
    city: string
    humidity: number
    wind: number
}

// WMO weather code → tavsif
function getWeatherDescription(code: number): string {
    const descriptions: Record<number, string> = {
        0: 'Ochiq osmon',
        1: 'Asosan ochiq',
        2: 'Qisman bulutli',
        3: 'Bulutli',
        45: 'Tumanliq',
        48: 'Tumanliq',
        51: 'Yengil yomg\'ir',
        53: 'O\'rtacha yomg\'ir',
        55: 'Kuchli yomg\'ir',
        61: 'Yomg\'ir',
        63: 'O\'rtacha yomg\'ir',
        65: 'Kuchli yomg\'ir',
        71: 'Yengil qor',
        73: 'Qor',
        75: 'Kuchli qor',
        80: 'Yomg\'ir',
        81: 'Kuchli yomg\'ir',
        95: 'Momaqaldiroq',
    }
    return descriptions[code] ?? 'Noma\'lum'
}

async function fetchWeather(): Promise<WeatherData> {
    const res = await fetch(
        'https://api.open-meteo.com/v1/forecast?latitude=41.31&longitude=69.28&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code'
    )
    if (!res.ok) throw new Error('Ob-havo ma\'lumotini olishda xato')

    const data = await res.json()
    const current = data.current

    return {
        temp: Math.round(current.temperature_2m),
        description: getWeatherDescription(current.weather_code),
        city: 'Toshkent',
        humidity: current.relative_humidity_2m,
        wind: current.wind_speed_10m,
    }
}

export function useWeather() {
    return useQuery({
        queryKey: ['weather', 'tashkent'],
        queryFn: fetchWeather,
        staleTime: 30 * 60 * 1000,
        refetchOnWindowFocus: false,
    })
}
