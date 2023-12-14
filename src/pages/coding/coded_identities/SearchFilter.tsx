import { Form, Formik } from "formik";
import { t } from "i18next";
import {
  BaseInputField,
  DateInputField,
  Select,
} from "../../../components/molecules";
import { Button } from "../../../components/atoms";
import { SelectBranches } from "../../../components/templates/reusableComponants/branches/SelectBranches";
import SelectCategory from "../../../components/templates/reusableComponants/categories/select/SelectCategory";
import { useFetch } from "../../../hooks";

const SearchFilter = ({ getSearchResults }) => {
  const initailSearchValues = {
    id: "",
    hwya: "",
    karat_id: "",
    bond_id: "",
    category_id: "",
    wage: "",
    country_id: "",
    created_at: "",
    coding_date_from: "",
    coding_date_to: "",
    damg: "",
    mineral_id: "",
    stage: "",
    modal_number: "",
    weight: "",
  };

  const identitiesForMergeOption = [
    { id: 25, label: "طقم", name: "طقم", value: "طقم" },
    {
      id: 26,
      label: "حلق",
      name: "حلق",
      value: "حلق",
    },
  ];

  // COUNTRIES OPTION
  const { data: countriesOption } = useFetch({
    endpoint: "/governorate/api/v1/countries",
    queryKey: ["countries_option"],
    select: (countries) =>
      countries.map((country: any) => ({
        id: country?.id,
        label: country?.name,
        name: country?.name,
        value: country?.id,
      })),
  });

  // METAL OPTION
  const { data: metalOption } = useFetch({
    endpoint: "/classification/api/v1/minerals?type=all",
    queryKey: ["metal_option"],
    select: (metals) =>
      metals.map((metal: any) => ({
        id: metal?.id,
        label: metal?.name_ar,
        name: metal?.name_ar,
        value: metal?.id,
      })),
  });

  // METAL OPTION
  const { data: karatOption } = useFetch({
    endpoint: "/classification/api/v1/karats",
    queryKey: ["karat_option"],
    select: (karats) =>
      karats.map((karat: any) => ({
        id: karat?.id,
        label: karat?.name,
        name: karat?.name,
        value: karat?.id,
      })),
  });

  // METAL OPTION
  const { data: karatMineralsOption } = useFetch({
    endpoint: "/classification/api/v1/karatminerals?type=all",
    queryKey: ["karat_mineral_option"],
    select: (karats) =>
      karats.map((karat: any) => ({
        id: karat?.id,
        label: karat?.karatmineral,
        name: karat?.karatmineral,
        value: karat?.id,
      })),
  });

  const handleResetForm = (formik) => {
    formik.resetForm();
  };

  return (
    <div className="py-10 flex-col flex">
      <h2 className="mb-6 text-xl font-bold text-slate-700">
        {t("search filter")}
      </h2>
      <Formik
        initialValues={initailSearchValues}
        onSubmit={(values) => {
          getSearchResults(values);
        }}
      >
        {(formik) => (
          <Form>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 items-center gap-8 ">
              <BaseInputField
                id="id"
                label={`${t("id")}`}
                name="id"
                type="text"
                placeholder={`${t("id")}`}
              />
              <BaseInputField
                id="hwya"
                label={`${t("hwya")}`}
                name="hwya"
                type="text"
                placeholder={`${t("hwya")}`}
              />
              <div className="">
                <Select
                  id="karat_id"
                  label={`${t("karat")}`}
                  name="karat_id"
                  placeholder={`${t("karat")}`}
                  loadingPlaceholder={`${t("loading")}`}
                  options={karatOption}
                />
              </div>
              <BaseInputField
                id="bond_id"
                label={`${t("supply voucher number")}`}
                name="bond_id"
                type="text"
                placeholder={`${t("supply voucher number")}`}
              />
              <div className="">
                <SelectCategory
                  name="category_id"
                  all={true}
                  showItems={true}
                  label={t("classification")}
                />
              </div>
              <BaseInputField
                id="wage"
                label={`${t("wage")}`}
                name="wage"
                type="text"
                placeholder={`${t("wage")}`}
              />
              <div className="">
                <Select
                  id="country_id"
                  label={`${t("country of origin")}`}
                  name="country_id"
                  placeholder={`${t("country of origin")}`}
                  loadingPlaceholder={`${t("loading")}`}
                  options={countriesOption}
                />
              </div>
              <DateInputField
                label={`${t("coding date")}`}
                placeholder={`${t("coding date")}`}
                name="created_at"
                labelProps={{ className: "mt--10" }}
              />
              <DateInputField
                label={`${t("coding date from")}`}
                placeholder={`${t("coding date from")}`}
                name="coding_date_from"
                labelProps={{ className: "mt--10" }}
              />
              <DateInputField
                label={`${t("coding date to")}`}
                placeholder={`${t("coding date to")}`}
                name="coding_date_to"
                labelProps={{ className: "mt--10" }}
              />
              <div className="">
                <Select
                  id="damg"
                  label={`${t("identities for merging")}`}
                  name="damg"
                  placeholder={`${t("identities for merging")}`}
                  loadingPlaceholder={`${t("loading")}`}
                  options={identitiesForMergeOption}
                />
              </div>
              <div className="">
                <Select
                  id="mineral_id"
                  label={`${t("metal type")}`}
                  name="mineral_id"
                  placeholder={`${t("metal type")}`}
                  loadingPlaceholder={`${t("loading")}`}
                  options={metalOption}
                />
              </div>
              <div className="">
                <Select
                  id="karatmineral_id"
                  label={`${t("mineral karat")}`}
                  name="karatmineral_id"
                  placeholder={`${t("mineral karat")}`}
                  loadingPlaceholder={`${t("loading")}`}
                  options={karatMineralsOption}
                />
              </div>
              <BaseInputField
                id="modal_number"
                label={`${t("modal number")}`}
                name="modal_number"
                type="text"
                placeholder={`${t("modal number")}`}
              />
              <BaseInputField
                id="weight"
                label={`${t("weight")}`}
                name="weight"
                type="text"
                placeholder={`${t("weight")}`}
              />
              <div className="">
                <SelectBranches name="stage" />
              </div>
            </div>

            {/* BUTTONS */}
            <div className="flex mt-6 gap-4 justify-end">
              <Button
                action={() => handleResetForm(formik)}
                className="bg-mainGreen text-white"
              >
                تفريغ البحث
              </Button>
              <Button type="submit" className="bg-mainGreen text-white">
                بحث
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default SearchFilter;
