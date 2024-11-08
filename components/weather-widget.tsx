"use client";

import { useState, ChangeEvent, FormEvent } from "react"; 
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CloudIcon, MapPinIcon, Search, ThermometerIcon } from "lucide-react";

interface weatherData {
    tempreature: number;
    description: string;
    location: string;
    unit: string;
}

export default function WeatherWidget() {
    const [location, setLocation] = useState<string>("")
    const [weather, setWether] =useState<weatherData | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoding] = useState<boolean>(false);

    const handleSearch = async(e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const trimmedLocation = location.trim();
        if(trimmedLocation === "") {
            setError("Please Enter a Valid Location");
            setWether(null);
            return;
        }
        setIsLoding(true);
        setError(null);

        try{
            const response = await fetch(
                `https://api.weatherapi.com/v1/current.json?key=${process.env.NEXT_PUBLIC_WEATHER_API_KEY}&q=${trimmedLocation}`
            );
            if(!response.ok){
                throw new Error("city not found.");
            }
            const data = await response.json();
            const weatherData: weatherData = {
                tempreature: data.current.temp_c,
                description: data.current.condition.text,
                location: data.location.name,
                unit: "C",
            };
            setWether(weatherData); 

        }catch(error){
            setError("City not found. please try again.");
            setWether(null);

        }finally{
            setIsLoding(false);
        }
    };
    function getTemperatureMessage(tempreature: number, unit: string): string {
        if(unit == "C") {
            if(tempreature < 0){
                return `It;s freezing at ${tempreature}°c! Bundle up!`;
            }else if(tempreature < 10){
                return `It's quite cold at ${tempreature}°c. wear clothes.`;
            }else if (tempreature < 20) {
                return `The temperature is ${tempreature}°c. comfortable for a light jacket.`;
            }else if (tempreature < 30) {
                return `It's a pleasant ${tempreature}°c. Enjoy the nice weather!`;
            }else {
                return `It;s hot ${tempreature}°c. stay hydrated!`;
            }

        }else {
            // placeholder for other tempeaty=ure units (e.g.,fahrenheit)
            return `${tempreature}°${unit}`;
        }
    }

    function getWeatherMessage (description: string):string{
        switch (description.toLocaleLowerCase()){
            case "sunny":
                return "It's a beautiful sunny day!";
        case "party cloudy":
                    return "expect some clouds and sunshine.";
        case "cloudy":
                     return "It's cloudy today.";
        case "rain":
                   return "Dont't forgat your umbrella! It's raining.";
        case "thunderstorm":
                  return "thanderstorms are expected.";
        case "snow":
                  return "Bundle up! It's snowing.";
        case "mist":
                  return "misty outside.";
        case "fog":
                 return "Be careful, there's fog outside.";
      default:   
              return description;//Defoult to returning the description as-is
        }
    }
    function getLocationMessage (location:string):string{
        const currentHour = new Date().getHours();
        const isNight = currentHour >= 18 || currentHour < 6;
        return`${location} ${isNight ? "at Night" : "During the day"}`;
    }
    return (
        <div className="bg-slate-600 flex justify-center items-center h-screen">
            <Card className="w-full max-w-md mx-auto text-center">
                 <CardHeader>
                    <CardTitle className="bg-gray-950 text-white">Weather Widget</CardTitle>
                    <CardDescription className="text-white">search for the current weather condition in your city.</CardDescription>
                 </CardHeader>
                 <CardContent>
                 <form onSubmit={handleSearch} className=" bg-slate-400 flex items-center gap-2">
                    <Input
                    type="text"
                    placeholder  ="Enter a city name"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    />
                    <Button type="submit" disabled={isLoading}>
                        {isLoading ? "Loading..." : "Search"}
                    </Button>
                 </form>
                 {error && <div className="mt-4 text-red-500">{error}</div>}
                 {weather && (
                    <div className="mt-4 grid gap-2">
                        <div className="flex items-center gap-2">
                            <ThermometerIcon className="w-6 h-6" />
                            {getTemperatureMessage(weather.tempreature, weather.unit)}
                            </div>
                            
                            <div className="flex items-center gap-2">
                            <CloudIcon className="w-6 h-6" />
                            {getWeatherMessage(weather.description)}
                            
                        </div>
                        <div className="flex items-center gap-2">
                            <MapPinIcon className="w-6 h-6" />
                            {getLocationMessage(weather.location)}

                        </div>
                    </div>
                 )}
                 </CardContent>
                 
            </Card>
        </div>
    )
}