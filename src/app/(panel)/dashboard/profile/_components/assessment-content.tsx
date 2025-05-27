"use client"
import { Prisma } from "@/generated/prisma";
import { Assessment } from "./assessment";
import { useEffect, useState } from "react";
import { CardAssessments } from "./card-assesssments";
import { EDIT_COOLDOWN_DAYS } from "../edit-cooldwn-days";

export type UserWithAssessment = Prisma.UserGetPayload<{
  include: {
    assessments: true, // single object
  }
}>

interface AssessmentContentProps {
  user: UserWithAssessment | null;
}


export function AssessmentContent({ user }: AssessmentContentProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [canEdit, setCanEdit] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<string | null>(null);

  useEffect(() => {
    const assessment = user?.assessments;

    if (!assessment) {
      setIsEditing(true); // no assessment yet
      return;
    }

    const now = new Date();
    const createdAt = new Date(assessment.createdAt);
    const diffMs = now.getTime() - createdAt.getTime();
    const cooldownMs = EDIT_COOLDOWN_DAYS * 24 * 60 * 60 * 1000;

    if (diffMs >= cooldownMs) {
      setCanEdit(true);
    } else {
      const remainingMs = cooldownMs - diffMs;

      const days = Math.floor(remainingMs / (1000 * 60 * 60 * 24));
      const hours = Math.floor((remainingMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((remainingMs % (1000 * 60 * 60)) / (1000 * 60));

      setTimeRemaining(
        `${days} dia${days !== 1 ? "s" : ""}, ${hours} hora${hours !== 1 ? "s" : ""}, ${minutes} minuto${minutes !== 1 ? "s" : ""}`
      );
    }
  }, [user]);

  return (
    <section className="space-y-4">
      {user?.assessments && (
        <>
          <CardAssessments
            user={user}
            edit={canEdit}
            editAssessment={setIsEditing}
            timeRemaining={timeRemaining}
          />
        </>
      )}

      {isEditing && (
        <Assessment
          user={user}
          editAssessment={setIsEditing}
        />
      )}
    </section>
  );
}
