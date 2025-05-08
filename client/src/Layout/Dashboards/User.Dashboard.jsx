import { Button } from '@/components/ui/button'
import { Newspaper } from 'lucide-react'
import { UserSquare } from 'lucide-react'
import { Users2 } from 'lucide-react'
import { Calendar } from 'lucide-react'
import { Book } from 'lucide-react'
import React from 'react'

const UserDashboard = () => {
  const dashboardData = [
    {
      title: "Enrolled Courses",
      value: 12,
      icon: <Book className='w-5 h-5' />,
      background: "bg-[#086498]",
    },
    {
      title: "Latest Jobs",
      value: 8,
      icon: <Newspaper className='w-5 h-5' />,
      background: "bg-[goldenrod]",
    },
    {
      title: "Connections/Friends",
      value: 3,
      icon: <UserSquare className='w-5 h-5' />,
      background: "bg-[orange]",
    },
    {
      title: "Upcoming Events",
      value: 2,
      icon: <Calendar className='w-5 h-5' />,
      background: "bg-[black]",
    },
  ]
  return (
    <div className='md:p-6'>
      <div className="w-full flex flex-col lg:flex gap-2">
        <div className="border bg-white relative w-full lg:w-[100%] rounded-lg p-4 md:p-0">
          <div className="h-full flex flex-col justify-center items-start p-4 md:pl-5 z-10">
            <h1 className='text-lg sm:text-xl md:text-2xl max-w-[500px]'>
              Elevate Your Experience Through Our Online Education!
            </h1>
            <p className='mt-3 md:mt-5 text-gray-500 max-w-[500px] text-sm md:text-base'>
              Empower yourself with our comprehensive courses designed to hone and refine your skills!
            </p>
            <Button className={
              "w-full sm:w-[300px] mt-4 md:mt-6 h-10 md:h-12 uppercase bg-[#eee] cursor-pointer text-black border border-gray-200 hover:bg-[#eee] hover:text-black rounded-md"
            }>
              Let's Start
            </Button>
          </div>
          <img 
            src="/banner.png" 
            className='hidden md:block w-[250px] md:w-[350px] lg:w-[400px] h-[150px] md:h-[200px] lg:h-[250px] absolute bottom-0 right-0' 
            alt="Education banner" 
          />
        </div>
        <div className='w-full lg:w-[100%] grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-2'>
          {dashboardData.map((item) => (
            <div key={item} className='rounded-lg border bg-white p-4 flex justify-between items-center h-24 md:h-28'>
              <div className="flex flex-col">
                <h1 className='text-sm md:text-base'>{item?.title}</h1>
                <span className='text-[30px] pl-5 font-bold mt-1'>{item?.value}</span>
              </div>
              <div className={`flex justify-center items-center p-5 ${item?.background} text-white rounded-lg`}>
                {item?.icon}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default UserDashboard