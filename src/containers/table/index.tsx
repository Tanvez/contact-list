import * as React from "react";
import { useQuery, gql } from "@apollo/client";
import { DataGrid, ColDef, ValueGetterParams } from "@material-ui/data-grid";
import MUIDataTable from "mui-datatables";

const columns: ColDef[] = [
  { field: "id", headerName: "ID", width: 70 },
  { field: "firstName", headerName: "First name", width: 130 },
  { field: "lastName", headerName: "Last name", width: 130 },
  { field: "building", headerName: "building", width: 90 },
  { field: "street", headerName: "street", width: 130 },
  { field: "city", headerName: "city", width: 130 },
  { field: "zip", headerName: "zip", width: 130 },
  { field: "email", headerName: "email", width: 200 },
  { field: "phone", headerName: "phone", width: 160 },
  {
    field: "fullName",
    headerName: "Full name",
    description: "This column has a value getter and is not sortable.",
    sortable: false,
    width: 160,
    valueGetter: (params: ValueGetterParams) =>
      `${params.getValue("firstName") || ""} ${
        params.getValue("lastName") || ""
      }`,
  },
];

const Contacts = gql`
  query Contacts {
    contact {
      id
      address {
        building
        city
        street
        zip
      }
      email {
        email_address
      }
      phone {
        phone_number
      }
      user {
        first_name
        last_name
      }
    }
  }
`;

interface User {
  last_name: string;
  first_name: string;
}

interface Email {
  email_address: string;
}

interface Address {
  building: string;
  street: string;
  city: string;
  zip: string;
}

interface Phone {
  phone_number: string;
}

interface data {
  id: number;
  user: User;
  address: Address;
  email: Email;
  phone: Phone;
}

interface Contact {
  id: number;
  lastName: string;
  firstName: string;
  building: string;
  street: string;
  city: string;
  zip: string;
  email: string;
  phone: string;
}

const columns2 = [
  {
    name: "name",
    label: "Name",
    options: {
      filter: true,
      sort: true,
    },
  },
  {
    name: "company",
    label: "Company",
    options: {
      filter: true,
      sort: false,
    },
  },
  {
    name: "city",
    label: "City",
    options: {
      filter: true,
      sort: false,
    },
  },
  {
    name: "state",
    label: "State",
    options: {
      filter: true,
      sort: false,
    },
  },
];
const options = {
  filterType: "checkbox" as any,
};

const data = [
  ["Joe James", "Test Corp", "Yonkers", "NY"],
  ["John Walsh", "Test Corp", "Hartford", "CT"],
  ["Bob Herm", "Test Corp", "Tampa", "FL"],
  ["James Houston", "Test Corp", "Dallas", "TX"],
];

export default function DataTable() {
  const { loading, error, data } = useQuery(Contacts);
  if (loading) return <p>Loading</p>;
  if (error) return <p>Error</p>;
  const { contact } = data;
  const formatedData = contact.map(
    ({ id, user, address, email, phone }: data) =>
      ({
        id,
        firstName: user.first_name,
        lastName: user.last_name,
        building: address.building,
        street: address.street,
        city: address.street,
        zip: address.zip,
        email: email.email_address,
        phone: phone.phone_number,
      } as Contact)
  );

  return (
    <div className="data-table" style={{ height: 400, width: "100%" }}>
      <DataGrid
        rows={formatedData}
        columns={columns}
        pageSize={5}
        checkboxSelection
      />
      {/* <MUIDataTable
        title={"Contact List"}
        data={data}
        columns={columns2}
        options={options}
      /> */}
    </div>
  );
}
