import { AccurateDetailItem, DetailItem } from "@/types/common"

const personalAddressFields = [
  {
    label: "Address",
    id: "personal-address",
    section: "Personal Address",
    autocomplete: "address-line1",
    colSpan: 4,
    value: "",
  },
  {
    label: "City",
    id: "personal-city",
    section: "Personal Address",
    autocomplete: "address-level2",
    value: "",
  },
  {
    label: "State",
    id: "personal-state",
    section: "Personal Address",
    autocomplete: "address-level1",
    value: "",
  },
  {
    label: "Country",
    id: "personal-country",
    section: "Personal Address",
    autocomplete: "country-name",
    value: "",
  },
  {
    label: "Zip Code",
    id: "personal-zip-code",
    section: "Personal Address",
    autocomplete: "postal-code",
    value: "",
  },
]

export const initialAccurateDetailFields: AccurateDetailItem[] = [
  {
    label: "First Name",
    id: "firstName",
    value: "",
    section: "Name",
    autocomplete: "given-name",
  },
  {
    label: "Last Name",
    value: "",
    id: "lastName",
    section: "Name",
    autocomplete: "family-name",
  },
  {
    label: "Email",
    id: "email",
    section: "Contact",
    autocomplete: "email",
    value: "",
  },
  {
    label: "Phone No.",
    id: "phone",
    section: "Contact",
    autocomplete: "tel-national",
    value: "",
  },
  ...personalAddressFields,
]

export const initialCreativeDetailFields: DetailItem[] = [
  {
    label: "About Me",
    value: "",
    id: "aboutMe",
  },
]
