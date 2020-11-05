import React from "react";
import { Formik, Form, Field } from "formik";
import { Button, LinearProgress } from "@material-ui/core";
import { TextField } from "formik-material-ui";
import { useMutation, useApolloClient, useQuery } from "@apollo/client";
import {
  CREATE_CONTACT,
  GET_CONTACTS,
  UPDATE_CONTACT,
  GET_USER_CONTACTS,
} from "../../graphql";
import { uuid } from "uuidv4";

interface Values {
  email: string;
  building: string;
  street: string;
  phone: string;
  zip: string;
  city: string;
  state: string;
  firstName: string;
  lastName: string;
}

interface props {
  handleClose?: any;
  rowData?: any;
}

export default function FormPropsTextFields({ handleClose, rowData }: props) {
  const client = useApolloClient();
  const { loading, error, data, refetch } = useQuery(GET_USER_CONTACTS);

  const [insert_contact] = useMutation(CREATE_CONTACT, {
    update(cache, { data: { insert_contact } }) {
      const { user }: any = cache.readQuery({ query: GET_USER_CONTACTS });
      cache.writeQuery({
        query: GET_USER_CONTACTS,
        data: { user: user.concat([insert_contact.returning[0].user]) },
      });
    },
  });

  const [update_user] = useMutation(UPDATE_CONTACT, {
    // you can get access to all keys thats in your mutation
    update(cache, { data: { update_user } }) {
      const { user }: any = cache.readQuery({ query: GET_USER_CONTACTS });
      const { returning } = update_user;
      const contactIndex = user.findIndex((e: any) => {
        return e.id === returning[0].id;
      });
      const copyContact = [...user];
      copyContact.splice(contactIndex, 1, returning[0]);
      cache.writeQuery({
        query: GET_USER_CONTACTS,
        data: { contact: copyContact },
      });
    },
  });

  return (
    <>
      <Formik
        initialValues={{
          firstName: (rowData && rowData.firstName) || "",
          lastName: (rowData && rowData.lastName) || "",
          building: (rowData && rowData.building) || "",
          street: (rowData && rowData.street) || "",
          city: (rowData && rowData.city) || "",
          state: (rowData && rowData.state) || "",
          zip: (rowData && rowData.zip) || "",
          email: (rowData && rowData.email) || "",
          phone: (rowData && rowData.phone) || "",
        }}
        validate={(values) => {
          const errors: Partial<Values> = {};
          const {
            email,
            building,
            street,
            phone,
            city,
            state,
            zip,
            firstName,
            lastName,
          } = values;
          if (!firstName) {
            errors.firstName = "Required";
          }
          if (!lastName) {
            errors.lastName = "Required";
          }
          if (!email) {
            errors.email = "Required";
          } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email)) {
            errors.email = "Invalid email address";
          }
          if (!phone) {
            errors.phone = "Required";
          } else if (
            !/\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/i.test(phone)
          ) {
            errors.phone = "Invalid phone number";
          }

          if (!building) {
            errors.building = "Required";
          }
          if (!street) {
            errors.street = "Required";
          }
          if (!city) {
            errors.city = "Required";
          }
          if (!state) {
            errors.state = "Required";
          }
          if (!zip) {
            errors.zip = "Required";
          }

          return errors;
        }}
        onSubmit={async (values, { setSubmitting }) => {
          const {
            email,
            building,
            street,
            phone,
            city,
            state,
            zip,
            firstName,
            lastName,
          } = values;

          if (rowData) {
            const { addressId, userId, phoneId, emailId } = rowData;
            await update_user({
              variables: {
                email,
                building,
                street,
                phone,
                city,
                state,
                zip,
                firstName,
                lastName,
                addressId,
                userId,
                phoneId,
                emailId,
              },
            });
          } else {
            const { user } = await client.readQuery({
              query: GET_USER_CONTACTS,
            });
            let found = undefined;
            if (user) {
              found = user.find(
                (e: any) =>
                  e.first_name === firstName && e.last_name === lastName
              );
            }
            const userId = found ? found.id : uuid();
            await insert_contact({
              variables: { ...values, userId },
            });
          }
          await refetch();

          setSubmitting(false);
          handleClose();
        }}
      >
        {({ submitForm, isSubmitting }) => (
          <Form>
            <Field
              required={true}
              component={TextField}
              type="text"
              label="First Name"
              name="firstName"
            />
            <Field
              required={true}
              component={TextField}
              type="text"
              label="Last Name"
              name="lastName"
            />
            <br />
            <Field
              required={true}
              component={TextField}
              type="text"
              label="Building#"
              name="building"
            />
            <Field
              required={true}
              component={TextField}
              type="text"
              label="Street"
              name="street"
            />
            <Field
              required={true}
              component={TextField}
              type="text"
              label="City"
              name="city"
            />
            <Field
              required={true}
              component={TextField}
              type="text"
              label="State"
              name="state"
            />
            <Field
              required={true}
              component={TextField}
              type="text"
              label="Zip Code"
              name="zip"
            />
            <br />
            <Field
              required={true}
              component={TextField}
              name="email"
              type="email"
              label="Email"
            />
            <Field
              required={true}
              component={TextField}
              name="phone"
              type="text"
              label="Phone#"
            />
            <br />
            {isSubmitting && <LinearProgress />}
            <br />
            <Button
              variant="contained"
              color="primary"
              disabled={isSubmitting}
              onClick={submitForm}
            >
              Submit
            </Button>
          </Form>
        )}
      </Formik>
    </>
  );
}
