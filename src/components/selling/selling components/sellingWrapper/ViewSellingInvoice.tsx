import { useContext, useEffect, useMemo, useState } from "react";
import { authCtx } from "../../../../context/auth-and-perm/auth";
import { useFetch, useIsRTL } from "../../../../hooks";
import { t } from "i18next";
import { Form, Formik } from "formik";

import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import { BsEye } from "react-icons/bs";

import { Loading } from "../../../organisms/Loading";
import { Table } from "../../../templates/reusableComponants/tantable/Table";
import { Button } from "../../../atoms";
import { BaseInputField, DateInputField, Modal } from "../../../molecules";
import SellingInvoiceTablePreview from "./SellingInvoiceTablePreview";
import { Back } from "../../../../utils/utils-components/Back";
import { formatDate, getDayAfter } from "../../../../utils/date";

const ViewSellingInvoice = () => {
  // STATE
  const isRTL = useIsRTL();
  const [dataSource, setDataSource] = useState([]);
  const { userData } = useContext(authCtx);
  const [page, setPage] = useState(1);
  const [invoiceModal, setOpenInvoiceModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>({});
  const [search, setSearch] = useState("");

  const searchValues = {
    invoice_number: "",
    invoice_date: "",
  };

  // FETCHING DATA FROM API
  const {
    data: invoiceData,
    isLoading,
    isFetching,
    isRefetching,
    refetch,
  } = useFetch({
    queryKey: ["selling-invoice"],
    endpoint:
      search === `selling/api/v1/invoices_per_branch/${userData?.branch_id}?` ||
      search === ""
        ? `selling/api/v1/invoices_per_branch/${userData?.branch_id}?page=${page}`
        : `${search}`,
    pagination: true,
  });

  // COLUMNS FOR THE TABLE
  const tableColumn = useMemo<any>(
    () => [
      {
        cell: (info: any) => info.getValue(),
        accessorKey: "invoice_number",
        header: () => <span>{t("invoice number")}</span>,
      },
      {
        cell: (info: any) => info.getValue(),
        accessorKey: "invoice_date",
        header: () => <span>{t("date")}</span>,
      },
      {
        cell: (info: any) => info.getValue(),
        accessorKey: "client_name",
        header: () => <span>{t("client name")}</span>,
      },
      {
        cell: (info: any) => info.getValue(),
        accessorKey: "employee_name",
        header: () => <span>{t("employee name")}</span>,
      },
      {
        cell: (info: any) => (
          <BsEye
            onClick={() => {
              setOpenInvoiceModal(true);
              setSelectedItem(info.row.original);
            }}
            size={23}
            className="text-mainGreen mx-auto cursor-pointer"
          />
        ),
        accessorKey: "details",
        header: () => <span>{t("details")}</span>,
      },
    ],
    []
  );

  // EFFECTS
  useEffect(() => {
    if (invoiceData) {
      setDataSource(invoiceData.data);
    }
  }, [invoiceData]);

  useEffect(() => {
    refetch();
  }, [page]);

  useEffect(() => {
    if (page == 1) {
      refetch();
    } else {
      setPage(1);
    }
  }, [search]);

  // SEARCH FUNCTIONALITY
  const getSearchResults = async (req: any) => {
    let url = `selling/api/v1/invoices_per_branch/${userData?.branch_id}?`;
    let first = false;
    Object.keys(req).forEach((key) => {
      if (req[key] !== "") {
        if (first) {
          url += `?${key}[eq]=${req[key]}`;
          first = false;
        } else {
          url += `&${key}[eq]=${req[key]}`;
        }
      }
    });
    setSearch(url);
  };

  // LOADING ....
  if (isLoading || isRefetching || isFetching)
    return <Loading mainTitle={`${t("loading items")}`} />;

  return (
    <div className="p-16">
      <div className="mb-8 flex flex-col items-center gap-6 lg:flex-row lg:items-end lg:justify-between">
        {/* 1) FORM */}
        <Formik
          initialValues={searchValues}
          onSubmit={(values) => {
            getSearchResults({
              ...values,
              invoice_date: values.invoice_date
                ? formatDate(getDayAfter(new Date(values.invoice_date)))
                : "",
            });
          }}
        >
          <Form className="w-full flex">
            <div className="flex w-full justify-between items-end gap-3">
              <div className="flex items-end gap-3">
                <div className="">
                  <BaseInputField
                    id="invoice_number"
                    name="invoice_number"
                    label={`${t("invoice number")}`}
                    placeholder={`${t("invoice number")}`}
                    className="shadow-xs"
                    type="text"
                  />
                </div>
                <div className="">
                  <DateInputField
                    label={`${t("invoice date")}`}
                    placeholder={`${t("invoice date")}`}
                    name="invoice_date"
                    labelProps={{ className: "mt-10" }}
                  />
                </div>
                <Button
                  type="submit"
                  disabled={isRefetching}
                  className="flex h-[38px] mx-4 hover:bg-emerald-900 duration-300 transition-all"
                >
                  {t("search")}
                </Button>
              </div>
              <Back className="hover:bg-slate-50 transition-all duration-300" />
            </div>
          </Form>
        </Formik>
      </div>

      {/* 2) TABLE */}
      <div className="">
        <Table data={dataSource || []} columns={tableColumn}>
          <div className="mt-3 flex items-center justify-center gap-5 p-2">
            <div className="flex items-center gap-2 font-bold">
              {t("page")}
              <span className=" text-mainGreen">
                {invoiceData?.current_page}
              </span>
              {t("from")}
              {<span className=" text-mainGreen">{invoiceData?.total}</span>}
            </div>
            <div className="flex items-center gap-2 ">
              <Button
                className=" rounded bg-mainGreen p-[.18rem]"
                action={() => setPage((prev) => prev - 1)}
                disabled={page == 1}
              >
                {isRTL ? (
                  <MdKeyboardArrowRight className="h-4 w-4 fill-white" />
                ) : (
                  <MdKeyboardArrowLeft className="h-4 w-4 fill-white" />
                )}
              </Button>

              <Button
                className="rounded bg-mainGreen p-[.18rem]"
                action={() => setPage((prev) => prev + 1)}
                disabled={page == invoiceData?.pages}
              >
                {isRTL ? (
                  <MdKeyboardArrowLeft className="h-4 w-4 fill-white" />
                ) : (
                  <MdKeyboardArrowRight className="h-4 w-4 fill-white" />
                )}
              </Button>
            </div>
          </div>
        </Table>
      </div>

      {/* 3) MODAL */}
      <Modal isOpen={invoiceModal} onClose={() => setOpenInvoiceModal(false)}>
        <SellingInvoiceTablePreview item={selectedItem} />
      </Modal>
    </div>
  );
};

export default ViewSellingInvoice;
