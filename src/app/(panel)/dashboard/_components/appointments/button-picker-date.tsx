import { useState } from "react"
import { format } from "date-fns";
import { useRouter } from "next/navigation";

export function ButtonPickerAppointment() {
  const [selectedDate, setSelectedDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const router = useRouter();

  function handleChangeDate(event: React.ChangeEvent<HTMLInputElement>) {
    setSelectedDate(event.target.value)

    const url = new URL(window.location.href)
    url.searchParams.set("date", event.target.value);
    router.push(url.toString())

  }
  return (
    <input
      id="start"
      type="date"
      className="px-2 border-2 rounded-md text-sm md:text-base border-primary"
      value={selectedDate}
      onChange={handleChangeDate}
    />
  )
}