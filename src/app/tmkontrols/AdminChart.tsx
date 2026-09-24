"use client";

import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from "recharts";

interface AdminChartProps {
  data: any[];
  isTech: boolean;
}

export function AdminChart({ data, isTech }: AdminChartProps) {
  return (
    <div className="w-full h-[300px] mt-6">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorCiro" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorKazanc" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={isTech ? "#f59e0b" : "#10b981"} stopOpacity={0.3}/>
              <stop offset="95%" stopColor={isTech ? "#f59e0b" : "#10b981"} stopOpacity={0}/>
            </linearGradient>
          </defs>
          <XAxis dataKey="label" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `₺${val}`} />
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
          <Tooltip 
            contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}
            formatter={(value: number) => [`₺${value.toLocaleString("tr-TR")}`, undefined]}
          />
          <Legend wrapperStyle={{ fontSize: "12px", fontWeight: "bold" }} />
          <Area 
            type="monotone" 
            dataKey="ciro" 
            name="Ciro" 
            stroke="#3b82f6" 
            strokeWidth={3} 
            fillOpacity={1} 
            fill="url(#colorCiro)" 
          />
          <Area 
            type="monotone" 
            dataKey={isTech ? "kazanc" : "kar"} 
            name={isTech ? "İşçiliğim" : "Net Kar"} 
            stroke={isTech ? "#f59e0b" : "#10b981"} 
            strokeWidth={3} 
            fillOpacity={1} 
            fill="url(#colorKazanc)" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
