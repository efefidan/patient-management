"use client"
import axios from "axios";
import { API_ROUTES, STRAPI_BASE_URL } from "@/lib/strapi.config";
import { convertFileToUrl } from '@/lib/utils'
import Image from 'next/image'
import React, {useCallback} from 'react'
import {useDropzone} from 'react-dropzone'

type FileUploaderProps = {
    files: File[] | undefined,
    onChange: (files: File[]) => void,
}

const FileUploader = ({files, onChange}:
    FileUploaderProps) => {
      const onDrop = useCallback(async (acceptedFiles: File[]) => {
        console.log("✅ onChange fonksiyonu çağrılıyor...", acceptedFiles);
    
        if (!acceptedFiles || acceptedFiles.length === 0) {
            console.error("❌ Hata: Dropzone'a yüklenen dosya geçersiz!");
            return;
        }
    
        // 📌 Dosyayı Strapi'ye yükle ve ID'sini al
        const formData = new FormData();
        formData.append("files", acceptedFiles[0]); // İlk dosyayı alıyoruz
    
        try {
            const uploadResponse = await axios.post(`${STRAPI_BASE_URL}/api/upload`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_API_TOKEN}`,
                },
            });
    
            console.log("✅ Strapi'ye Yüklenen Dosyanın ID'si:", uploadResponse.data[0].id);
            onChange([uploadResponse.data[0].id]); // ✅ Kullanıcıya ID'yi kaydediyoruz
        } catch (error) {
            console.error("❌ Dosya yükleme hatası:", error);
        }    onChange(acceptedFiles);

    }, [onChange]);
    
      
  const {getRootProps, getInputProps, isDragActive} = useDropzone({
    onDrop,
    onError: (err) => console.error("⚠️ Dropzone Hatası:", err),
    accept: { 'image/*': [] }, // Sadece resim formatlarını kabul et
    multiple: false, // Tek bir dosya yüklemeye izin ver
  });
  
  return (
    <div {...getRootProps()} className='file-upload'>
      <input {...getInputProps()} />
      {files && files.length > 0 && files[0] instanceof File ? (
    <Image src={convertFileToUrl(files[0])} width={1000} height={1000} alt='uploaded image' />
)  : (
        <>
        <Image
        src="/assets/icons/upload.svg"
        width={40}
        height={40}
        alt='upload'/>
        <div className='file-upload_label'>
            <p className='text-14-regular'>
                <span className='text-green-500'> Click to upload</span> or drag and drop
            </p>
            <p>
                SVG, PNG, JPG or Gif (max 800x400)
            </p>
        </div>
        </>
      )}
    </div>
  )
}

export default FileUploader