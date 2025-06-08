"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Reminder } from "@/generated/prisma"
import { Plus, Trash } from "lucide-react"
import { deleteReminder } from "../../_actions/delete-reminder"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ReminderContent } from "./reminder-content"
import { useState } from "react"

interface ReminderListProps {
  reminder: Reminder[];
}

export function ReminderList({ reminder }: ReminderListProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const router = useRouter();

  async function handleDeleteReminder(id: string, description: string) {
    setDeletingId(id)

    try {
      const response = await deleteReminder({ reminderId: id });

      if (response.error) {
        toast.error(response.error);
        return;
      }
      toast.success(`Lembrete "${description}" removido com sucesso`);
      router.refresh();
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle
            className="text-lg xl:text-2xl font-montserrat"
            id="reminders-title"
          >
            Lembretes
          </CardTitle>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                className="w-9 p-0 hover:bg-accent focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                aria-label="Adicionar novo lembrete"
                title="Adicionar novo lembrete"
              >
                <Plus className="w-5 h-5" aria-hidden="true" />
              </Button>
            </DialogTrigger>

            <DialogContent
              className="sm:max-w-[425px] bg-white"
              aria-describedby="dialog-description"
            >
              <DialogHeader>
                <DialogTitle>Novo Lembrete</DialogTitle>
                <DialogDescription id="dialog-description">
                  Criar um novo lembrete para sua lista.
                </DialogDescription>
              </DialogHeader>

              <ReminderContent
                closeDialog={() => setIsDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>

        </CardHeader>

        <CardContent>
          {reminder.length === 0 ? (
            <div
              className="text-center py-8"
              role="status"
              aria-live="polite"
            >
              <p className="text-sm text-gray-500">
                Nenhum lembrete registrado...
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Clique no botão "+" para adicionar seu primeiro lembrete
              </p>
            </div>
          ) : (
            <div>
              <div className="sr-only" aria-live="polite">
                {reminder.length} {reminder.length === 1 ? 'lembrete encontrado' : 'lembretes encontrados'}
              </div>

              <ScrollArea
                className="h-[340px] lg:max-h-[calc(100vh-15rem)] pr-0 w-full flex-1"
                aria-labelledby="reminders-title"
              >
                <ul
                  className="space-y-2"
                  role="list"
                  aria-label="Lista de lembretes"
                >
                  {reminder.map((item, index) => (
                    <li key={item.id}>
                      <article
                        className="flex flex-wrap flex-row items-center justify-between py-2 bg-yellow-100 px-3 rounded-md"
                        aria-labelledby={`reminder-${item.id}`}
                      >
                        <div className="flex-1 mr-2">
                          <p
                            className="text-sm lg:text-base"
                            id={`reminder-${item.id}`}
                          >
                            {item.description}
                          </p>
                          <span className="sr-only">
                            Lembrete {index + 1} de {reminder.length}
                          </span>
                        </div>

                        <Button
                          className="bg-red-500 hover:bg-red-400 shadow-none rounded-full p-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                          size="sm"
                          onClick={() => handleDeleteReminder(item.id, item.description)}
                          disabled={deletingId === item.id}
                          aria-label={`Excluir lembrete: ${item.description}`}
                          title={`Excluir lembrete: ${item.description}`}
                        >
                          {deletingId === item.id ? (
                            <>
                              <span className="sr-only">Excluindo...</span>
                              <div
                                className="w-4 h-4 animate-spin rounded-full border-2 border-current border-t-transparent"
                                aria-hidden="true"
                              />
                            </>
                          ) : (
                            <Trash className="w-4 h-4" aria-hidden="true" />
                          )}
                        </Button>
                      </article>
                    </li>
                  ))}
                </ul>
              </ScrollArea>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}