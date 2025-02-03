/* eslint-disable no-unused-vars */

declare type SearchParamProps = {
  params: { [key: string]: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

declare type Gender = "male" | "female" | "other";
declare type appointmentStatus = "pending" | "scheduled" | "cancelled";

/**
 * Strapi'deki `users` koleksiyonunu kullanarak hasta kayıt bilgilerini yöneteceğimiz için,
 * `RegisterUserParams` doğrudan `User` ile birleştirildi.
 */
declare interface User {
  id: string;
  username: string; // Strapi'de `username` olabilir
  email: string;
  phone: string;
  birthDate: string; // Tarihleri string yap!
  gender: Gender;
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
  identificationDocument?: File; // Strapi'de URL formatında gelir
  privacyConsent: boolean;
  treatmentConsent: boolean;  
  disclosureConsent: boolean; // Strapi'deki "Disclosure Policy" onayı
  confirmed?: boolean; // ✅ Strapi'nin "Users & Permissions Plugin" için onay durumu
  createdAt: string;
  updatedAt: string;
}

/**
 * Kullanıcı oluştururken gereksiz alanları istememek için sadeleştirilmiş versiyon.
 */
declare interface CreateUserParams {
  name: string;
  email: string;
  phone: string;
  password: string;
  birthDate: string; // ISO formatında string olmalı
  gender: Gender;
}

declare interface RegisterUserParams extends CreateUserParams {
  id?: string; // Strapi'deki kullanıcı ID'si
  birthDate: Date;
  gender: Gender;
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
  identificationDocument?: File; // Eğer dosya yükleme varsa
  privacyConsent: boolean;
  treatmentConsent: boolean;  
  disclosureConsent: boolean; 
  // Strapi'deki "Privacy Policy" onayı
  confirmed?: boolean; // ✅ Strapi'nin "Users & Permissions Plugin" için onay durumu

}

/**
 * Strapi'de randevu kayıtları ayrı bir `appointments` koleksiyonunda tutulur.
 */
declare type CreateAppointmentParams = {
  id: string; // Strapi’de kullanıcı ID'si ile ilişkilendirilir
  primaryPhysician: string;
  reason: string;
  schedule: string; // Tarihler string olarak tutulur (ISO formatında)
  appointmentStatus: appointmentStatus;
  note?: string;
};

/**
 * Randevu güncelleme işlemi için kullanılır.
 */
declare type UpdateAppointmentParams = {
  appointmentId: number;
  id: string;
  appointment: CreateAppointmentParams;
  type: string;
};
