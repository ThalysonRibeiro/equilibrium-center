"use client";

import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Prisma } from "@/generated/prisma";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { StarRating } from "@/components/star-rating";
import { UserWithAssessment } from "@/app/(panel)/dashboard/profile/_components/assessment-content";
import { Edit } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CardAssessmentsProps {
  user: UserWithAssessment | null;
  edit: boolean;
  editAssessment: Dispatch<SetStateAction<boolean>>;
  // editAssessment?: (value: boolean | ((prev: boolean) => boolean)) => void;
  timeRemaining: string | null
}

export function CardAssessments({ user, edit, editAssessment, timeRemaining }: CardAssessmentsProps) {
  function toggleEdit() {
    if (editAssessment) {
      editAssessment(prev => !prev); // Ou false se for um toggle
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex lg:items-center flex-col lg:flex-row md:justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="w-10 h-10">
              <AvatarImage src={user?.image ?? ""} />
              <AvatarFallback>
                {user?.name?.split(" ")[0]?.[0]}
                {user?.name?.split(" ")[1]?.[0]}
              </AvatarFallback>
            </Avatar>
            {user?.name}
          </div>
          {!edit && timeRemaining && (
            <p className="text-sm text-gray-500">
              Você pode editar sua avaliação em {timeRemaining}.
            </p>
          )}

          {edit && (
            <Button variant={"ghost"} onClick={toggleEdit}>
              Editar <Edit />
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p>&quot;{user?.assessments?.message}&quot;</p>
        <StarRating rating={user?.assessments?.rating ?? 0} />
      </CardContent>
    </Card>
  );
}
