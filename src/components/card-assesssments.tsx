"use client";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';
import { Prisma } from "@/generated/prisma";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DoubleQuotes } from "./double-quotes";
import { useIsMobile } from '@/app/hooks/useMobile';

type Assessments = Prisma.AssessmentsGetPayload<{
  include: {
    user: true
  }
}>;

interface CardAssessmentsProps {
  testimonials: Assessments[];
  starGroup: number;
  endGroup: number;
  reverse: boolean;
}

function getInitials(name?: string) {
  if (!name) return '';
  const parts = name.split(" ");
  return `${parts[0]?.[0] ?? ''}${parts[1]?.[0] ?? ''}`;
}

export function CardAssessments({ testimonials, starGroup, endGroup, reverse }: CardAssessmentsProps) {
  const selectedTestimonials = testimonials.slice(starGroup, endGroup);
  const isLg = useIsMobile(960);
  const isMobile = useIsMobile();

  let responsive = 3;
  let between = 30;

  if (isMobile) {
    responsive = 1;
    between = 0;
  } else if (isLg) {
    responsive = 2;
    between = 10;
  }

  return (
    <Swiper
      spaceBetween={between}
      slidesPerView={responsive}
      loop={true}
      modules={[Autoplay]}
      autoplay={{
        delay: 5500,
        disableOnInteraction: false,
        pauseOnMouseEnter: true,
        reverseDirection: reverse,
      }}
      className="w-full"
    >
      {selectedTestimonials.map(testimonial => (
        <SwiperSlide key={testimonial.id}>
          <Card className='h-70 flex flex-col justify-between'>
            <CardHeader>
              <CardTitle>
                <DoubleQuotes />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className='line-clamp-5 text-sm'>{testimonial.message}</p>
            </CardContent>
            <CardFooter>
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={testimonial.user.image ?? ""} />
                  <AvatarFallback>{getInitials(testimonial.user.name ?? "")}</AvatarFallback>
                </Avatar>
                <p className='font-semibold capitalize'>
                  {testimonial.user.name}
                </p>
              </div>
            </CardFooter>
          </Card>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
