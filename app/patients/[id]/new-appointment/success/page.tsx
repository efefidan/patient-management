import { Button } from '@/components/ui/button'
import { Doctors } from '@/constants'
import { getAppointment } from '@/lib/actions/appointment.actions'
import { formatDateTime } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const Success = async ({ params: { id }, searchParams }: SearchParamProps) => {
    const appointmentId = Array.isArray(searchParams?.appointmentId)
  ? searchParams.appointmentId[0] // Eğer dizi geldiyse ilk elemanı al
  : searchParams?.appointmentId || '';

  console.log("🔴 URL'den Gelen Appointment ID:", appointmentId);


if (!appointmentId) {
    console.error("❌ Appointment ID bulunamadı!");
    return <div className="text-red-500">Error: Appointment ID not found!</div>;
}


const appointment = await getAppointment(appointmentId);

await new Promise((resolve) => setTimeout(resolve, 1000)); // 1 saniye beklet


if (!appointment ) {
    console.error("❌ Randevu bilgisi eksik veya alınamadı:", appointment);
    return <div className="text-red-500">Error: Appointment data is missing!</div>;
}

console.log("🟢 Strapi'de Son Appointment ID:", appointment.id);



    const doctor = Doctors.find((doc) => doc.name === appointment.primaryPhysician);

  return (
    <div className='flex h-screen max-h-screen px[5%]'>
        <div className='success-img'>
            <Link href='/'>
                <Image 
                src="/assets/icons/logo-full.svg"
                height={1000}
                width={1000}
                alt='logo'
                className='h-10 w-fit'/>
            </Link>

            <section className='flex flex-col items-center'>
                <Image
                src="/assets/gifs/success.gif"
                height={300}
                width={280}
                alt='success'/>
              <h2 className='text-white header mb-6 max-w-[600px] text-center'>
                Your <span className='text-green-500'>appointment request</span> has been successfully submitted!
            </h2>
            <p className='text-white'>We will be in touch shortly to confirm</p>  
            </section>

            <section className='request-details'>
                <p className='text-white'>Requested appointment details:Ş</p>
                <div className='flex items-center gap-3'>
                    <Image
                    src={doctor?.image!}
                    alt='doctor'
                    width={100}
                    height={100}
                    className='size-6'/>
                    <p className='whitespace-nowrap'>Dr. {doctor?.name}</p>
                </div>
                <div className='flex gap-2'>
                    <Image
                    src="assets/icons/calendar.svg"
                    height={24}
                    width={24}
                    alt='calendar'/>
                </div>
                <p>{formatDateTime(appointment.schedule).dateTime}</p>
            </section>

            <Button variant="outline" className='text-white shad-primary-btn' asChild >
                <Link href={`patients/${id}/new-appointment`}>
                    New Appointment
                </Link>
            </Button>

            <p className='copyright text-white'>2024</p>
        </div>
    </div>
  )
}

export default Success