import { ColumnDef, flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, useReactTable } from '@tanstack/react-table';
import { FormikSharedConfig, useFormikContext } from 'formik';
import { t } from 'i18next';
import { useMemo, useState } from 'react';
import { DeleteIcon, EditIcon } from '../../../atoms/icons';
import { Payment_TP } from './PaymentProcessing';

const PaymentProccessingTable = ({paymentData, setEditData, setPaymentData }) => {

    const [editingRowId, setEditingRowId] = useState<string | undefined>(null);

    const { setFieldValue } = useFormikContext<FormikSharedConfig>()

    const paymentCols = useMemo<ColumnDef<Payment_TP>[]>(
        () => [
          {
            header: () => <span>{t("card type")}</span>,
            accessorKey: "card",
            cell: (info) =>  info.row.original.card,
          },
          {
            header: () => <span>{t("amount")}</span>,
            accessorKey: "amount",
            cell: (info) => info.row.original.amount || "---",
          },
          {
            header: () => <span>{t("commission percentage")} </span>,
            accessorKey: "discount_percentage",
            cell: (info) => `${info.row.original.discount_percentage} %` || "---" ,
          },
          {
            header: () => <span>{t("commission riyals")} </span>,
            accessorKey: "commission_riyals",
            cell: (info) => info.row.original.commission_riyals || "---",
          },
          {
            header: () => <span>{t("commission tax")} </span>,
            accessorKey: "commission_tax",
            cell: (info) => info.row.original.commission_tax || "---",
          },
          {
            header: () => <span>{t("actions")}</span>,
            accessorKey: "actions_id",
            cell: (info) => (
                <span className='flex items-center justify-center gap-3'>
                    <EditIcon
                        size={16}
                        action={() => {
                            setEditData(info.row.original)
                            setEditingRowId(info.row.original.id);  
                            setFieldValue("amount", info.row.original.amount)
                            setFieldValue("commission_riyals", info.row.original.commission_riyals)
                            setFieldValue("discount_percentage", info.row.original.discount_percentage)
                        }}
                        className="fill-mainGreen w-6 h-6 mb-[2px]"
                    />
                    <DeleteIcon
                        size={16}
                        action={() => {
                            const itemId = info.row.original.id
                            setPaymentData((curr) => curr.filter((item) => item.id !== itemId))
                        }}
                        className="!w-6 !h-6"
                    />
                </span>

            ),
          },
        ],
        []
    );

    const table = useReactTable({
        data: paymentData,
        columns: paymentCols,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    });

    

  return (
    <div>
    <p className='text-base font-bold'>{`${t("payments")} : ${paymentData?.length === 0 ? t("none") : paymentData?.length}`}</p>
    {paymentData?.length > 0 
        && (
            
            <table className="mt-8 mb-2 w-full overflow-x-scroll">
                <thead className="bg-mainGreen text-white">
                    {table.getHeaderGroups().map((headerGroup) => (
                        <tr key={headerGroup.id} className="py-4 px-2">
                        {headerGroup.headers.map((header) => (
                            <th
                                key={header.id}
                                className="p-4 text-sm font-medium text-white border"
                            >
                                {header.isPlaceholder
                                    ? null
                                    : flexRender(
                                        header.column.columnDef.header,
                                        header.getContext()
                                )}
                            </th>
                        ))}
                        </tr>
                    ))}
                </thead>
                <tbody>
                {table.getRowModel().rows.map((row) => ( 
                    <tr key={row.id} className="text-center">
                        {row.getVisibleCells().map((cell, i) => (   
                            <td
                                className={` ${
                                    editingRowId == cell.row.original.id ? 'bg-flatWhite' : 'bg-lightGray'}
                                } px-2 py-2  gap-x-2 items-center border border-[#C4C4C4]`}
                                
                                key={cell.id}
                                >
                                {flexRender(
                                    cell.column.columnDef.cell,
                                    cell.getContext()
                                )}
                            </td>
                        ))}
                    </tr>
                ))}
                </tbody>
            </table>
        )
    }
</div>
  )
}

export default PaymentProccessingTable