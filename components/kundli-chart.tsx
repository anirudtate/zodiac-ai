'use client';

import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { Body } from 'astronomy-engine';

interface KundliChartProps {
  dateOfBirth: string;
  timeOfBirth: string;
  placeOfBirth: string;
}

const RASHI_NAMES = [
  'Aries',
  'Taurus',
  'Gemini',
  'Cancer',
  'Leo',
  'Virgo',
  'Libra',
  'Scorpio',
  'Sagittarius',
  'Capricorn',
  'Aquarius',
  'Pisces'
] as const;

const RASHI_SYMBOLS = {
  Aries: '♈',
  Taurus: '♉',
  Gemini: '♊',
  Cancer: '♋',
  Leo: '♌',
  Virgo: '♍',
  Libra: '♎',
  Scorpio: '♏',
  Sagittarius: '♐',
  Capricorn: '♑',
  Aquarius: '♒',
  Pisces: '♓'
} as const;

export function KundliChart({ dateOfBirth, timeOfBirth, placeOfBirth }: KundliChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    // Clear previous chart
    d3.select(svgRef.current).selectAll("*").remove();

    const width = 600;
    const height = 600;
    const margin = 60;
    const chartSize = Math.min(width, height) - 2 * margin;

    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${width/2}, ${height/2})`);

    // Draw outer square
    svg.append('rect')
      .attr('x', -chartSize/2)
      .attr('y', -chartSize/2)
      .attr('width', chartSize)
      .attr('height', chartSize)
      .attr('fill', 'none')
      .attr('stroke', 'currentColor')
      .attr('stroke-width', 2)
      .attr('class', 'dark:stroke-white stroke-black');

    // Draw inner square rotated 45 degrees
    const innerSize = chartSize * Math.cos(Math.PI/4);
    svg.append('rect')
      .attr('x', -innerSize/2)
      .attr('y', -innerSize/2)
      .attr('width', innerSize)
      .attr('height', innerSize)
      .attr('fill', 'none')
      .attr('stroke', 'currentColor')
      .attr('stroke-width', 2)
      .attr('class', 'dark:stroke-white stroke-black')
      .attr('transform', 'rotate(45)');

    // Draw diagonal lines
    svg.append('line')
      .attr('x1', -chartSize/2)
      .attr('y1', -chartSize/2)
      .attr('x2', chartSize/2)
      .attr('y2', chartSize/2)
      .attr('stroke', 'currentColor')
      .attr('stroke-width', 1)
      .attr('class', 'dark:stroke-white stroke-black');

    svg.append('line')
      .attr('x1', -chartSize/2)
      .attr('y1', chartSize/2)
      .attr('x2', chartSize/2)
      .attr('y2', -chartSize/2)
      .attr('stroke', 'currentColor')
      .attr('stroke-width', 1)
      .attr('class', 'dark:stroke-white stroke-black');

    // Draw cross lines
    svg.append('line')
      .attr('x1', 0)
      .attr('y1', -chartSize/2)
      .attr('x2', 0)
      .attr('y2', chartSize/2)
      .attr('stroke', 'currentColor')
      .attr('stroke-width', 1)
      .attr('class', 'dark:stroke-white stroke-black');

    svg.append('line')
      .attr('x1', -chartSize/2)
      .attr('y1', 0)
      .attr('x2', chartSize/2)
      .attr('y2', 0)
      .attr('stroke', 'currentColor')
      .attr('stroke-width', 1)
      .attr('class', 'dark:stroke-white stroke-black');

    // Add house numbers and descriptions
    const housePositions = [
      { house: 1, x: 0, y: -chartSize/4, rotate: 0 },
      { house: 2, x: -chartSize/4, y: -chartSize/4, rotate: 0 },
      { house: 3, x: -chartSize/4, y: 0, rotate: 0 },
      { house: 4, x: -chartSize/4, y: chartSize/4, rotate: 0 },
      { house: 5, x: 0, y: chartSize/4, rotate: 0 },
      { house: 6, x: chartSize/4, y: chartSize/4, rotate: 0 },
      { house: 7, x: chartSize/4, y: 0, rotate: 0 },
      { house: 8, x: chartSize/4, y: -chartSize/4, rotate: 0 },
      { house: 9, x: chartSize/3, y: -chartSize/3, rotate: 45 },
      { house: 10, x: 0, y: -chartSize/3, rotate: 0 },
      { house: 11, x: -chartSize/3, y: -chartSize/3, rotate: -45 },
      { house: 12, x: -chartSize/3, y: 0, rotate: -45 }
    ];

    housePositions.forEach(({ house, x, y, rotate }) => {
      const g = svg.append('g')
        .attr('transform', `translate(${x},${y}) rotate(${rotate})`);

      g.append('text')
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle')
        .attr('class', 'text-base font-bold dark:fill-white fill-black')
        .text(house.toString());

      g.append('text')
        .attr('y', 20)
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle')
        .attr('class', 'text-lg font-semibold dark:fill-white fill-black')
        .text(RASHI_SYMBOLS[RASHI_NAMES[(house - 1) % 12]]);
    });

    // Add quadrant labels
    const quadrants = [
      { text: '1st Quadrant: Self and Personal Identity', y: -chartSize/2 - 20 },
      { text: '2nd Quadrant: Family and Close Relationships', x: -chartSize/2 - 20, rotate: -90 },
      { text: '3rd Quadrant: Interaction with Other People', y: chartSize/2 + 20 },
      { text: '4th Quadrant: Society and Profession', x: chartSize/2 + 20, rotate: 90 }
    ];

    quadrants.forEach(({ text, x = 0, y = 0, rotate = 0 }) => {
      svg.append('text')
        .attr('x', x)
        .attr('y', y)
        .attr('text-anchor', 'middle')
        .attr('transform', `rotate(${rotate}${rotate ? `,${x},${y}` : ''})`)
        .attr('class', 'text-sm font-semibold dark:fill-white fill-black')
        .text(text);
    });

    // Calculate and add planetary positions
    try {
      const planets = [
        { symbol: '☉', name: 'Sun', body: Body.Sun },
        { symbol: '☽', name: 'Moon', body: Body.Moon },
        { symbol: '♂', name: 'Mars', body: Body.Mars },
        { symbol: '☿', name: 'Mercury', body: Body.Mercury },
        { symbol: '♃', name: 'Jupiter', body: Body.Jupiter },
        { symbol: '♀', name: 'Venus', body: Body.Venus },
        { symbol: '♄', name: 'Saturn', body: Body.Saturn },
        { symbol: '☊', name: 'Rahu', body: Body.Moon }, // Placeholder
        { symbol: '☋', name: 'Ketu', body: Body.Moon }  // Placeholder
      ];

      // For now, distribute planets evenly for visualization
      planets.forEach((planet, index) => {
        const angle = (index * 360 / planets.length) * (Math.PI / 180);
        const radius = chartSize / 6;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;

        const g = svg.append('g')
          .attr('transform', `translate(${x},${y})`);

        g.append('text')
          .attr('text-anchor', 'middle')
          .attr('dominant-baseline', 'middle')
          .attr('class', 'text-lg font-bold dark:fill-white fill-black')
          .text(planet.symbol);

        g.append('text')
          .attr('y', 20)
          .attr('text-anchor', 'middle')
          .attr('dominant-baseline', 'middle')
          .attr('class', 'text-sm font-medium dark:fill-white fill-black')
          .text(planet.name);
      });

    } catch (error) {
      console.error('Error calculating planetary positions:', error);
    }

  }, [dateOfBirth, timeOfBirth, placeOfBirth]);

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="flex justify-center items-center">
        <svg 
          ref={svgRef}
          className="max-w-full h-auto"
          viewBox="0 0 600 600"
          preserveAspectRatio="xMidYMid meet"
        />
      </div>
      <div className="text-sm text-muted-foreground max-w-xl text-center">
        <p>This is your North Indian style birth chart (Kundli). Each house represents different aspects of life, and the planetary positions at your time of birth influence these areas.</p>
      </div>
    </div>
  );
} 