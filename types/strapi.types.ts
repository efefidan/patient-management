export interface User {
    id: string; // Strapi'deki User ID
    username: string;
    email: string;
    phone: string;
    birthDate: string; // Tarihler genellikle string olarak saklanır (ISO 8601)
    gender: "male" | "female" | "other";
    address: string;
    occupation: string;
    emergencyContactName: string;
    emergencyContactNumber: string;
    primaryPhysician: string;
    insuranceProvider: string;
    insurancePolicyNumber: string;
    allergies?: string;
    currentMedication?: string;
    familyMedicalHistory?: string;
    pastMedicalHistory?: string;
    identificationType?: string;
    identificationNumber?: string;
    identificationDocument?: File; // Strapi'de medya dosyaları genellikle URL olarak saklanır
    privacyConsent: boolean;
    treatmentConsent: boolean;  
  disclosureConsent: boolean; 
    confirmed?: boolean; // ✅ Strapi'nin "Users & Permissions Plugin" için onay durumu
    createdAt: string;
    updatedAt: string;
  }
  
  export interface Appointment {
    id: string;
    patient: User; // Strapi’de `users` koleksiyonunda olduğu için `User` tipi ile ilişkilendirildi
    schedule: string; // Date yerine string formatında olmalı
    appointmentStatus: "scheduled" | "completed" | "cancelled";
    primaryPhysician: string;
    reason: string;
    note?: string;
    userId: string; // Hasta ID'si
    cancellationReason?: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateUserParams {
  name: string;
  email: string;
  phone: string;
  birthDate: string;
  gender: "male" | "female" | "other";
}

  