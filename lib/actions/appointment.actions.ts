import axios from "axios";
import { STRAPI_BASE_URL } from "@/lib/strapi.config"; // Strapi URL'ni buraya tanımladığını varsayıyorum

export const createAppointment = async (appointment: CreateAppointmentParams) => {
  try {
    const response = await axios.post(
      `${STRAPI_BASE_URL}/api/appointments`,
      {
        data: {
            user: appointment.id ,
            primaryPhysician: appointment.primaryPhysician,
            reason: appointment.reason,
            schedule: appointment.schedule, // Tarih formatı uygun mu?
            appointmentStatus: appointment.appointmentStatus,
            note: appointment.note || null,
          },
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_API_TOKEN}`, // Strapi için API token
        },
      }
    );

    console.log("✅ Randevu Başarıyla Oluşturuldu:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("❌ Randevu oluşturulurken hata oluştu:", error);

    if (axios.isAxiosError(error)) {
      console.error("🔴 Strapi API Yanıtı:", JSON.stringify(error.response?.data, null, 2));
      console.error("🔴 Axios Hata Kodu:", error.response?.status);
    }

    return null;
  }

};


export const getAppointment = async (appointmentId: string) => {
  try {
    const response = await axios.get(
      `${STRAPI_BASE_URL}/api/appointments/${appointmentId}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_API_TOKEN}`,
        },
        params: {
          populate: "*", // Tüm ilişkili verileri getir
        },
      }
    );

    console.log("✅ Strapi'den Dönen Cevap:", response.data);
    console.log("🟢 Strapi'nin Döndürdüğü ID:", response.data.data.id);

    if (!response.data || !response.data.data) {
      console.error("❌ Randevu bulunamadı veya eksik:", response.data);
      return null;
    }

    return response.data.data; // ✅ Strapi'nin veri formatına uygun hale getir
  } catch (error) {
    console.error("❌ Randevu alınırken hata oluştu:", error?.response?.data || error);
    return null;
  }
};
