import { Email_TP } from "../../../../types";

export type Supplier_TP = {
  type: "local" | "global",
  is_mediator: boolean,
  gold_tax: boolean,
  wages_tax: boolean,
  name: string,
  company_name: string,
  country_id: string,
  city_id: string,
  address: string,
  mobile: string,
  phone: string,
  fax: string,
  email: Email_TP,
  password: string,
  nationality_id: string,
  national_number: string,
  national_expire_date: Date,
  logo: any,
  district_id: string,
  min_Address: string,
  building_number: string,
  street_number: string,
  sub_number: string,
  postal_number: string,
}