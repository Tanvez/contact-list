import * as React from "react";
import MUIDataTable from "mui-datatables";
import { TableCell, TableRow } from "@material-ui/core";
import AddContactButton from "../../components/Toolbar/AddContactButton";
import Loading from "../../components/Loading";
import { DELETE_CONTACT, GET_USER_CONTACTS } from "../../graphql";
import { useQuery, useMutation } from "@apollo/client";
import Modal from "../../components/Modal";

interface User {
  last_name: string;
  first_name: string;
  id: string;
  contact: Contact;
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

// interface data {
//   id: number;
//   user: User;
//   address: Address;
//   email: Email;
//   phone: Phone;
// }

interface Contact {
  email_id: string;
  user_id: string;
  phone_id: string;
  address_id: string;
  id: string;
  address: Address;
  user: User;
  phone: Phone;
  email: Email;
}

export default function DataTable() {
  const [open, setOpen] = React.useState(false);
  const [rowSelect, setRowSelect] = React.useState({});

  const handleClose = () => {
    setOpen(false);
  };

  const editButton = (values: any) => {
    setRowSelect(values);
    setOpen(true);
  };

  const { loading, error, data } = useQuery(GET_USER_CONTACTS);
  const [delete_user] = useMutation(DELETE_CONTACT, {
    update(cache, { data: { delete_user } }) {
      const { user }: any = cache.readQuery({
        query: GET_USER_CONTACTS,
      });
      const { returning } = delete_user;
      let c = user.filter(
        (objFromA: any) =>
          !returning.find((objFromB: any) => objFromA.id === objFromB.id)
      );
      cache.writeQuery({
        query: GET_USER_CONTACTS,
        data: { user: c },
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
    "Edit",
  ];

  if (loading) return <Loading />;
  if (error) return <p>Error</p>;

  const { user: userContacts } = data;
  const arrayData = userContacts.map((user: User) => [
    user.first_name,
    user.last_name,
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
        const { contacts } = userContacts[e.dataIndex];
        contacts.forEach(
          async ({ email_id, address_id, phone_id, user_id }: any) =>
            await delete_user({
              variables: { email_id, address_id, phone_id, user_id },
            })
        );
      });
    },
    onRowClick: (rowData: any, rowState: any) => {
      console.log({ rowData });
      setRowSelect(userContacts[rowState.dataIndex]);
    },
    expandableRows: true,
    expandableRowsOnClick: true,
    renderExpandableRow: (rowData: any, rowState: any) => {
      const { last_name, first_name, id } = userContacts[rowState.dataIndex];
      return (
        userContacts &&
        userContacts[rowState.dataIndex].contacts.map(
          ({
            address,
            email,
            phone,
            email_id,
            user_id,
            phone_id,
            address_id,
          }: Contact) => {
            return (
              <>
                <TableRow>
                  <TableCell />
                  <TableCell colSpan={2} />
                  <TableCell>{address.building}</TableCell>
                  <TableCell>{address.street}</TableCell>
                  <TableCell>{address.city}</TableCell>
                  <TableCell>{address.state}</TableCell>
                  <TableCell>{address.zip}</TableCell>
                  <TableCell>{email.email_address}</TableCell>
                  <TableCell>{phone.phone_number}</TableCell>
                  <TableCell>
                    <button
                      onClick={() =>
                        editButton({
                          lastName: last_name,
                          firstName: first_name,
                          id,
                          street: address.street,
                          building: address.building,
                          city: address.city,
                          state: address.state,
                          zip: address.zip,
                          email: email.email_address,
                          phone: phone.phone_number,
                          emailId: email_id,
                          userId: user_id,
                          phoneId: phone_id,
                          addressId: address_id,
                        })
                      }
                    >
                      Edit
                    </button>
                  </TableCell>
                </TableRow>
              </>
            );
          }
        )
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
