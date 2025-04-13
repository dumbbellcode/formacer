import { AccurateDetailItem, CreativeDetails, DetailItem } from "@/types/common"

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
  {
    label: "Country",
    id: "country",
    section: "Contact",
    autocomplete: "country-name",
    value: "",
  },
  {
    label: "Company",
    id: "company",
    section: "Work",
    autocomplete: "organization",
    value: "",
  },
]

export const initialCreativeDetailFields: DetailItem[] = [
  {
    label: "About Me",
    value: "",
    id: "aboutMe",
  },
]
