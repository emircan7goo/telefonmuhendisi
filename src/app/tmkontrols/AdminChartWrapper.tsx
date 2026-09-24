"use client";

import dynamic from "next/dynamic";

const AdminChart = dynamic(() => import("./AdminChart").then(m => m.AdminChart), { ssr: false });

export default function AdminChartWrapper(props: any) {
  return <AdminChart {...props} />;
}
