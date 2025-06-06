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
import { LoadingUI } from "@/components/ui/loading-ui"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import img_bg from "@/assets/bg-3.png";

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

  function calculateAge(nascimento: Date): number {
    const today = new Date();
    let theAge = today.getFullYear() - nascimento.getFullYear();
    const month = today.getMonth() - nascimento.getMonth();

    if (month < 0 || (month === 0 && today.getDate() < nascimento.getDate())) {
      theAge--;
    }

    return theAge < 0 ? 0 : theAge;
  }

  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === 'dateOfBirth' && value.dateOfBirth) {
        const theDateOfBirth = new Date(value.dateOfBirth);
        const ageCalculated = calculateAge(theDateOfBirth);

        form.setValue('age', ageCalculated);
      }
    });

    return () => subscription.unsubscribe();
  }, [form]);

  async function handleRegisterAppointmnent(formData: AppoitmentFormData) {
    if (!selectedTime) {
      return;
    }

    const useOfAnyMedication = formData?.useOfAnyMedication === "yes" ? true : false;
    const bePregnant = formData?.bePregnant === "yes" ? true : false;
    const eatingRoutine = formData?.eatingRoutine === "yes" ? true : false;

    const response = await createNewAppointment({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      age: formData.age,
      dateOfBirth: formData.dateOfBirth,
      symptoms: formData.symptoms,
      secondary: formData.secondary,
      complaints: formData.complaints,
      useOfAnyMedication: useOfAnyMedication,
      bePregnant: bePregnant,
      eatingRoutine: eatingRoutine,
      physicalActivities: formData.physicalActivities,
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

      <section className="w-full h-80 flex items-center justify-center mx-auto px-4 relative inset-0">
        <div className="h-80 -z-[1] bg-gradient-to-br from-teal-300/80 to-teal-500/80 shadow absolute inset-0" />

        <Image
          className="object-cover absolute w-full h-80 -z-[2] inset-0"
          src={clinic.image ? clinic.image : img_test}
          alt="imagem de fundo da clinica"
          width={1280}
          height={280}
        />
        <div className="max-w-2xl mx-auto">
          <article className="flex flex-col items-center gap-2">
            <div className="relative w-32 h-32 rounded-full overflow-hidden border-2 border-white">
              <Image
                src={clinic.image ? clinic.image : img_test}
                alt="foto da clinica"
                fill
                className="object-cover"
              />
            </div>

            <h1 className="text-4xl text-white  font-semibold">
              {clinic.name}
            </h1>
            <h2 className="text-center text-sm text-white line-clamp-2">{clinic.description}</h2>
            <div className="mb-2">
              <span className="text-white flex">
                <MapPin className="w-5 h-5" />
                {clinic.address ? clinic.address : "Endereço não informado"}
                {clinic.number ? `, nº ${clinic.number}` : ""}
                {clinic.city && clinic.state ? ` - ${clinic.city}-${clinic.state}` : ""}
                {clinic.cep ? `, CEP ${clinic.cep}` : ""}
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
            <h3 className="font-semibold text-lg text-center">
              Informações pessoais
            </h3>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="my-2">
                    <FormLabel>Nome completo*</FormLabel>
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
                    <FormLabel>Email*</FormLabel>
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
                    <FormLabel>Telefone*</FormLabel>
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

              <div className="flex gap-3">
                <FormField
                  control={form.control}
                  name="age"
                  render={({ field }) => (
                    <FormItem className="my-2 w-1/2">
                      <FormLabel>Idade</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          id="age"
                          type="number"
                          readOnly
                          placeholder="0"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="dateOfBirth"
                  render={({ field }) => (
                    <FormItem className="my-2 w-1/2">
                      <FormLabel>Data de nascimento</FormLabel>
                      <FormControl>
                        <DateTimePicker
                          initialDate={new Date()}
                          minDate={new Date(1900, 0, 1)}
                          activeYear={true}
                          className="rounded-md border px-2 py-1"
                          onChange={(date) => {
                            field.onChange(date)
                            console.log(field.value);

                            console.log("Data escolhida:", date)
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <h3 className="font-semibold text-lg text-center">
              Informações Clínicas
            </h3>

            <FormField
              control={form.control}
              name="symptoms"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quais são suas principais queixas e sintomas?</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      id="symptoms"
                      placeholder="Descreva Quais são suas principais queixas e sintomas"
                      className="max-h-30 h-10"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="secondary"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quais são suas queixas ou sintomas secundários?</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      id="secondary"
                      placeholder="Descreva Quais são suas queixas ou sintomas secundários?"
                      className="max-h-30 h-10"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="complaints"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Qual é o histórico dessas queixas?</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      id="complaints"
                      placeholder="Descreva Qual é o histórico dessas queixas?"
                      className="max-h-30 h-10"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <h3 className="font-semibold text-lg text-center">
              Informações Adicionais
            </h3>
            <div className="flex flex-col md:flex-row gap-4 md:gap-0 md:justify-between">
              <FormField
                control={form.control}
                name="useOfAnyMedication"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Faz uso de alguma medicação?</FormLabel>
                    <FormControl className="flex md:justify-center gap-4">
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="yes" id="yes" />
                          <Label htmlFor="yes">sim</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="not" id="not" />
                          <Label htmlFor="not">não</Label>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="bePregnant"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Está ou pode estar grávida?</FormLabel>
                    <FormControl className="flex md:justify-center gap-4">
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="true" id="true" />
                          <Label htmlFor="yes">sim</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="false" id="false" />
                          <Label htmlFor="not">não</Label>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="eatingRoutine"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Faz atividades físicas?</FormLabel>
                    <FormControl className="flex md:justify-center gap-4">
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="true" id="true" />
                          <Label htmlFor="yes">sim</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="false" id="false" />
                          <Label htmlFor="not">não</Label>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

            </div>

            <FormField
              control={form.control}
              name="physicalActivities"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Como é sua rotina alimentar?</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      id="physicalActivities"
                      placeholder="Descreva Como é sua rotina alimentar"
                      className="max-h-30 h-10"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <h3 className="font-semibold text-lg text-center">
              Agendamento
            </h3>
            <div className="w-full grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Data do agendamento*</FormLabel>
                    <FormControl>
                      <DateTimePicker
                        initialDate={new Date()}
                        className="rounded-md border px-2 py-1"
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
                  <FormItem className="w-full">
                    <FormLabel>Selecione o serviço*</FormLabel>
                    <FormControl>
                      <Select onValueChange={(value) => {
                        field.onChange(value)
                        setSelectedTime("");
                      }}>
                        <SelectTrigger className="w-full">
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
            </div>

            {selectedServiceId && (
              <div className="space-y-2">
                <Label>Horários disponíeis*</Label>
                <div className="bg-gray-100 p-2 rounded-md border">
                  {loadingSlots ? (
                    <LoadingUI />
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
            <article className="max-w-2xl mx-auto w-full mt-6 space-y-2 px-4 text-[12px]">
              <p>
                Sua Terapia será conduzida de forma estritamente confidencial. As informações pessoais passadas durante todo o procedimento da terapia, bem como essa ficha de Anamnese, não serão divulgadas para ninguém.
              </p>
              <p>
                Ao assinar esse formulário, você reconhece que leu e concordou com o que está exposto acima, bem como, que está ciente que o sucesso terapêutico também depende do seguimento das recomendações profissionais concedidas.
              </p>
            </article>
          </form>
        </Form>
      </section>


    </div>
  )
}