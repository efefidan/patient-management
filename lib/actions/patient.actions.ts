import axios from "axios";
import { API_ROUTES, STRAPI_BASE_URL } from "@/lib/strapi.config";
import { User } from "@/types/strapi.types";

// Kullanıcı oluşturma (Strapi'ye uygun hale getirilmiş versiyon)
export const createUser = async (
  user: CreateUserParams
): Promise<User | null> => {
  try {
    // Kullanıcı var mı kontrol et
    const existingUser = await checkIfUserExists(user.email);

    // Eğer kullanıcı zaten varsa ve onaylıysa, onu döndür
    if (existingUser) {
      return existingUser;
    }

    // Kullanıcıyı oluştur (Strapi'de `/users` endpointine `POST` isteği atıyoruz)
    const response = await axios.post(
      `${STRAPI_BASE_URL}/api/auth/local/register`,
      {
        username: user.name, // ✅ Strapi, `username` ister
        email: user.email,
        password: "defaultPassword123", // ✅ Strapi zorunlu olarak şifre ister
      }
    );

    return response.data.user; // Strapi `user` içinde döndürür
  } catch (error) {
    console.error("Kullanıcı oluşturulamadı:", error);
    return null;
  }
};

// Kullanıcının var olup olmadığını kontrol et
const checkIfUserExists = async (email: string): Promise<User | null> => {
  try {
    // 🔥 Strapi'de e-posta ile kullanıcıyı çekiyoruz
    const response = await axios.get(`${STRAPI_BASE_URL}/api/users`, {
      params: {
        filters: {
          email: {
            $eq: email,
          },
        },
        populate: "*", // ✅ Kullanıcıyla ilgili tüm verileri getir
      },
    });

    // Kullanıcı varsa döndür
    if (response.data.length > 0) {
      return response.data[0]; // İlk kullanıcıyı döndür
    }

    return null; // Kullanıcı bulunamazsa null döndür
  } catch (error) {
    console.error("Kullanıcı kontrol edilirken hata oluştu:", error);
    return null;
  }
};

export const getUser = async (id: string) => {
  try {
    const response = await axios.get(`${STRAPI_BASE_URL}/api/users/${id}`, {
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_API_TOKEN}`,
      },
      params: {
        populate: "*", // Kullanıcıyla ilişkili tüm verileri getir
      },
    });

    return response.data;
  } catch (error) {
    console.error("Kullanıcı alınırken hata oluştu:", error);
    return null;
  }
};

export const getPatient = async (id: string) => {
  try {
    const response = await axios.get(`${STRAPI_BASE_URL}/api/users/${id}`, {
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_API_TOKEN}`,
      },
      params: {
        populate: "*", // Kullanıcıyla ilişkili tüm verileri getir
      },
    });

    return response.data;
  } catch (error) {
    console.error("Kullanıcı alınırken hata oluştu:", error);
    return null;
  }
};

export const registerPatient = async ({
  id,
  identificationDocument,
  ...user
}: RegisterUserParams) => {
  try {
    if (!id) {
      throw new Error("❌ Kullanıcı ID bulunamadı!");
    }

    let fileUploadResponse = null;
    let fileId = null; // ✅ Yüklenen dosyanın ID'sini saklamak için değişken

    // Eğer kimlik belgesi varsa Strapi'ye yükleyelim
    if (identificationDocument) {
      const formData = new FormData();
      formData.append("files", identificationDocument);

      console.log("📌 Strapi'ye Yüklenen Dosya:", identificationDocument);

      fileUploadResponse = await axios.post(
        `${STRAPI_BASE_URL}/api/upload`, // ✅ Buraya dikkat!
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_API_TOKEN}`,
          },
        }
      );

      console.log("✅ Dosya Yükleme Yanıtı:", fileUploadResponse.data);

      if (fileUploadResponse.data && fileUploadResponse.data.length > 0) {
        fileId = fileUploadResponse.data[0].id; // ✅ Dosyanın ID'sini al
      }
    }

    // Kullanıcı oluşturma isteği
    const newUserData = {
      username: user.name,
      email: user.email,
      password: user.phone,
      phone: user.phone,
      birthDate: user.birthDate,
      gender: user.gender,
      address: user.address,
      occupation: user.occupation,
      identificationDocument: fileId, // ✅ Dosya ID'sini atıyoruz
      emergencyContactName: user.emergencyContactName,
      emergencyContactNumber: user.emergencyContactNumber,
      insuranceProvider: user.insuranceProvider,
      insurancePolicyNumber: user.insurancePolicyNumber,
      currentMedication: user.currentMedication,
      familyMedicalHistory: user.familyMedicalHistory,
      pastMedicalHistory: user.pastMedicalHistory,
      allergies: user.allergies,
      identificationType: user.identificationType,
      identificationNumber: user.identificationNumber,
      primaryPhysician: user.primaryPhysician,
      privacyConsent: user.privacyConsent,
      treatmentConsent: user.treatmentConsent, 
      disclosureConsent: user.disclosureConsent,
    };

    console.log("📌 Strapi'ye Gönderilecek Kullanıcı Verisi:", newUserData);

    const newUserResponse = await axios.put(
      `${STRAPI_BASE_URL}/api/users/${id}`,
      newUserData,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_API_TOKEN}`,
        },
      }
    );

    console.log("✅ Kullanıcı Başarıyla Güncellendi:", newUserResponse.data);

    return newUserResponse.data;
  } catch (error: any) {
    console.error(
      "❌ Kullanıcı kaydı sırasında hata oluştu:",
      error?.response?.data || error
    );
    if (error?.response) {
      console.error(
        "🔴 Strapi API Yanıtı:",
        JSON.stringify(error.response.data, null, 2)
      );
    }
    return null;
  }
};

