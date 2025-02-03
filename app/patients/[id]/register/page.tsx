"use client"
import Image from 'next/image'
import Link from 'next/link';
import React from 'react'
import RegisterForm from "@/components/forms/RegisterForm"
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getUser } from '@/lib/actions/patient.actions';

const Register = () => {
    const params = useParams();
    const [user, setUser] = useState<User | null>(null);
    const id = params?.id ? String(params.id) : null; // `id` yüklenmeden önce hata olmaması için

    useEffect(() => {
        if (id) {
            getUser(id).then(setUser).catch(console.error);
        }
    }, [id]);

    if (!id || !user) return <p>Loading...</p>;
  
    return (
        <div className="flex h-screen max-h-screen">
          <section className="remove-scrollbar container ">
            <div className="sub-container max-w-[860px] flex-1 fle-col py-10">
              <Image
              src="/assets/icons/logo-full.svg"
              height={1000}
              width={1000}
              alt="patient"
              className="mb-12 h-10 w-fit"
              />
             
    
              <RegisterForm user={user} />
              <p className="copyright py-12">copyright 2024</p>
            
            </div>
          </section>
    
          <Image
              src="/assets/images/register-img.png"
              height={1000}
              width={1000}
              alt="patient"
              className="side-img max-w-[390px]"
              /> 
        </div>
      );
}

export default Register