import * as React from "react";
import MUIDataTable from "mui-datatables";
import AddContactButton from "../../components/Toolbar/AddContactButton";
import Loading from "../../components/Loading";
import { GET_CONTACTS, DELETE_CONTACT } from "../../graphql";
import { useQuery, useMutation } from "@apollo/client";

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
  state: string;
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

export const column = [
  "First Name",
  "Last Name",
  "Building",
  "Street",
  "City",
  "State",
  "Zip",
  "Email",
  "Phone",
  {
    name: "Edit",
    options: {
      filter: false,
      sort: false,
      empty: true,
      customBodyRenderLite: (dataIndex: any, rowIndex: any) => {
        return (
          <button
            onClick={() =>
              window.alert(
                `Clicked "Edit" for row ${rowIndex} with dataIndex of ${dataIndex}`
              )
            }
          >
            Edit
          </button>
        );
      },
    },
  },
];

export default function DataTable() {
  const { loading, error, data } = useQuery(GET_CONTACTS);
  const [delete_contact] = useMutation(DELETE_CONTACT, {
    update(cache, { data: { delete_contact } }) {
      const { contact }: any = cache.readQuery({ query: GET_CONTACTS });
      const { returning } = delete_contact;
      var c = contact.filter(
        (objFromA: any) =>
          !returning.find((objFromB: any) => objFromA.id === objFromB.id)
      );
      cache.writeQuery({
        query: GET_CONTACTS,
        data: { contact: c },
      });
    },
  });

  if (loading) return <Loading />;
  if (error) return <p>Error</p>;
  const { contact } = data;

  const arrayData = contact.map(({ user, address, email, phone }: data) => [
    user.first_name,
    user.last_name,
    address.building,
    address.street,
    address.city,
    address.state,
    address.zip,
    email.email_address,
    phone.phone_number,
  ]);

  const options = {
    filterType: "checkbox" as any,
    download: false,
    print: false,
    filter: false,
    viewColumns: false,
    customToolbar: () => <AddContactButton />,
    onRowsDelete: (row: any) => {
      const { data } = row;
      data.forEach((e: any) => {
        const { email_id, address_id, phone_id, user_id, id } = contact[
          e.dataIndex
        ];
        delete_contact({
          variables: { email_id, address_id, phone_id, user_id, id },
        });
      });
    },
  };

  return (
    <div className="data-table" style={{ height: 400, width: "100%" }}>
      <MUIDataTable
        title=""
        data={arrayData}
        columns={column}
        options={options}
      />
    </div>
  );
}

const data = {
  email: "6585147a-0060-4b63-9e96-6e898b891f2a",
  phone: "737004ab-7074-4e3f-9f48-82d0ea252fd5",
  user: "7a486567-cc99-45e0-a4be-f31d36b2d898",
  address: "11b4d254-56b7-4238-ad61-0c3425c019f5",
};
