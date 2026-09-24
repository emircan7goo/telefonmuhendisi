import { auth } from "@/auth";
import { InteractiveRepairUI } from "@/components/repair/InteractiveRepairUI";
import { FloatingUI } from "@/components/ui/FloatingUI";

export const metadata = {
  title: "Sorun Tespiti ve Tamir",
  description: "Cihazınızdaki sorunu tespit edin ve anında teklif alın.",
};

export default async function RepairPage() {
  const session = await auth();

  return (
    <div className="relative min-h-screen pt-32 pb-8 overflow-hidden z-10">
      <FloatingUI />
      
      <div className="container-custom">
         {/* 3D Interactive UI Component */}
         <InteractiveRepairUI session={session} />
      </div>
    </div>
  );
}
