import { InteractiveRepairUI } from "@/components/repair/InteractiveRepairUI";
import { FloatingUI } from "@/components/ui/FloatingUI";

export const metadata = {
  title: "Sorun Tespiti ve Tamir",
  description: "Cihazınızdaki sorunu tespit edin ve anında teklif alın.",
};

export default function RepairPage() {
  return (
    <div className="relative min-h-screen pt-32 pb-8 overflow-hidden z-10">
      <FloatingUI />
      
      <div className="container-custom">
         {/* 3D Interactive UI Component */}
         <InteractiveRepairUI />
      </div>
    </div>
  );
}
