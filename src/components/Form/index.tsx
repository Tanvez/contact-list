import React from "react";
import { Formik, Form, Field } from "formik";
import { Button, LinearProgress } from "@material-ui/core";
import { TextField } from "formik-material-ui";
import { useMutation } from "@apollo/client";
import { CREATE_CONTACT, GET_CONTACTS } from "../../graphql";

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
}

export default function FormPropsTextFields({ handleClose }: props) {
  const [insert_contact] = useMutation(CREATE_CONTACT, {
    update(cache, { data: { insert_contact } }) {
      const { contact }: any = cache.readQuery({ query: GET_CONTACTS });
      cache.writeQuery({
        query: GET_CONTACTS,
        data: { contact: contact.concat([insert_contact.returning[0]]) },
      });
    },
  });
  return (
    <>
      <Formik
        initialValues={{
          email: "",
          building: "",
          street: "",
          phone: "",
          city: "",
          state: "",
          zip: "",
          firstName: "",
          lastName: "",
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
        onSubmit={(values, { setSubmitting }) => {
          insert_contact({
            variables: values,
          });

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
