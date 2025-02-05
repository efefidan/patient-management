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


export const getRecentAppointmentList = async () => {
  try {
    // Strapi'den en son oluşturulan randevuları al
    const response = await axios.get(`${STRAPI_BASE_URL}/api/appointments`, {
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_API_TOKEN}`,
      },
      params: {
        sort: "createdAt:desc", // En son oluşturulanları sırala
        populate: "*", // Kullanıcı ve diğer ilişkili verileri getir
      },
    });

    const appointments = response.data.data; // Strapi'nin döndürdüğü verileri al
    console.log("🟢 Gelen Appointment Verisi:", appointments); // <<<< Log burada!

    

    // Başlangıç sayaçları
    const initialCounts = {
      scheduledCount: 0,
      pendingCount: 0,
      cancelledCount: 0,
    };

    // Randevuları durumlarına göre gruplandır
    const counts = appointments.reduce((acc, appointment) => {
      const status = appointment.appointmentStatus;

      if (status === "scheduled") {
        acc.scheduledCount += 1;
      } else if (status === "pending") {
        acc.pendingCount += 1;
      } else if (status === "cancelled") {
        acc.cancelledCount += 1;
      }

      return acc;
    }, initialCounts);

    const data = {
      totalCount: appointments.length,
      ...counts,
      documents: appointments, // Tüm randevu verileri
    };

    console.log("✅ Sonuçlanan Randevu Verisi:", data);
    return data;
  } catch (error) {
    console.error("❌ Randevular alınırken hata oluştu:", error?.response?.data || error);
    return null;
  }
};


export const updateAppointment = async ({ appointmentId, id, appointment, type, documentId }: UpdateAppointmentParams) => {
  try {
    const updateId = documentId || appointmentId || id;

    if (!updateId) {
      throw new Error("❌ Güncellenecek randevu ID eksik!");
    }

    console.log("📤 Güncellenecek Randevu ID:", updateId);
    
    const validStatuses = ["scheduled", "pending", "cancelled"];
    const appointmentStatus = validStatuses.includes(appointment?.appointmentStatus)
      ? appointment?.appointmentStatus
      : "pending"; 

    console.log("📤 Gönderilen Güncelleme Verisi:", JSON.stringify(appointment, null, 2));

    const response = await axios.put(
      `${STRAPI_BASE_URL}/api/appointments/${updateId}`,
      {
        data: {
          ...appointment,
          appointmentStatus,
        },
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_API_TOKEN}`,
        },
      }
    );

    if (!response.data || !response.data.data) {
      throw new Error("Appointment not found");
    }

    console.log("✅ Randevu Başarıyla Güncellendi:", response.data);
    return response.data.data;
  } catch (error: any) {
    console.error("❌ Randevu güncellenirken hata oluştu:", error);

    if (axios.isAxiosError(error)) {
      console.error("🔴 Strapi API Yanıtı:", JSON.stringify(error.response?.data, null, 2));
      console.error("🔴 Axios Hata Kodu:", error.response?.status);
    }

    return null;
  }
};

