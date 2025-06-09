"use client"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody, TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp } from "lucide-react";
import { RanksProps } from "../types/ranks";
import img_trophy_gold from "@/assets/gold.png";
import img_trophy_silver from "@/assets/silver.png";
import img_trophy_bronze from "@/assets/bronze.png";
import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface TopHoursProps {
  data: RanksProps;
}

export function TopHours({ data }: TopHoursProps) {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPages: number = 10;

  const totalPages = Math.ceil(data.hours.slice(3).length / itemsPerPages);
  const dataItemsSlice = data.hours.slice(3);
  const dataPage = dataItemsSlice.slice(
    (currentPage - 1) * itemsPerPages,
    currentPage * itemsPerPages
  );

  function changePage(page: number) {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  }

  function changeVisible() {
    setIsVisible(prev => !prev)
  }
  return (
    <>
      {data?.hours.length > 0 ? (
        <Card className="w-full">
          <CardHeader className="text-center">
            <CardTitle>
              Horários mas agendados
            </CardTitle>
            <CardDescription>
              Ranking dos horários mais agendados
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="flex justify-evenly items-center">
              {data.hours.length > 1 && (
                <div className="flex flex-col items-center justify-center p-2">
                  <Image
                    src={img_trophy_silver}
                    alt="imagem trofeu silver"
                    width={100}
                    height={100}
                    sizes="(max-width:480px) 100vw (max-width: 1024px) 75vw, 60vw"
                  />
                  <p className="font-bold px-2 py-0.5 rounded bg-primary text-white">{data.hours[1].time}</p>
                  <p className="text-xs">Agendamentos: {data.hours[1].count}</p>
                </div>
              )}

              <div className="flex flex-col items-center justify-center p-2">
                <Image
                  src={img_trophy_gold}
                  alt="imagem trofeu gold"
                  width={150}
                  height={150}
                  sizes="(max-width:480px) 100vw (max-width: 1024px) 75vw, 60vw"
                />
                <p className="font-bold px-2 py-0.5 rounded bg-primary text-white">{data.hours[0].time}</p>
                <p className="text-xs">Agendamentos: {data.hours[0].count}</p>
              </div>

              {(data.hours.length > 2 &&
                <div className="flex flex-col items-center justify-center p-2">
                  <Image
                    src={img_trophy_bronze}
                    alt="imagem trofeu btonze"
                    width={100}
                    height={100}
                    sizes="(max-width:480px) 100vw (max-width: 1024px) 75vw, 60vw"
                  />
                  <p className="font-bold px-2 py-0.5 rounded bg-primary text-white">{data.hours[2].time}</p>
                  <p className="text-xs">Agendamentos: {data.hours[2].count}</p>
                </div>
              )}
            </div>
            {data.hours.length > 3 && (
              <Button
                variant={"ghost"}
                onClick={changeVisible}
              >
                {isVisible ? "Recolher lista" : "Lista completa"}
                {isVisible ? <ChevronUp /> : <ChevronDown />}
              </Button>
            )}
          </CardContent>

          {data?.hours?.length > 2 && (
            <>
              {isVisible && (
                <CardFooter className="flex flex-col">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="">Horário</TableHead>
                        <TableHead className="text-right">Total de Agendamentos</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {dataPage.map(hour => (
                        <TableRow key={hour.time}>
                          <TableCell className="font-medium capitalize">{hour.time}</TableCell>
                          <TableCell className="text-right">{hour.count}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>

                  {dataItemsSlice.length > itemsPerPages && (
                    <div className="flex gap-3">
                      <Button variant={"ghost"} className="hover:bg-transparent hover:text-accent" onClick={() => changePage(currentPage - 1)} disabled={currentPage === 1}>
                        <ChevronLeft />
                      </Button>
                      {[...Array(totalPages)].map((_, index) => (
                        <Button
                          key={index}
                          variant={"ghost"}
                          onClick={() => changePage(index + 1)}
                          className={cn("hover:bg-transparent hover:text-accent", currentPage === index + 1 && "font-bold text-lg")}
                        >
                          {index + 1}
                        </Button>
                      ))}
                      <Button variant={"ghost"} className="hover:bg-transparent hover:text-accent" onClick={() => changePage(currentPage + 1)} disabled={currentPage === totalPages}>
                        <ChevronRight />
                      </Button>
                    </div>
                  )}
                </CardFooter>
              )}
            </>
          )}
        </Card>
      ) : (
        <div className="flex items-center justify-center w-full mt-4">
          <p className="text-center bg-emerald-400 text-white p-2 px-3 rounded-lg">
            Você ainda não tem horários com agendamentos para exibir um Rank
          </p>
        </div>
      )}
    </>
  )
}