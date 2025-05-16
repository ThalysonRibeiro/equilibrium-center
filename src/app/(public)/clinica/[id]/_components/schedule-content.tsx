"use client"

import Image from "next/image"
import img_test from "@/assets/img-hero.jpg"
import { MapPin } from "lucide-react"
import { Prisma } from "@/generated/prisma"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { AppoitmentFormData, useAppoitmentForm } from "./schedule-form"
import { Input } from "@/components/ui/input"
import { formatPhone } from "@/utils/fomatPhone"
import { DateTimePicker } from "./date-picker"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { useCallback, useEffect, useState } from "react"
import { Label } from "@/components/ui/label"
import { ScheduleTimeList } from "./schedule-time-list"
import { createNewAppointment } from "../_actions/create-appointment"
import { toast } from "sonner"

type UserWithServiceAndSubscription = Prisma.UserGetPayload<{
  include: {
    subscription: true;
    service: true;
    times: true;
  };
}>;

// // Ajustar a tipagem apenas dos serviços
type ServiceWithStringPrice = Omit<UserWithServiceAndSubscription["service"][0], "price"> & {
  price: string;
};

// Substituir o array de serviços pela versão com `price` como string
type UserWithConvertedService = Omit<UserWithServiceAndSubscription, "service"> & {
  service: ServiceWithStringPrice[];
};

// Agora, use este tipo na sua interface
interface ScheduleContentProps {
  clinic: UserWithConvertedService;
}

export interface TimeSlot {
  time: string;
  available: boolean;
}

export function ScheduleContent({ clinic }: ScheduleContentProps) {
  const form = useAppoitmentForm();
  const { watch } = form;


  const selectedDate = watch("date")
  const selectedServiceId = watch("serviceId")

  const [selectedTime, setSelectedTime] = useState("");
  const [availableTimeSlots, setAvailableTimeSlots] = useState<TimeSlot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  // Quais os horários bloqueados 01/02/2025 > ["15:00", "18:00"]
  const [blockedTimes, setBlockedTimes] = useState<string[]>([])


  // Função que busca os horários bloqueados (via Fetch HTTP)
  const fetchBlockedTimes = useCallback(async (date: Date): Promise<string[]> => {
    setLoadingSlots(true);
    try {
      const dateString = date.toISOString().split("T")[0]
      const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/schedule/get-appointments?userId=${clinic.id}&date=${dateString}`)

      const json = await response.json();
      setLoadingSlots(false);
      return json; // Retornar o array com horarios que já tem bloqueado desse Dia e dessa clinica.


    } catch (err) {
      console.log(err)
      setLoadingSlots(false);
      return [];
    }
  }, [clinic.id])


  useEffect(() => {

    if (selectedDate) {
      fetchBlockedTimes(selectedDate).then((blocked) => {
        setBlockedTimes(blocked)

        const times = clinic.times || [];

        const finalSlots = times.map((time) => ({
          time: time,
          available: !blocked.includes(time)
        }));

        setAvailableTimeSlots(finalSlots);

        const stilAvailable = finalSlots.find(
          (slot) => slot.time === selectedTime && slot.available
        );
        if (!stilAvailable) {
          setSelectedTime("");
        }

      })
    }

  }, [selectedDate, clinic.times, fetchBlockedTimes, selectedTime])


  async function handleRegisterAppointmnent(formData: AppoitmentFormData) {
    if (!selectedTime) {
      return;
    }

    const response = await createNewAppointment({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      time: selectedTime,
      date: formData.date,
      serviceId: formData.serviceId,
      clinicId: clinic.id
    });

    if (response.error) {
      toast.error(response.error)
      return;
    }

    toast.success("Massagem agendanda com sucesso");
    form.reset();
    setSelectedTime("");
  }

  return (
    <div className="min-h-screen flex flex-col text-primary mb-6">
      <div className="h-32 bg-primary" />

      <section className="container mx-auto px-4 -mt-20">
        <div className="max-w-2xl mx-auto">
          <article className="flex flex-col items-center">
            <div className="relative w-48 h-48 rounded-full overflow-hidden border-4">
              <Image
                src={clinic.image ? clinic.image : img_test}
                alt="foto da clinica"
                fill
                className="object-cover"
              />
            </div>

            <h1 className="text-2xl font-montserrat">
              {clinic.name}
            </h1>
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="w-5 h-5" />
              <span>
                {clinic.address ? clinic.address : "Endereço não informado"}
              </span>
            </div>
          </article>
        </div>
      </section>

      {/* form */}
      <section className="max-w-2xl mx-auto w-full mt-6">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleRegisterAppointmnent)}
            className="mx-4 space-y-6 bg-white p-6 rounded-md border"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="my-2">
                  <FormLabel>Nome completo</FormLabel>
                  <FormControl>
                    <Input
                      id="name"
                      placeholder="Digite seu nome completo..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="my-2">
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      id="email"
                      placeholder="Digite seu email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem className="my-2">
                  <FormLabel>Telefone</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      id="phone"
                      placeholder="(00) 00000-0000"
                      onChange={(e) => {
                        const formattedValue = formatPhone(e.target.value);
                        field.onChange(formattedValue)
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex items-center gap-2 space-y-1">
                  <FormLabel>Data do agendamento</FormLabel>
                  <FormControl>
                    <DateTimePicker
                      initialDate={new Date()}
                      className="w-full rounded border p-2"
                      onChange={(date) => {
                        if (date) {
                          field.onChange(date)
                          setSelectedTime("");
                        }
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="serviceId"
              render={({ field }) => (
                <FormItem className="">
                  <FormLabel>Selecione o serviço</FormLabel>
                  <FormControl>
                    <Select onValueChange={(value) => {
                      field.onChange(value)
                      setSelectedTime("");
                    }}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um serviço" />
                      </SelectTrigger>
                      <SelectContent>
                        {clinic.service.map(service => (
                          <SelectItem key={service.id} value={service.id}>
                            {service.name} ({Math.floor(service.duration / 60)}h {service.duration % 60}min)
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {selectedServiceId && (
              <div className="space-y-2">
                <Label>Horários disponíeis</Label>
                <div className="bg-gray-100 p-2 rounded-md border">
                  {loadingSlots ? (
                    <div className="flex items-center justify-center">
                      <div className="w-12 h-12 border-4 border-t-4 border-gray-300 border-t-accent rounded-full animate-spin" />
                    </div>
                  ) : availableTimeSlots.length === 0 ? (
                    <p>Nenhum horário disponivel</p>
                  ) : (
                    <ScheduleTimeList
                      onSelecTime={(time) => setSelectedTime(time)}
                      clinicTimes={clinic.times}
                      blockedTimes={blockedTimes}
                      availableTimeSlots={availableTimeSlots}
                      selectedTime={selectedTime}
                      selectedDate={selectedDate}
                      requiredSlots={
                        clinic.service.find(serv => serv.id === selectedServiceId)
                          ? Math.ceil(clinic.service.find(serv => serv.id === selectedServiceId)!.duration / 30)
                          : 1
                      }
                    />
                  )}
                </div>
              </div>
            )}

            {clinic.status ? (
              <Button
                className="hover:bg-accent w-full"
                disabled={
                  !watch("name") ||
                  !watch("email") ||
                  !watch("phone") ||
                  !watch("date")
                }
              >
                Realizar agendamento
              </Button>
            ) : (
              <p className="bg-red-500 text-white rounded-md text-center px-4 py-2">
                A clinica está fechada nesse momento
              </p>
            )}

          </form>
        </Form>
      </section>

    </div>
  )
}