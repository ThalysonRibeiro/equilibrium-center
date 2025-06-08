"use client"

import { DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { DialogServiceFormData, UseeDialogServiceForm } from "./dialog-service-form"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createNewService } from "../_actions/create-service";
import { toast } from "sonner";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateService } from "../_actions/update-service";

interface DialogServicProps {
  closeModal: () => void;
  serviceId?: string;
  initialValues?: {
    name: string;
    price: string;
    hours: string;
    minutes: string;
  }
}

export function DialogService({ closeModal, initialValues, serviceId }: DialogServicProps) {
  const form = UseeDialogServiceForm({ initialValues: initialValues });
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);

  async function onSubmit(values: DialogServiceFormData) {
    setLoading(true);
    const hours = parseInt(values.hours) || 0;
    const minutes = parseInt(values.minutes) || 0;

    const duration = (hours * 60) + minutes;

    if (serviceId) {
      await editServiceById({
        serviceId: serviceId,
        name: values.name,
        price: values.price,
        duration: duration
      });
      setLoading(false);
      return;
    }

    const response = await createNewService({
      name: values.name,
      price: values.price,
      duration: duration,
    });
    setLoading(false);

    if (response.error) {
      toast.error(response.error);
      return;
    }

    toast.success("Serviço cadastrado com sucesso!");
    handleCloseModal();
    router.refresh();
  }

  async function editServiceById(
    {
      duration,
      name,
      price,
      serviceId
    }: {
      serviceId: string,
      name: string,
      price: string,
      duration: number,
    }
  ) {
    const response = await updateService({
      serviceId: serviceId,
      name: name,
      price: price,
      duration: duration
    });

    setLoading(false);

    if (response.error) {
      toast.error(response.error);
      return;
    }

    toast.success(response.data);
    handleCloseModal();

  }

  function handleCloseModal() {
    form.reset();
    closeModal();
  }

  function changeCurrency(event: React.ChangeEvent<HTMLInputElement>) {
    let { value } = event.target;
    value = value.replace(/\D/g, '');
    if (value) {
      value = (parseInt(value, 10) / 100).toFixed(2);
      value = value.replace('.', ',')
      value = value.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    }
    event.target.value = value;
    form.setValue("price", value)
  }

  const isEditing = Boolean(serviceId);
  const submitButtonText = isEditing ? "Atualizar serviço" : "Cadastrar serviço";
  const dialogTitle = isEditing ? "Editar Serviço" : "Novo Serviço";

  return (
    <>
      <DialogHeader>
        <DialogTitle className="font-montserrat">
          {dialogTitle}
        </DialogTitle>
        <DialogDescription>
          {isEditing ? "Edite as informações do serviço" : "Adicione um novo serviço"}
        </DialogDescription>
      </DialogHeader>

      <Form {...form}>
        <form
          className="space-y-2"
          onSubmit={form.handleSubmit(onSubmit)}
          role="form"
          aria-label={`Formulário para ${isEditing ? 'editar' : 'cadastrar'} serviço`}
        >
          <div className="flex flex-col">

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="my-2">
                  <FormLabel htmlFor="service-name">
                    Nome do serviço
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      id="service-name"
                      placeholder="Digite o nome do serviço..."
                      aria-describedby="service-name-error"
                      aria-required="true"
                    />
                  </FormControl>
                  <FormMessage id="service-name-error" role="alert" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem className="my-2">
                  <FormLabel htmlFor="service-price">
                    Preço do serviço
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      id="service-price"
                      onChange={changeCurrency}
                      placeholder="Ex: 120,00"
                      aria-describedby="service-price-error service-price-help"
                      aria-required="true"
                    />
                  </FormControl>
                  <div id="service-price-help" className="sr-only">
                    Digite o preço no formato brasileiro, exemplo: 120,00
                  </div>
                  <FormMessage id="service-price-error" role="alert" />
                </FormItem>
              )}
            />

          </div>

          <fieldset className="border-0 p-0">
            <legend className="font-semibold text-sm mb-2">
              Tempo de duração do serviço
            </legend>
            <div className="grid grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="hours"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="service-hours">
                      Horas
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        id="service-hours"
                        placeholder="1"
                        min={0}
                        max={23}
                        type="number"
                        aria-describedby="service-hours-error"
                        aria-label="Horas de duração do serviço"
                      />
                    </FormControl>
                    <FormMessage id="service-hours-error" role="alert" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="minutes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="service-minutes">
                      Minutos
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        id="service-minutes"
                        placeholder="0"
                        min={0}
                        max={59}
                        step={5}
                        type="number"
                        aria-describedby="service-minutes-error"
                        aria-label="Minutos de duração do serviço"
                      />
                    </FormControl>
                    <FormMessage id="service-minutes-error" role="alert" />
                  </FormItem>
                )}
              />
            </div>
          </fieldset>

          <Button
            disabled={loading}
            type="submit"
            className="hover:bg-accent w-full"
            aria-describedby={loading ? "loading-message" : undefined}
          >
            {loading ? (
              <>
                <div
                  className="w-6 h-6 border-2 border-t-2 border-gray-300 rounded-full animate-spin mr-2"
                  aria-hidden="true"
                />
                <span className="sr-only" id="loading-message">
                  Processando...
                </span>
                {submitButtonText}
              </>
            ) : (
              submitButtonText
            )}
          </Button>

        </form>
      </Form>
    </>
  )
}