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

  return (
    <>
      <DialogHeader className="text-primary">
        <DialogTitle className="font-montserrat">Novo Servoço</DialogTitle>
        <DialogDescription>
          Adicione um serviço
        </DialogDescription>
      </DialogHeader>

      <Form {...form}>
        <form
          className="space-y-2 text-primary"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <div className="flex flex-col">

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="my-2">
                  <FormLabel>
                    Nome do serviço
                  </FormLabel>
                  <FormControl>
                    <Input {...field}
                      placeholder="Digite o nome do seviço..."
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem className="my-2">
                  <FormLabel>
                    Nome do serviço
                  </FormLabel>
                  <FormControl>
                    <Input {...field}
                      onChange={changeCurrency}
                      placeholder="Ex: 120,00"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

          </div>
          <p className="font-semibold">Tempo de duração do serviço</p>
          <div className="grid grid-cols-2 gap-3">
            <FormField
              control={form.control}
              name="hours"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Horas
                  </FormLabel>
                  <FormControl>
                    <Input {...field}
                      placeholder="1"
                      min={0}
                      type="number"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="minutes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Horas
                  </FormLabel>
                  <FormControl>
                    <Input {...field}
                      placeholder="0"
                      min={0}
                      type="number"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button
            disabled={loading}
            type="submit"
            className=" hover:bg-accent w-full"
          >
            {loading ?
              <div className="w-6 h-6 border-2 border-t-2 border-gray-300 border-t-corsecondary rounded-full animate-spin" />
              : `${serviceId ? "Atualizar serviço" : "Cadastrar serviço"}`}

          </Button>

        </form>
      </Form>
    </>
  )
}