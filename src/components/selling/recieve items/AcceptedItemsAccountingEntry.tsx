import { useContext, useMemo, useState } from "react"
import { useFetch } from "../../../hooks"
import { t } from "i18next"
import { authCtx } from "../../../context/auth-and-perm/auth"
import { Button } from "../../atoms"
import { Table } from "../../templates/reusableComponants/tantable/Table"
import { notify } from "../../../utils/toast"
import { Loading } from "../../organisms/Loading"
import { BoxesDataBase } from "../../atoms/card/BoxesDataBase"
import { Link, useNavigate } from "react-router-dom"
import { ColumnDef } from "@tanstack/react-table"
import { numberContext } from "../../../context/settings/number-formatter"
import { FilesPreviewOutFormik } from "../../molecules/files/FilesPreviewOutFormik"

type AcceptedItemsAccountingEntryProps_TP = { sanadId: number, isInPopup?: boolean, setStage: React.Dispatch<React.SetStateAction<number>>, isInReceivedComp?: boolean }
///
export const AcceptedItemsAccountingEntry = ({ sanadId, isInPopup, setStage, isInReceivedComp }: AcceptedItemsAccountingEntryProps_TP) => {
    /////////// VARIABLES
    ///
    const { formatGram, formatReyal } = numberContext()

    const goldCols = useMemo<any>(() => [
        {
            header: () => <span>{t("identification")}</span>,
            accessorKey: "hwya",
            cell: (info: any) => info.getValue(),
        },
        {
            header: () => <span>{t("classification")}</span>,
            accessorKey: "classification_id",
            cell: (info: any) => info.getValue(),
        },
        {
            header: () => <span>{t("karat")}</span>,
            accessorKey: "karat_id",
            cell: (info: any) => info.getValue(),
        },
        {
            header: () => <span>{t("mineral")}</span>,
            accessorKey: "mineral",
            cell: (info: any) => info.getValue() || '---',
        },
        {
            header: () => <span>{t("mineral karat")}</span>,
            accessorKey: "karatmineral_id",
            cell: (info: any) => info.getValue() || '---',
        },
        {
            header: () => <span>{t("weight")}</span>,
            accessorKey: "weight",
            cell: (info: any) => info.getValue(),
        },
        {
            header: () => <span>{t("wage")}</span>,
            accessorKey: "wage",
            cell: (info: any) => info.getValue() || '---',
        },
        {
            header: () => <span>{t("total wages")}</span>,
            accessorKey: "wage_total",
            cell: (info: any) => info.getValue() || '---',
        },
        {
            header: () => <span>{t("diamond value")}</span>,
            accessorKey: "diamond_value",
            cell: (info: any) => info.getValue(),
        },
        {
            header: () => <span>{t("diamond weight")}</span>,
            accessorKey: "diamond_weight",
            cell: (info: any) => info.getValue(),
        },
        {
            header: () => <span>{t("stones weight")}</span>,
            accessorKey: "stones_weight",
            cell: (info: any) => info.getValue(),
        },
    ],
        []
    )
    const cols2 = useMemo<ColumnDef<any>[]>(
        () => [
            {
                header: `${t('description')}`,
                cell: (info) => info.renderValue(),
                accessorKey: 'bian',
            },
            {
                header: `${t('gram (debtor)')}`,
                cell: (info) => formatGram(Number(info.renderValue())),
                accessorKey: 'debtor_gram',
            },
            {
                header: `${t('reyal (debtor)')}`,
                cell: (info) => formatReyal(Number(info.renderValue())),
                accessorKey: 'debtor_SRA',
            },
            {
                header: `${t('gram (creditor)')}`,
                cell: (info) => formatGram(Number(info.renderValue())),
                accessorKey: 'creditor_gram',
            },
            {
                header: `${t('reyal (creditor)')}`,
                cell: (info) => formatReyal(Number(info.renderValue())),
                accessorKey: 'creditor_SRA',
            }
        ], []
    )
    ///
    /////////// STATES
    ///
    const [dataSource, setDataSource] = useState([])
    ///
    /////////// CUSTOM HOOKS
    ///
    const {
        data: contract,
        isLoading: contractIsLoading,
        isFetching: contractIsFetching,
        isSuccess: contractIsSuccess,
        isError: isContractError
    } = useFetch({
        endpoint: `branchManage/api/v1/bond-boxes/${sanadId}`,
        queryKey: ['bond-boxes'],
        pagination: true,
        select: (contract: any) => {
            return {
                boxes: contract.data.map(box => {
                    return {
                        id: box.id,
                        account: box.account,
                        value: box.value,
                        unit_id: box.unit_id,
                        computational_movement: box.computational_movement
                    }
                }),
                allboxes: contract.data[0].allboxes,
                items: contract.data[0].items,
                images: contract.data[0].images
            }
        },
        onSuccess(data) {
            setDataSource(data.items)
        },
        onError(data) {
            notify('info', `${t('bond has been rejected')}`)
        },
    })
    // restriction start
    let restrictions = contract?.boxes?.map(
        ({ account, computational_movement, unit_id, value }) => ({
            bian: account,
            debtor_gram:
                computational_movement === "debtor" && unit_id === "gram" ? value : 0,
            debtor_SRA:
                computational_movement === "debtor" && unit_id === "reyal" ? value : 0,
            creditor_gram:
                computational_movement === "creditor" && unit_id === "gram" ? value : 0,
            creditor_SRA:
                computational_movement === "creditor" && unit_id === "reyal" ? value : 0,
        })
    );

    // group by account
    const restrictionsWithoutTotals = restrictions?.reduce((prev, curr) => {
        const index = prev.findIndex((item) => item.bian === curr.bian);
        if (index === -1) {
            prev.push(curr);
        } else {
            prev[index].debtor_gram += curr.debtor_gram;
            prev[index].debtor_SRA += curr.debtor_SRA;
            prev[index].creditor_gram += curr.creditor_gram;
            prev[index].creditor_SRA += curr.creditor_SRA;
        }
        return prev;
    }, [] as typeof restrictions);

    restrictions = restrictionsWithoutTotals;

    let restrictionsTotals;
    if (restrictions && !!restrictions.length) {
        restrictionsTotals = restrictions?.reduce((prev, curr) => ({
            bian: `${t('totals')}`,
            debtor_gram: prev.debtor_gram + curr.debtor_gram,
            debtor_SRA: prev.debtor_SRA + curr.debtor_SRA,
            creditor_gram: prev.creditor_gram + curr.creditor_gram,
            creditor_SRA: prev.creditor_SRA + curr.creditor_SRA,
        }));
    }


    if (restrictionsTotals) restrictions?.push(restrictionsTotals!);

    // restriction end
    const total24 = contract?.allboxes?.karat24 || 0
    const total22 = contract?.allboxes?.karat22 || 0
    const total21 = contract?.allboxes?.karat21 || 0
    const total18 = contract?.allboxes?.karat18 || 0
    const allCounts = contract?.allboxes?.allcounts || 0
    const totalWages = contract?.allboxes?.wages || 0
    const totalDiamond = contract?.allboxes?.diamond || 0
    const totalAccessory = contract?.allboxes?.accessory || 0

    const totals = [
        {
            name: t("عدد القطع"),
            key: crypto.randomUUID(),
            unit: t(""),
            value: allCounts,
        },
        {
            name: t("total wages"),
            key: crypto.randomUUID(),
            unit: t("ryal"),
            value: totalWages,
        },
        {
            name: t("diamond value"),
            key: crypto.randomUUID(),
            unit: t("ryal"),
            value: totalDiamond,
        },
        {
            name: t("accessory value"),
            key: crypto.randomUUID(),
            unit: t("ryal"),
            value: totalAccessory,
        },
        {
            name: t("إجمالي وزن 18"),
            key: crypto.randomUUID(),
            unit: t("gram"),
            value: total18,
        },
        {
            name: "إجمالي وزن 24",
            key: crypto.randomUUID(),
            unit: t("gram"),
            value: total24,
        },
        {
            name: "إجمالي وزن 22",
            key: crypto.randomUUID(),
            unit: t("gram"),
            value: total22,
        },
        {
            name: "إجمالي وزن 21",
            key: crypto.randomUUID(),
            unit: t("gram"),
            value: total21,
        },
    ]

    ///
    /////////// SIDE EFFECTS
    ///

    /////////// FUNCTIONS | EVENTS | IF CASES
    ///
    if (contractIsLoading || contractIsFetching) return <Loading mainTitle={t("loading restriction")} />
    if (isContractError) return <h2 className="font-bold text-xl mx-auto my-8 text-mainGreen bg-lightGreen p-2 rounded-lg w-fit">{t('bond has been rejected and returned to management')}</h2>
    ///
    return <div className="md:px-16 px-4 mt-8 md:mt-16" >
        {
            !isInReceivedComp &&
            <ul className="grid grid-cols-4 gap-6 mb-5 md:mb-16">
                {totals.map(({ name, key, unit, value }) => (
                    <BoxesDataBase variant="secondary" key={key}>
                        <p className="bg-mainOrange px-2 py-4 flex items-center justify-center rounded-t-xl" >{name}</p>
                        <p className="bg-white px-2 py-[7px] text-black rounded-b-xl" >
                            {value} {t(unit)}
                        </p>

                    </BoxesDataBase>
                ))}
            </ul>
        }
        {contractIsSuccess &&
            !contractIsLoading && (
                <Table
                    data={dataSource}
                    columns={goldCols}
                >
                    {!(contractIsLoading || contractIsFetching) && contractIsSuccess && !!restrictions?.length && (
                        <>
                            <div className="flex justify-between items-center" >
                                <h2 className="text-xl mb-5 font-bold">{t('accounting entry')}</h2>
                                <FilesPreviewOutFormik preview images={contract.images ? contract.images : []}/>
                            </div>
                            <Table data={restrictions} footered showNavigation columns={cols2} />
                        </>
                    )}
                    <div className="flex gap-x-2 mr-auto">
                        {
                            !isInPopup &&
                            <>
                                <Button className="mb-8" action={() => setStage(1)} bordered>{t('sort pieces')}</Button>
                            </>
                        }
                    </div>
                </Table>
            )}
    </div>
}