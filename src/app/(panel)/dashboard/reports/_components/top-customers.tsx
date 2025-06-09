"use client"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import img_trophy_gold from "@/assets/gold.png";
import img_trophy_silver from "@/assets/silver.png";
import img_trophy_bronze from "@/assets/bronze.png";
import Image from "next/image";
import { RanksProps } from "../types/ranks";
import { useIsMobile } from "@/app/hooks/useMobile";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface TopCustomersProps {
  data: RanksProps;
}

export function TopCustomers({ data }: TopCustomersProps) {
  const isMobile = useIsMobile(1024);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPages: number = 10;

  const totalPages = Math.ceil(data.groupedCustomers.slice(3).length / itemsPerPages);
  const dataItemsSlice = data.groupedCustomers.slice(3);
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
      {data.groupedCustomers.length > 0 ? (
        <Card className="w-full">
          <CardHeader className="text-center">
            <CardTitle>Rank dos clientes</CardTitle>
            <CardDescription>Clientes com maior numero de agendamentos</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-evenly items-center">

              {data.groupedCustomers.length > 1 && (
                <div className="relative group flex flex-col items-center justify-center p-2">
                  <Image
                    src={img_trophy_silver}
                    alt="imagem trofeu silver"
                    width={100}
                    height={100}
                    sizes="(max-width:480px) 100vw (max-width: 1024px) 75vw, 60vw"
                  />
                  <p className="px-2 py-0.5 rounded bg-primary text-white capitalize">
                    {data.groupedCustomers[1].name.split(" ")[0].toLowerCase()}
                  </p>
                  <p className="text-xs">Agendamentos: {data.groupedCustomers[1].count}</p>
                  <div className="bg-white p-2 border rounded-lg text-xs w-fit h-fit absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <p className="capitalize">{data.groupedCustomers[1].name.toLowerCase()}</p>
                    <p>{data.groupedCustomers[1].email}</p>
                    <p>{data.groupedCustomers[1].phone}</p>
                  </div>
                </div>
              )}

              <div className="relative group flex flex-col items-center justify-center p-2">
                <Image
                  src={img_trophy_gold}
                  alt="imagem trofeu silver"
                  width={150}
                  height={150}
                  sizes="(max-width:480px) 100vw (max-width: 1024px) 75vw, 60vw"
                />
                <p className="px-2 py-0.5 rounded bg-primary text-white capitalize">
                  {data.groupedCustomers[0].name.split(" ")[0].toLowerCase()}
                </p>
                <p className="text-xs">Agendamentos: {data.groupedCustomers[0].count}</p>
                <div className="bg-white p-2 border rounded-lg text-xs w-fit h-fit absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <p className="capitalize">{data.groupedCustomers[0].name.toLowerCase()}</p>
                  <p>{data.groupedCustomers[0].email}</p>
                  <p>{data.groupedCustomers[0].phone}</p>
                </div>
              </div>

              {data.groupedCustomers.length > 2 && (
                <div className="relative group flex flex-col items-center justify-center p-2">
                  <Image
                    src={img_trophy_bronze}
                    alt="imagem trofeu silver"
                    width={100}
                    height={100}
                    sizes="(max-width:480px) 100vw (max-width: 1024px) 75vw, 60vw"
                  />
                  <p className="px-2 py-0.5 rounded bg-primary text-white capitalize">
                    {data.groupedCustomers[2].name.split(" ")[0].toLowerCase()}
                  </p>
                  <p className="text-xs">Agendamentos: {data.groupedCustomers[2].count}</p>
                  <div className="bg-white p-2 border rounded-lg text-xs w-fit h-fit absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <p className="capitalize">{data.groupedCustomers[2].name.toLowerCase()}</p>
                    <p>{data.groupedCustomers[2].email}</p>
                    <p>{data.groupedCustomers[2].phone}</p>
                  </div>
                </div>
              )}

            </div>
            {data.groupedCustomers.length > 3 && (
              <Button
                variant={"ghost"}
                onClick={changeVisible}
              >
                {isVisible ? "Recolher lista" : "Lista completa"}
                {isVisible ? <ChevronUp /> : <ChevronDown />}
              </Button>
            )}
          </CardContent>

          {isVisible && (
            <CardFooter className="flex flex-col">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="">Nome</TableHead>
                    {!isMobile && (<TableHead>Email</TableHead>)}
                    <TableHead>Telefone</TableHead>
                    <TableHead className="text-right">Agendamentos</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dataPage.map(customer => (
                    <TableRow key={customer.name}>
                      <TableCell className="font-medium capitalize">{customer.name.toLowerCase()}</TableCell>
                      {!isMobile && (<TableCell>{customer.email}</TableCell>)}
                      <TableCell>{customer.phone}</TableCell>
                      <TableCell className="text-right">{customer.count}</TableCell>
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
        </Card>
      ) : (
        <div className="flex items-center justify-center w-full mt-4">
          <p className="text-center bg-emerald-400 text-white p-2 px-3 rounded-lg">
            Você ainda não tem clientes com agendamentos para exibir um Rank
          </p>
        </div>
      )}

    </>
  )
}