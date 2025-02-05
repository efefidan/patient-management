import { StatusIcon } from '@/constants'
import clsx from 'clsx'
import Image from 'next/image'
import React from 'react'

const StatusBadge = ({appointmentStatus}: {appointmentStatus: appointmentStatus}) => {
  return (
    <div className={clsx('status-badge', {
        'bg-green-600': appointmentStatus === 'scheduled',
        'bg-blue-600': appointmentStatus === 'pending',
        'bg-red-600': appointmentStatus === 'cancelled',
    })}>
        <Image
        src={StatusIcon[appointmentStatus]}
        alt={appointmentStatus}
        width={24}
        height={24}
        className='h-fit w-3'
        />
        <p className={clsx('text-12-semibold capitalize', {
            'text-green-500': appointmentStatus === 'scheduled',
            'text-blue-500': appointmentStatus === 'pending',
            'text-red-500': appointmentStatus === 'cancelled',
        })}>{appointmentStatus}</p>
    </div>
  )
}

export default StatusBadge