import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"


export function CustomerTable() {
  return (
    <Table className="max-h-120 h-full overflow-y-scroll">
      <TableCaption>A list of your recent invoices.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Data</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Nome</TableHead>
          <TableHead className="text-right">Valor</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody className="">
        {invoices.map(item => (
          <TableRow>
            <TableCell className="font-medium">{item.date}</TableCell>
            <TableCell>{item.status}</TableCell>
            <TableCell>{item.name}</TableCell>
            <TableCell className="text-right">{item.totalAmount}</TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={3}>Total</TableCell>
          <TableCell className="text-right">$2,500.00</TableCell>
        </TableRow>
      </TableFooter>
    </Table>

  )
}

const invoices = [
  {
    date: "03-05-2025",
    status: "Paid",
    totalAmount: "$250.00",
    name: "Jhon blake",
  },
  {
    date: "04-05-2025",
    status: "Pending",
    totalAmount: "$150.00",
    name: "Pamelal",
  },
  {
    date: "05-05-2025",
    status: "Unpaid",
    totalAmount: "$350.00",
    name: "Baruna da silva",
  },
  {
    date: "06-05-2025",
    status: "Paid",
    totalAmount: "$450.00",
    name: "Richard month cell",
  },
  {
    date: "07-05-2025",
    status: "Paid",
    totalAmount: "$550.00",
    name: "Katarina marry",
  },
  {
    date: "08-05-2025",
    status: "Pending",
    totalAmount: "$200.00",
    name: "Hannah baker",
  },
  {
    date: "09-05-2025",
    status: "Unpaid",
    totalAmount: "$300.00",
    name: "Rafale ribeiro",
  },
]