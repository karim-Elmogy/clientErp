import { Form, Formik } from "formik";
import { t } from "i18next";
import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import { notify } from "../../utils/toast";
import PaymentCard from "../../components/selling/selling components/data/PaymentCard";
import PaymentProccessingTableToManagement from "./PaymentProccessingTableToManagement";
import { Button, Spinner } from "../../components/atoms";
import { BaseInputField, Select } from "../../components/molecules";
import { numberContext } from "../../context/settings/number-formatter";
import { useFetch } from "../../hooks";
import { Loading } from "../../components/organisms/Loading";

export type Payment_TP = {
  id: string;
  amount: string;
  weight: string;
  commission_riyals: string;
  discount_percentage: string;
  card?: any;
  setCard?: any;
  setSelectedCardId?: any;
  card_id: string;
  cost_after_tax: string;
  cardFrontKey?: string;
  setCardFronKey: React.Dispatch<React.SetStateAction<Payment_TP>>;
  paymentData?: any;
  setPaymentData?: any;
  sellingItemsData?: any;
  selectedCardId?: any;
  setCardId?: any;
  cardId?: any;
  setSelectedCardName?: any;
  selectedCardName?: any;
};

type CardSelection_TP = {
  selectedCardType: string;
  selectedCardImage: string;
};

const validationSchema = () =>
  Yup.object({
    id: Yup.string(),
    amount: Yup.number(),
    weight: Yup.string(),
  });



const PaymentProccessingToManagement = ({ 
    paymentData,
    setPaymentData,
    sellingItemsData,
    selectedCardId,
    setSelectedCardId,
    setCardId,
    cardId,
    selectedCardName,
    setSelectedCardName
 }: Payment_TP) => {

  const [card, setCard] = useState<string | undefined>("");
  const [cardImage, setCardImage] = useState<string | undefined>("");
  const [editData, setEditData] = useState<Payment_TP>();
  const [cardFrontKey, setCardFronKey] = useState<string>("");
  const [cardDiscountPercentage, setCardDiscountPercentage] = useState<string>("");
  const [frontKeyAccept, setCardFrontKeyAccept] = useState<string>("");
  const [sellingFrontKey, setSellingFrontKey] = useState<string>("")

  const handleCardSelection = (
    selectedCardType: string,
    selectedCardImage: string
  ) => {
    setCard(selectedCardType);
    setCardImage(selectedCardImage);
  };

  useEffect(() => {
    setSelectedCardId(editData?.card_id);
  }, [editData?.card_id]);

  const initialValues = {
    id: editData?.id || "",
    card: editData?.card || "",
    card_id: selectedCardId || "",
    front_key: selectedCardId || "",
    amount: editData?.amount || "",
    weight: editData?.weight || "",
  };

  const totalPriceInvoice = sellingItemsData?.reduce((total, item) => +total + +item.taklfa_after_tax, 0)

  const amountRemaining = paymentData?.reduce((total, item) => total + item.cost_after_tax ,0)

  const costRemaining = totalPriceInvoice - amountRemaining

const {
    data,
    refetch,
} = useFetch ({
    endpoint:  `/sdad/api/v1/show/${cardId || 0}`,
    queryKey: ["showValueOfCards"],
    onSuccess(data) {
      return data.data
    },
});

  useEffect(() => {
      if (cardId !== null) {
          refetch();
      }
  }, [cardId])

  return (
    <>
      <Formik
        initialValues={initialValues}
        validationSchema={() => validationSchema()}
        onSubmit={(values, { setFieldValue, resetForm, submitForm }) => {
          if (selectedCardId) {
            if (editData) {
              const updatedPaymentData = paymentData.map((item) =>
                item.id === editData.id
                  ? {
                      ...values,
                      id: editData.id,
                      card: editData?.card,
                      card_id: editData?.card_id,
                    }
                  : item
              );
              setPaymentData(updatedPaymentData);
            } else {
              const isItemExistInPaymentData = !!paymentData.find(
                (item) => item.card_id == selectedCardId
              );
              if (!isItemExistInPaymentData || !paymentData.length) {
                const newItem = {
                  ...values,
                  id: cardId,
                  card: card,
                  card_id: selectedCardId,
                  cardImage: cardImage,
                  frontkey: cardFrontKey,
                  frontKeyAccept: frontKeyAccept,
                  sellingFrontKey: sellingFrontKey,
                };

                if (+data?.value === 0 || +values.amount > +data?.value || +values.weight > +data?.value) {
                  notify("info", `${t("value is greater than the value in box")}`);
                  return
                }
                setPaymentData((prevData) => [newItem, ...prevData]);
                setSelectedCardId(null);
                setCardFronKey("");
              } else {
                notify("info", `${t("the card has been added before")}`);
              }
            }
          } else {
            notify("info", `${t("you must choose card first")}`);
          }
          setEditData(undefined);
          resetForm();
          setCard("");
        }}
      >
        {({ values, setFieldValue, resetForm }) => {
            useEffect(() => {
              if (cardId === 10001 || cardId === 10002 || cardId === 10003 || cardId === 10004) {
                setFieldValue("amount", "")
                setFieldValue("value", (data?.value)?.toFixed(2))
              } else {
                setFieldValue("weight", "")
                setFieldValue("value", (data?.value)?.toFixed(2))
              }
            }, [cardId])
          return (
            <Form>
              <div>
                <PaymentCard
                  onSelectCard={handleCardSelection}
                  selectedCardId={selectedCardId}
                  setSelectedCardId={setSelectedCardId}
                  setCardFronKey={setCardFronKey}
                  setCardFrontKeyAccept={setCardFrontKeyAccept}
                  setSellingFrontKey={setSellingFrontKey}
                  setCardDiscountPercentage={setCardDiscountPercentage}
                  setCardId={setCardId}
                  setSelectedCardName={setSelectedCardName}
                />
              </div>
              <div className={` my-6 grid grid-cols-2 lg:grid-cols-4 gap-6  ${values.amount > +costRemaining ? "items-center" : "items-end"}`}>                          
                <BaseInputField
                    id="value"
                    name="value"
                    type="text"
                    label={selectedCardName ? selectedCardName : t("Fund totals")}
                    placeholder={selectedCardName ? selectedCardName : t("Fund totals")}
                    value={(data?.value)?.toFixed(2)}
                    disabled
                    className={`bg-mainDisabled text-mainGreen ${selectedCardName && "font-semibold"}`}
                />
                {
                   (selectedCardId == 18 || selectedCardId == 21 || selectedCardId == 22 || selectedCardId == 24) 
                   ? (
                        <div className="relative">
                            <BaseInputField
                                id="weight"
                                type="text"
                                name="weight"
                                label={`${t("Gold value (in grams)")}`}
                                placeholder={`${t("Gold value (in grams)")}`}
                            />
                        </div>
                   )
                    : (
                        <div className="relative">
                            <BaseInputField
                                id="amount"
                                name="amount"
                                type="text"
                                label={`${t("amount")}`}
                                placeholder={`${t("amount")}`}
                            />
                        </div>
                     )
                } 
                <Button
                  type="submit"
                  className="animate_from_left animation_delay-11 hover:bg-orange-600 transition-all duration-300 bg-mainOrange h-10"
                >
                  {t("Addition")}
                </Button>
              </div>
              <PaymentProccessingTableToManagement
                paymentData={paymentData}
                setEditData={setEditData}
                setPaymentData={setPaymentData}
              />
            </Form>
          );
        }}
      </Formik>
    </>
  );
};

export default PaymentProccessingToManagement;