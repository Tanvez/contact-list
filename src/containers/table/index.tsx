import * as React from "react";
import MUIDataTable from "mui-datatables";
import AddContactButton from "../../components/Toolbar/AddContactButton";
import Loading from "../../components/Loading";
import { GET_CONTACTS } from "../../graphql";
import { useQuery } from "@apollo/client";

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
];

export default function DataTable() {
  const { loading, error, data } = useQuery(GET_CONTACTS);

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
    // rowsSelected: rowSelected,
    // onRowSelectionChange: (
    //   rowsSelectedData: any,
    //   allRows: any,
    //   rowsSelected: any
    // ) => {
    //   console.log(rowsSelectedData, allRows, rowsSelected);
    //   setRowSelected(rowsSelected);
    // },
    // onRowsDelete: (rowsDeleted: any, newData: any) => {
    //   console.log("rowsDeleted", rowsDeleted, newData);
    // console.dir(rowsDeleted);
    // console.dir(newData);
    // if (rowsDeleted && rowsDeleted.data && rowsDeleted.data[0] && rowsDeleted.data[0].dataIndex === 0) {
    //   window.alert('Can\'t delete this!');
    //   return false;
    // };
    // this.setState({
    //   data: newData,
    //   rowsSelected: []
    // });
    // console.log(rowsDeleted, "were deleted!");
    //   return {};
    // },
    customToolbar: () => <AddContactButton />,
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
