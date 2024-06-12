import DataTable from "@/components/table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useToast } from "@/components/ui/use-toast"
import {
  dataTagSymbol,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query"
import { CircleCheck, CircleX, Loader, Workflow } from "lucide-react"
import { useState } from "react"

const PaimentDetails = () => {
  const queryClient = useQueryClient()
  const { toast } = useToast()
  const [Etat, setEtat] = useState("encours")
  const { data, isLoading, error } = useQuery({
    queryKey: ["historique", Etat],
    queryFn: async () => {
      const response = await fetch(
        `http://localhost:3000/paiment/historique/${Etat}`
      )
      if (!response.ok) {
        throw new Error(
          `status : ${response.status} , message : ${response.statusText}`
        )
      }
      return response.json()
    },
  })

  const success_mutation = useMutation({
    mutationFn: async ({ id, etat }: { id: string; etat: string }) => {
      await fetch(`http://localhost:3000/paiment/etat`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
          etat,
        }),
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] })
      toast({
        title: "La transaction est marquée comme réussie",
      })
    },
    onError: (error) => {
      toast({
        title: "un probleme est survenue",
        variant: "destructive",
      })
      console.error(error.message)
    },
  })
  const failed_mutation = useMutation({
    mutationFn: async ({ id, etat }: { id: string; etat: string }) => {
      await fetch(`http://localhost:3000/paiment/etat`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
          etat,
        }),
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] })
      toast({
        title: "La transaction est marquée comme annulée",
      })
    },
    onError: (error) => {
      toast({
        title: "un probleme est survenue",
        variant: "destructive",
      })
      console.error(error.message)
    },
  })

  const Tabledata = {
    header: [
      "nom",
      "prenom",
      "telephone",
      "numCarte",
      "cvv",
      "montant",
      "Etat",
    ],
    rows: data?.map((doc: any) => {
      return {
        cells: [
          doc.destinataire.nom,
          doc.destinataire.prenom,
          `0${doc.destinataire.telephone}`,
          doc.destinataire.carteBancaire[0].numCarte,
          doc.destinataire.carteBancaire[0].cvv,
          `${doc.montant.$numberDecimal} DH`,
          doc.Etat_de_la_transaction,
          <div className="flex items-center justify-center gap-1">
            {Etat == "encours" ? (
              <>
                <AlertDialog>
                  <AlertDialogTrigger>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Button
                            variant={"secondary"}
                            size={"icon"}
                            className="rounded-full text-[#28a745] hover:text-[#218838]"
                          >
                            {success_mutation.isPending ? (
                              <Loader className="animate-spin text-[#28a745] hover:text-[#218838]" />
                            ) : (
                              <CircleCheck className="h-6 w-6 text-[#28a745] hover:text-[#218838]" />
                            )}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Marquer comme réussie</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Êtes-vous absolument sûr(e) ?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        Cette action est irréversible. Cela signifie que le
                        client a reçu son argent de manière définitive.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Annuler</AlertDialogCancel>
                      <AlertDialogAction
                        className="bg-[#FFA500] hover:bg-[#e59400]"
                        onClick={() => {
                          success_mutation.mutate({
                            id: doc._id,
                            etat: "reussie",
                          })
                        }}
                      >
                        Continuer
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
                <AlertDialog>
                  <AlertDialogTrigger>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Button
                            variant={"secondary"}
                            size={"icon"}
                            className="rounded-full"
                          >
                            {failed_mutation.isPending ? (
                              <Loader className="animate-spin text-red-400 hover:text-red-500" />
                            ) : (
                              <CircleX className="h-6 w-6 text-red-400 hover:text-red-500" />
                            )}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Marquer comme annulée</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Êtes-vous absolument sûr(e) ?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        Cette action est irréversible. Cela signifie que le
                        client a reçu son argent de manière définitive.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Annuler</AlertDialogCancel>
                      <AlertDialogAction
                        className="bg-red-500 hover:bg-red-600"
                        onClick={() => {
                          failed_mutation.mutate({
                            id: doc._id,
                            etat: "échouer",
                          })
                        }}
                      >
                        Continuer
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </>
            ) : (
              <></>
            )}
          </div>,
        ],
      }
    }),
  }
  return (
    <Card className="wrapper shadow-lg h-full overflow-auto flex flex-col">
      <CardHeader className="flex flex-row justify-between">
        <CardTitle className="text-[#04d3b9]">Liste des paiments</CardTitle>
        <div className="flex gap-3 items-center tracking-wide">
          <span className="text-[#04d3b9] font-bold">Transactions :</span>
          <Button
            className="bg-[#FFA500] hover:bg-[#e59400] font-semibold"
            onClick={() => setEtat("encours")}
          >
            <Workflow className="mr-2 h-4 w-4" /> en cours
          </Button>
          <Button
            className="bg-[#28a745] hover:bg-[#218838] active:bg-green-700  font-semibold"
            onClick={() => setEtat("reussie")}
          >
            <CircleCheck className="mr-2 h-4 w-4" /> reussie
          </Button>
          <Button
            className="bg-[#dc3545] hover:bg-[#c82333] active:bg-red-700 font-semibold"
            onClick={() => setEtat("echouee")}
          >
            <CircleX className="mr-2 h-4 w-4" /> echouee
          </Button>
        </div>
      </CardHeader>
      <CardContent className="overflow-auto flex-1 flex">
        <DataTable data={Tabledata} />
      </CardContent>
    </Card>
  )
}

export default PaimentDetails
