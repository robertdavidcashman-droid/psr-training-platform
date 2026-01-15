'use client';

import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ProgressData {
  date: string;
  accuracy: number;
  questions: number;
}

export function ProgressChartClient() {
  const [data, setData] = useState<ProgressData[]>([]);

  useEffect(() => {
    // Fetch progress data
    fetch('/api/progress/chart')
      .then(res => res.json())
      .then(result => {
        if (result.data) {
          setData(result.data);
        }
      })
      .catch(() => {
        // If API doesn't exist or fails, show empty state
        setData([]);
      });
  }, []);

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        <p>No progress data yet. Start practicing to see your progress!</p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="accuracy" stroke="#0284c7" strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  );
}
