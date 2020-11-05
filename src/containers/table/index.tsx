import * as React from "react";
import MUIDataTable from "mui-datatables";
import { TableCell, TableRow } from "@material-ui/core";
import AddContactButton from "../../components/Toolbar/AddContactButton";
import Loading from "../../components/Loading";
import { GET_CONTACTS, DELETE_CONTACT, GET_USER_CONTACTS } from "../../graphql";
import { useQuery, useMutation } from "@apollo/client";
import Modal from "../../components/Modal";

interface User {
  last_name: string;
  first_name: string;
  id: string;
}

interface Email {
  email_address: string;
  id: string;
}

interface Address {
  building: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  id: string;
}

interface Phone {
  phone_number: string;
  id: string;
}

interface data {
  id: number;
  user: User;
  address: Address;
  email: Email;
  phone: Phone;
}

// interface dataU {

// }

export default function DataTable() {
  const [open, setOpen] = React.useState(false);
  const [rowSelect, setRowSelect] = React.useState({});
  const handleClick = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const { loading, error, data } = useQuery(GET_CONTACTS);
  const { loading: loadingU, error: errorU, data: dataU } = useQuery(
    GET_USER_CONTACTS
  );
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

  const column = [
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
          return <button onClick={handleClick}>Edit</button>;
        },
      },
    },
  ];

  if (loading || loadingU) return <Loading />;
  if (error || errorU) return <p>Error</p>;
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

  // const userContacts = dataU.co
  console.log(dataU);

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
    onRowClick: (rowData: any, rowState: any) => {
      setRowSelect(contact[rowState.dataIndex]);
    },
    expandableRows: true,
    expandableRowsOnClick: true,
    renderExpandableRow: (rowData: any, rowState: any) => {
      console.log(rowState, contact[rowState.dataIndex]);
      return (
        <>
          <TableRow>
            <TableCell />
            <TableCell colSpan={2} />
            <TableCell>{rowData[2]}</TableCell>
            <TableCell>{rowData[3]}</TableCell>
            <TableCell>{rowData[4]}</TableCell>
            <TableCell>{rowData[5]}</TableCell>
            <TableCell>{rowData[6]}</TableCell>
            <TableCell>{rowData[7]}</TableCell>
            <TableCell>{rowData[8]}</TableCell>
            <TableCell>TODO:EDIT BUTTON</TableCell>
          </TableRow>
        </>
      );
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
      <Modal open={open} handleClose={handleClose} rowData={rowSelect} />
    </div>
  );
}
