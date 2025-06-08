"use client";

import { Dispatch, SetStateAction } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { StarRating } from "@/components/star-rating";
import { UserWithAssessment } from "@/app/(panel)/dashboard/profile/_components/assessment-content";
import { Edit } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CardAssessmentsProps {
  user: UserWithAssessment | null;
  edit: boolean;
  editAssessment: Dispatch<SetStateAction<boolean>>;
  timeRemaining: string | null;
}

export function CardAssessments({
  user,
  edit,
  editAssessment,
  timeRemaining
}: CardAssessmentsProps) {
  function toggleEdit() {
    if (editAssessment) {
      editAssessment(prev => !prev);
    }
  }

  const firstInitial = user?.name?.split(" ")[0]?.[0] ?? "";
  const secondInitial = user?.name?.split(" ")[1]?.[0] ?? "";

  return (
    <Card role="region" aria-label={`Avaliação de ${user?.name}`}>
      <CardHeader>
        <CardTitle className="flex lg:items-center flex-col lg:flex-row md:justify-between gap-2">
          <div className="flex items-center gap-3">
            <Avatar className="w-10 h-10">
              <AvatarImage
                src={user?.image ?? ""}
                alt={`Foto de ${user?.name ?? "usuário"}`}
              />
              <AvatarFallback aria-hidden="true">
                {firstInitial}
                {secondInitial}
              </AvatarFallback>
            </Avatar>
            <span className="font-medium" aria-label={`Nome do usuário: ${user?.name}`}>
              {user?.name}
            </span>
          </div>

          {!edit && timeRemaining && (
            <p
              className="text-sm text-gray-500"
              aria-live="polite"
              aria-label={`Você poderá editar sua avaliação em ${timeRemaining}`}
            >
              Você poderá editar sua avaliação em {timeRemaining}.
            </p>
          )}

          {edit && (
            <Button
              variant="ghost"
              onClick={toggleEdit}
              aria-label="Editar avaliação"
            >
              Editar <Edit aria-hidden="true" />
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <blockquote
          className="italic mb-2"
          aria-label={`Comentário da avaliação: ${user?.assessments?.message}`}
        >
          “{user?.assessments?.message}”
        </blockquote>
        <StarRating rating={user?.assessments?.rating ?? 0} />
      </CardContent>
    </Card>
  );
}
