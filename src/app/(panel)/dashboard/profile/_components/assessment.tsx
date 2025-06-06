"use client"
import {
  Card,
  CardContent,
  CardDescription, CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import StarRating from "./starRating";
import { Button } from "@/components/ui/button";
import { Dispatch, SetStateAction, useState } from "react";
import { AssessmentFormData, useAssessmentForm } from "./assessment-form";
import { createNewAssessment } from "../_actions/create-assessment";
import { toast } from "sonner";
import { UserWithAssessment } from "./assessment-content";
import { updateAssessment } from "../_actions/update-assessment";



interface AssessmentProps {
  user: UserWithAssessment | null;
  editAssessment?: Dispatch<SetStateAction<boolean>>;
}

export function Assessment({ user, editAssessment }: AssessmentProps) {
  const [loading, setLoading] = useState<boolean>(false);

  const [assessment, setAssessment] = useState<{
    rating: number;
    message: string;
  }>({
    rating: user?.assessments?.rating || 0,
    message: user?.assessments?.message || "",
  });

  // setAssessment(prev => ({ ...prev, rating: newRating }));
  // setAssessment(prev => ({ ...prev, message: newMessage }));

  const form = useAssessmentForm({
    defaultValues: {
      message: assessment.message,
      rating: assessment.rating
    }
  })

  async function onSubmit(values: AssessmentFormData) {

    if (user?.assessments) {
      await onUpdate({
        message: values.message || assessment.message,
        rating: values.rating || assessment.rating
      });
      setLoading(false);
      return;
    }

    const response = await createNewAssessment({
      message: values.message,
      rating: values.rating,
    });

    if (response.error) {
      toast.error(response.error, { closeButton: true });
      return;
    }

    toast.success(response.data);
    form.reset();
    handleClose()
  }
  async function onUpdate({ message, rating }: { message: string, rating: number }) {
    const response = await updateAssessment({
      message: message || assessment.message,
      rating: rating || assessment.rating,
    });

    if (response.error) {
      toast.error(response.error, { closeButton: true });
      return;
    }

    toast.success(response.data);
    form.reset();
    handleClose();
  }

  function handleClose() {
    form.reset();
    if (editAssessment) {
      editAssessment(prev => !prev); // Ou false se for um toggle
    }
  }

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>
            {user?.assessments ? "Atualizar avaliação" : "Deixe sua avaliação"}
          </CardTitle>
          <CardDescription>
            Sua opinião é importante! Avalie sua experiência com o site e nos ajude a melhorar.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form className="space-y-2" onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Digite sua mensagem aqui."
                        className="max-h-52 h-35"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="rating"
                render={({ field }) => {
                  function handleValue(value: number) {
                    return field.onChange(value)
                  }
                  return (
                    <FormItem>
                      <FormControl>
                        <StarRating
                          onValorChange={handleValue}
                          ratingValue={field.value}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )
                }}
              />
              <Button
                className="w-full hover:bg-accent"
                type="submit"
                disabled={!form.watch("message")}
              >
                {loading ?
                  <div className="w-6 h-6 border-2 border-t-2 border-gray-300 rounded-full animate-spin" />
                  : `${user?.assessments ? "Atualizar avaliação" : "Enviar avaliação"}`}
              </Button>
            </form>

          </Form>
        </CardContent>
      </Card>

    </div>
  )
}