
'use client';
import React from 'react';

// This component provides a simplified, non-geographic SVG representation of the world.
// It is intended for illustrative purposes to demonstrate the app's features
// without requiring a full mapping library or complex geo-data.

interface WorldMapSvgProps {
  data: { [countryCode: string]: number };
  getColor: (value: number | undefined) => string;
  onCountryHover: (code: string, event: React.MouseEvent) => void;
}

interface CountryShape {
  id: string;
  path: string;
  name: string;
}

const mapLayout: CountryShape[] = [
    // North America
    { id: 'CAN', name: 'Canada', path: 'M142.2,149.3l-18-1.8l-12.6,9l-9,14.4l-10.8,7.2L85.2,178l-5.4,7.2l-5.4,10.8l-1.8,10.8l5.4,7.2h10.8l12.6-1.8l10.8-7.2l21.6-1.8l14.4,1.8l10.8-1.8l1.8-7.2l1.8-10.8l-3.6-5.4l-3.6-7.2l-5.4-5.4l-7.2-1.8l-1.8-7.2l3.6-3.6L142.2,149.3z' },
    { id: 'USA', name: 'United States', path: 'M111.8,206.9l-10.8,1.8l-12.6,5.4l-7.2,10.8l-1.8,5.4h10.8l21.6-3.6l30.6-1.8h12.6l10.8,1.8l7.2-3.6l1.8-12.6l-3.6-7.2l-9-5.4l-14.4-1.8l-14.4-3.6l-7.2,1.8l-7.2,5.4L111.8,206.9z' },
    { id: 'MEX', name: 'Mexico', path: 'M126.2,253.7l-9,3.6l-7.2,7.2l-1.8,7.2l5.4-1.8l14.4,1.8l12.6-7.2l5.4-7.2l-1.8-7.2l-5.4-5.4l-9-1.8H126.2z' },
    
    // South America
    { id: 'COL', name: 'Colombia', path: 'M200,280 l-10,10 5,15 15,5 10,-10 -5,-15 -15,-5 z' },
    { id: 'PER', name: 'Peru', path: 'M180,310 l10,-15 15,-5 10,10 5,15 -10,5 -15,-5 z' },
    { id: 'BRA', name: 'Brazil', path: 'M234.2,305.9l-9-1.8l-7.2-5.4l-10.8-9l-3.6-10.8l-1.8-12.6h-7.2l-5.4,5.4l-1.8,10.8l1.8,9l1.8,7.2l9,9l10.8,1.8l7.2,5.4l3.6,5.4l3.6,1.8l3.6-1.8L234.2,305.9z' },
    { id: 'ARG', name: 'Argentina', path: 'M219.8,385.1l-3.6,1.8l-3.6,5.4l-1.8,7.2l-5.4-1.8l-1.8-7.2l3.6-9l5.4-5.4l7.2-3.6v9L219.8,385.1z' },
    { id: 'CHL', name: 'Chile', path: 'M195,350 l-5,20 5,10 5,-25 -5,-5 z' },
    { id: 'VEN', name: 'Venezuela', path: 'M220,260 l15,5 10,10 -5,15 -15,-5 -10,-10 5,-15 z' },

    // Europe
    { id: 'GBR', name: 'United Kingdom', path: 'M380,180 l-5,10 -5,-5 -5,10 10,5 5,-10 5,5 5,-10 -10,-5 z' },
    { id: 'FRA', name: 'France', path: 'M405,245 l-10,15 5,10 15,-5 5,-15 -15,-5 z' },
    { id: 'DEU', name: 'Germany', path: 'M430,220 l10,15 -5,10 15,5 10,-15 -5,-10 -15,-5 z' },
    { id: 'ITA', name: 'Italy', path: 'M440,260 l5,20 -5,10 10,5 5,-20 -5,-10 -10,-5 z' },
    { id: 'ESP', name: 'Spain', path: 'M370,265 l-10,15 10,10 15,-5 5,-15 -10,-10 z' },
    { id: 'NLD', name: 'Netherlands', path: 'M425,200 l5,8 -5,7 5,5 -5,-5 -5,8 -3,-10 z' },
    { id: 'CHE', name: 'Switzerland', path: 'M435,245 l5,5 -5,5 5,5 -5,-5 z' },
    { id: 'SWE', name: 'Sweden', path: 'M450,170 l5,20 -5,10 5,5 5,-20 -5,-10 -5,-5 z' },
    { id: 'RUS', name: 'Russia', path: 'M499.2,192.5l14.3-12.8L516,169l4.5-5.9l22.6,3.6l10.8-10.8l10.8-3.6l12.6,9l12.6,1.8l7.2-5.4l10.8,1.8l16.2-7.2l9-7.2l9-12.6l14.4-3.6l1.8,7.2l-1.8,7.2l-10.8,12.6l-1.8,12.6l-9,1.8l1.8,7.2l-1.8,7.2l-14.4,5.4l-12.6,1.8l-10.8,9l-5.4-3.6l-5.4,1.8l-5.4,5.4l-7.2,1.8l-16.2-1.8l-7.2-5.4l-7.2-1.8l-3.6-7.2l-5.4,3.6h-5.4l-5.4-3.6l-7.2,1.8l-3.6-5.4L499.2,192.5z' },

    // Asia
    { id: 'CHN', name: 'China', path: 'M626.6,233.9l-10.8,5.4l-12.6,10.8l-7.2,10.8l-3.6,7.2l-1.8,9h12.6l16.2-3.6l14.4-10.8l7.2-12.6l1.8-9l-3.6-7.2l-9-7.2l-9-3.6L626.6,233.9z' },
    { id: 'IND', name: 'India', path: 'M605,284.3l-10.8,1.8l-9,9l-3.6,7.2l-1.8,9l5.4,5.4h9l10.8-3.6l5.4-7.2l1.8-9l-1.8-7.2l-7.2-5.4L605,284.3z' },
    { id: 'JPN', name: 'Japan', path: 'M732.8,228.5l-3.6,5.4l-1.8,7.2l1.8,3.6l5.4,1.8l3.6-3.6l1.8-7.2l-1.8-5.4L732.8,228.5z' },
    { id: 'KOR', name: 'South Korea', path: 'M700,240 l5,10 -5,5 5,5 -5,-5 -5,10 -5,-10 z' },
    { id: 'IDN', name: 'Indonesia', path: 'M650,330 l20,5 10,10 -5,15 -20,-5 -10,-10 5,-15 z' },
    { id: 'SAU', name: 'Saudi Arabia', path: 'M510,310 l20,-5 15,10 -5,15 -20,5 -15,-10 5,-15 z' },
    { id: 'ARE', name: 'UAE', path: 'M540,300 l10,0 5,5 -5,5 -10,0 -5,-5 5,-5 z' },
    { id: 'SGP', name: 'Singapore', path: 'M680,345 l5,0 2,2 -2,3 -5,0 -2,-2 2,-3 z' },

    // Africa
    { id: 'NGA', name: 'Nigeria', path: 'M420,320 l15,5 10,15 -5,10 -15,-5 -10,-15 5,-10 z' },
    { id: 'EGY', name: 'Egypt', path: 'M490,270 l15,-5 10,10 -5,15 -15,5 -10,-10 5,-15 z' },
    { id: 'ZAF', name: 'South Africa', path: 'M480.8,404.9l-1.8-5.4l-5.4-3.6l-9-1.8h-7.2l-3.6,5.4l-1.8,5.4l3.6,3.6l7.2,3.6h9l5.4-1.8L480.8,404.9z' },
    { id: 'KEN', name: 'Kenya', path: 'M515,340 l10,10 -5,15 -15,-5 -10,-10 5,-15 15,5 z' },
    { id: 'ETH', name: 'Ethiopia', path: 'M520,320 l15,5 5,10 -10,5 -15,-5 -5,-10 z' },
    { id: 'GHA', name: 'Ghana', path: 'M390,325 l10,5 5,10 -10,5 -10,-5 -5,-10 z' },
    { id: 'DZA', name: 'Algeria', path: 'M420,280 l20,-5 15,10 -5,15 -20,-5 -15,-10 5,-15 z' },
    { id: 'MAR', name: 'Morocco', path: 'M380,290 l10,-5 10,10 -5,15 -10,-5 -10,-10 5,-15 z' },

    // Oceania
    { id: 'AUS', name: 'Australia', path: 'M700.4,367.1l-10.8,1.8l-12.6,9l-7.2,7.2l-3.6,9l1.8,5.4l10.8,3.6h14.4l10.8-5.4l5.4-9l1.8-7.2l-3.6-7.2l-9-3.6L700.4,367.1z' },
    { id: 'NZL', name: 'New Zealand', path: 'M770,410 l5,10 -5,5 5,5 -10,5 -5,-10 5,-5 -5,-5 10,-5 z' },
];

export const WorldMapSvg = ({ data, getColor, onCountryHover }: WorldMapSvgProps) => {
  return (
    <svg
      viewBox="0 0 800 450"
      className="w-full h-full"
      aria-label="World map visualization"
    >
      <g className="countries">
        {mapLayout.map(({ id, path, name }) => (
          <path
            key={id}
            d={path}
            className="country-shape transition-all duration-200 hover:opacity-80"
            fill={getColor(data[id])}
            stroke="hsl(var(--card))"
            strokeWidth={0.7}
            onMouseMove={(e) => onCountryHover(id, e)}
            style={{ cursor: 'pointer' }}
            aria-label={name}
          >
            <title>{name}</title>
          </path>
        ))}
      </g>
    </svg>
  );
};
