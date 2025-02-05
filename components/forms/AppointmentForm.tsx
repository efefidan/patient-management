"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import CustomFormField from "../CustomFormField";
import SubmitButton from "../SubmitButton";
import { useState } from "react";
import {
  getAppointmentSchema,
} from "@/lib/validation";
import { useRouter } from "next/navigation";
import { createUser } from "@/lib/actions/patient.actions";
import { FormFieldType } from "./PatientForm";
import { Doctors } from "@/constants";
import { SelectItem } from "../ui/select";
import Image from "next/image";
import { createAppointment } from "@/lib/strapiClient";
import { Appointment } from "@/types/strapi.types";
import { updateAppointment } from "@/lib/actions/appointment.actions";

const AppointmentForm = ({
  id,
  type,
  appointment,
  setOpen,
}: {
  id: string;
  type: "create" | "cancel" | "schedule";
  appointment?: Appointment;
  setOpen: (open: boolean) => void;
}) => {
  const router = useRouter(); // ✅ Parantez ekleyerek çağırmalısın!
  const [isLoading, setIsLoading] = useState(false);


  const AppointmentFormValidation = getAppointmentSchema(type);

  const form = useForm<z.infer<typeof AppointmentFormValidation>>({
    resolver: zodResolver(AppointmentFormValidation),
    defaultValues: {
      primaryPhysician: appointment ? appointment.primaryPhysician : '',
      schedule: appointment ? new Date(appointment.schedule) : new Date(Date.now()),
      reason: appointment ? appointment.reason : '',
      note: appointment?.note || '' ,
      cancellationReason: appointment?.cancellationReason || '',
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof AppointmentFormValidation>) {
    setIsLoading(true);

    let appointmentStatus;
    switch (type) {
      case "schedule":
        appointmentStatus = "scheduled";
        break;
      case "cancel":
        appointmentStatus = "cancelled";
        break;
      default:
        appointmentStatus = "pending";
        break;
    }

    try {
      if (type === "create" && id) {
        const appointmentData = {
          user: id,
          primaryPhysician: values.primaryPhysician,
          reason: values.reason!,
          schedule: new Date(values.schedule).toISOString(),
          appointmentStatus,
          note: values.note,
        };

        const appointment = await createAppointment(appointmentData);

console.log("✅ Oluşturulan Randevu:", appointment); // Strapi cevabını kontrol et

if (appointment && appointment.data) {
    const appointmentId = appointment.data.documentId; // ✅ Strapi'nin döndürdüğü ID
    console.log("✅ Strapi'den dönen ID:", appointmentId); // 🔴 Hangi ID geldiğini kontrol et

    await new Promise((resolve) => setTimeout(resolve, 1000)); 


    form.reset();
    router.push(
      `/patients/${id}/new-appointment/success?appointmentId=${appointmentId}`
    );
} else {
    console.error("❌ Strapi'den dönen randevu verisi eksik!", appointment);
}

      } else{
        const appointmentToUpdate ={
          id,
          appointmentId: appointment?.documentId!,
          appointment: {
            primaryPhysician: values?.primaryPhysician,
            schedule: new Date(values?.schedule).toISOString(),
            appointmentStatus: appointmentStatus as appointmentStatus,
            cancellationReason: values?.cancellationReason,
          },
          type
        }

        const updatedAppointment = await updateAppointment(appointmentToUpdate);

        if(updatedAppointment) {
          setOpen && setOpen(false);
          form.reset();
          router.refresh(); // ✅ Sayfayı otomatik olarak yenile
        }
      } 
    } catch (error) {
      console.log(error);
    }
  }

  let buttonLabel;

  switch (type) {
    case "cancel":
      buttonLabel = "Cancel Appointment";
      break;
    case "create":
      buttonLabel = "Schedule Appointment";
      break;
    case "schedule":
      buttonLabel = "Schedule Appointment";
      break;
    default:
      break;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex-1 ">
       {type === 'create' &&  <section className="mb-12 space-y-4 ">
          <h1 className=" text-white header">New Appointment</h1>
          <p className="text-dark-700">
            Request a new appointment in 10 seconds
          </p>
        </section>}

        {type !== "cancel" && (
          <>
            <CustomFormField
              fieldType={FormFieldType.SELECT}
              control={form.control}
              name="primaryPhysician"
              label="Doctor"
              placeholder="Select a Doctor"
            >
              {Doctors.map((doctor) => (
                <SelectItem key={doctor.name} value={doctor.name}>
                  <div className="flex cursor-pointer items-center gap-2">
                    <Image
                      src={doctor.image}
                      alt={doctor.name}
                      width={32}
                      height={32}
                      className="rounded-full border border-dark-500"
                    />
                    <p className="text-white">{doctor.name}</p>
                  </div>
                </SelectItem>
              ))}
            </CustomFormField>

            <CustomFormField
              fieldType={FormFieldType.DATE_PICKER}
              control={form.control}
              name="schedule"
              label="Expected appointment date"
              showTimeSelect
              dateFormat="MM/dd/yyyy - h:mm aa"
            />

            <div className="flex flex-col gap-6 xl:flex-row">
              <CustomFormField
                fieldType={FormFieldType.TEXTAREA}
                control={form.control}
                name="reason"
                label="Reason for appointment"
                placeholder="Enter reason for appointment"
              />
              <CustomFormField
                fieldType={FormFieldType.TEXTAREA}
                control={form.control}
                name="note"
                label="Notes"
                placeholder="Enter notes "
              />
            </div>
          </>
        )}

        {type === "cancel" && (
          <CustomFormField
            fieldType={FormFieldType.TEXTAREA}
            control={form.control}
            name="cancellationReason"
            label="Reason for cancellation"
            placeholder="Enter reason for cancellation "
          />
        )}
        <SubmitButton
          isLoading={isLoading}
          className={`${
            type === "cancel" ? "shad-danger-btn" : "shad-primary-btn"
          } w-full`}
        >
          {buttonLabel}
        </SubmitButton>
      </form>
    </Form>
  );
};

export default AppointmentForm;
