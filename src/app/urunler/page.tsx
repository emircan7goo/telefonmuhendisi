import { StoreClient } from "@/components/store/StoreClient";
import { FloatingUI } from "@/components/ui/FloatingUI";

export const metadata = {
  title: "Mağaza & Cihazlar | Telefon Mühendisi",
  description: "Yenilenmiş iPhone ve Apple Watch modelleri, orijinal şarj adaptörleri, kablolar ve koruyucu seramik camlar.",
};

export default function StorePage() {
  return (
    <>
      <FloatingUI />
      <StoreClient />
    </>
  );
}
