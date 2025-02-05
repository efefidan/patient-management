import axios from "axios";
import { STRAPI_BASE_URL, API_ROUTES } from "./strapi.config";
import { User, Appointment } from "@/types/strapi.types";


const apiClient = axios.create({
  baseURL: STRAPI_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Hasta (Patient) Verilerini Getir
export const getPatients = async (): Promise<User[]> => {
  try {
    const response = await apiClient.get(API_ROUTES.patients); // Değiştirildi: `/patients` yerine `/users`
    return response.data;
  } catch (error) {
    console.error("Strapi API Hatası:", error);
    throw error;
  }
};

// Doktor (Doctor) Verilerini Getir
export const getDoctors = async () => {
  try {
    const response = await apiClient.get(API_ROUTES.doctors);
    return response.data;
  } catch (error) {
    console.error("Strapi API Hatası:", error);
    throw error;
  }
};

// Yeni Hasta (Patient) Kaydet
// Kullanıcı (Hasta) oluşturma
export const createUser = async (userData: CreateUserParams): Promise<User> => {
  try {
    const response = await apiClient.post(API_ROUTES.patients, {
      data: userData, // Strapi `data` objesi ister
    });
    return response.data;
  } catch (error) {
    console.error("Kullanıcı oluşturulamadı:", error);
    throw error;
  }
};


// Randevu oluşturma
export const createAppointment = async (appointmentData: Appointment) => {
  try {
    console.log("📌 Gönderilecek Randevu Verisi:", appointmentData);

    const response = await apiClient.post(API_ROUTES.appointments, {
      data: appointmentData, // Strapi `data` formatı ister
    }, {
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_API_TOKEN}`, // API token ekle
        "Content-Type": "application/json",
      },
    });
    
    console.log("✅ Randevu Başarıyla Oluşturuldu:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Randevu oluşturulamadı:", error?.response?.data || error);
    return null;
  }
};



// Dosya Yükleme (Strapi Upload API)
export const uploadFileToStrapi = async (file: File) => {
  const formData = new FormData();
  formData.append("files", file);

  try {
    const response = await axios.post(`${STRAPI_BASE_URL}/api/upload`, formData, {
      headers: { 
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_API_TOKEN}`
      },
    });

    console.log("✅ Dosya Strapi'ye yüklendi:", response.data);
    return response.data[0]; // ✅ Yüklenen dosyanın detaylarını döndür
  } catch (error) {
    console.error("❌ Strapi'ye dosya yüklenirken hata oluştu:", error);
    throw error;
  }
};

