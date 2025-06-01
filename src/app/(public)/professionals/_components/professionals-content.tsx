import { Prisma, User } from "@/generated/prisma";
import { FeaturedProfessional } from "./featured-professional";
import { GridProfessionals } from "./professionals";

export type UserWithServiceAndSubscription = Prisma.UserGetPayload<{
  include: {
    service: {
      select: {
        name: true
      }
    }
  };
}>;

export interface ProfessionalsProps {
  professionals: UserWithServiceAndSubscription[];
}

export async function ProfessionalsContent({ professionals }: ProfessionalsProps) {
  return (
    <section>
      <FeaturedProfessional professionals={professionals || []} />
      <GridProfessionals professionals={professionals || []} />
    </section>
  )
}