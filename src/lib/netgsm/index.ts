export async function sendSMS(phone: string, message: string) {
  const user = process.env.NETGSM_USERNAME;
  const pass = process.env.NETGSM_PASSWORD;
  const header = process.env.NETGSM_HEADER || "TELEFONMUH";
  
  // Clean phone number: remove any non-digit characters.
  // Netgsm expects Turkish numbers with country code (905XXXXXXXXX) or without leading 0.
  let cleanPhone = phone.replace(/\D/g, "");
  if (cleanPhone.startsWith("0")) cleanPhone = cleanPhone.substring(1);
  if (!cleanPhone.startsWith("90")) {
    cleanPhone = "90" + cleanPhone;
  }

  // If credentials are placeholders or not configured, fallback to mock logging
  if (!user || user.includes("your-netgsm") || !pass || pass.includes("your-netgsm")) {
    console.log(`[NETGSM MOCK] Mock SMS to ${cleanPhone}: ${message}`);
    await new Promise(resolve => setTimeout(resolve, 300));
    return { success: true, mock: true };
  }

  try {
    const url = `https://api.netgsm.com.tr/sms/send/get/?usercode=${encodeURIComponent(user)}&password=${encodeURIComponent(pass)}&gsmno=${cleanPhone}&message=${encodeURIComponent(message)}&msgheader=${encodeURIComponent(header)}`;
    
    const response = await fetch(url);
    const text = await response.text();
    
    // Netgsm returns "00 <id>" on success, or code numbers like "20", "30", "40", "70", etc. on error.
    if (text.startsWith("00")) {
      console.log(`[NETGSM] SMS sent successfully to ${cleanPhone}: ${text}`);
      return { success: true, code: text };
    } else {
      console.error(`[NETGSM] Error response from Netgsm: ${text}`);
      return { success: false, error: text };
    }
  } catch (error) {
    console.error("[NETGSM] Fetch error sending SMS:", error);
    return { success: false, error };
  }
}

export function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6 digits
}
