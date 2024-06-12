import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

declare type rows =
  | {
      cells: string[] | null | undefined
    }[]
  | null
  | undefined

export default function DataTable({
  data,
}: {
  data: {
    header: string[]
    rows:
      | {
          cells: any[]
        }[]
      | undefined
  }
}) {
  return (
    <Table className="border">
      <TableHeader>
        <TableRow>
          {data.header.map((row, index) => {
            return <TableHead key={index}>{row}</TableHead>
          })}
        </TableRow>
      </TableHeader>
      <TableBody className="">
        {data.rows?.map((row, index) => {
          return (
            <TableRow key={index}>
              {row.cells.map((cell, index) => {
                return <TableCell key={index}>{cell}</TableCell>
              })}
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}
