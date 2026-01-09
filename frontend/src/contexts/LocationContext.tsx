import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface City {
    id: string;
    name: string;
    coordinates: {
        lat: number;
        lng: number;
    };
    bbox: {
        minLat: number;
        maxLat: number;
        minLng: number;
        maxLng: number;
    };
}

const cities: City[] = [
    {
        id: 'coimbatore',
        name: 'Coimbatore',
        coordinates: { lat: 11.0168, lng: 76.9558 },
        bbox: { minLat: 10.9600, maxLat: 11.0400, minLng: 76.9200, maxLng: 77.0200 }
    },
    {
        id: 'chennai',
        name: 'Chennai',
        coordinates: { lat: 13.0827, lng: 80.2707 },
        bbox: { minLat: 13.0000, maxLat: 13.1500, minLng: 80.1500, maxLng: 80.3500 }
    },
    {
        id: 'bangalore',
        name: 'Bangalore',
        coordinates: { lat: 12.9716, lng: 77.5946 },
        bbox: { minLat: 12.9000, maxLat: 13.0500, minLng: 77.5000, maxLng: 77.7000 }
    },
    {
        id: 'mumbai',
        name: 'Mumbai',
        coordinates: { lat: 19.0760, lng: 72.8777 },
        bbox: { minLat: 18.9000, maxLat: 19.2500, minLng: 72.7500, maxLng: 73.0000 }
    },
    {
        id: 'delhi',
        name: 'Delhi',
        coordinates: { lat: 28.6139, lng: 77.2090 },
        bbox: { minLat: 28.4000, maxLat: 28.8000, minLng: 77.0000, maxLng: 77.4000 }
    },
];

interface LocationContextType {
    currentCity: City;
    cities: City[];
    setCity: (cityId: string) => void;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export function LocationProvider({ children }: { children: ReactNode }) {
    const [currentCity, setCurrentCity] = useState<City>(() => {
        // Load from localStorage or default to Coimbatore
        const saved = localStorage.getItem('selectedCity');
        if (saved) {
            const found = cities.find(c => c.id === saved);
            if (found) return found;
        }
        return cities[0]; // Default to Coimbatore
    });

    const setCity = (cityId: string) => {
        const city = cities.find(c => c.id === cityId);
        if (city) {
            setCurrentCity(city);
            localStorage.setItem('selectedCity', cityId);
        }
    };

    return (
        <LocationContext.Provider value={{ currentCity, cities, setCity }}>
            {children}
        </LocationContext.Provider>
    );
}

export function useLocation() {
    const context = useContext(LocationContext);
    if (!context) {
        throw new Error('useLocation must be used within LocationProvider');
    }
    return context;
}
