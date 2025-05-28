"use server"

import prisma from "@/lib/prisma";

export async function getTestimonials() {
  try {
    const testimonials = await prisma.assessments.findMany({
      include: {
        user: true
      }
    });

    return testimonials;

  } catch (error) {
    return [];
  }
}