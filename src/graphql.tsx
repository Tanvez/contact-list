import { gql } from "@apollo/client";

export const GET_CONTACTS = gql`
  query Contacts {
    contact {
      id
      email_id
      address_id
      phone_id
      user_id
      address {
        building
        city
        street
        state
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

export const GET_USER = gql`
  query User($lastName: String!, $firstName: String!) {
    user(
      where: { last_name: { _eq: $lastName }, first_name: { _eq: $firstName } }
    ) {
      id
    }
  }
`;

export const GET_CONTACT_USER = gql`
  query Contacts {
    contact(
      where: {
        user: { first_name: { _eq: "Tom" }, last_name: { _eq: "Holland" } }
      }
    ) {
      user_id
    }
  }
`;

export const CREATE_CONTACT = gql`
  mutation CreateContact(
    $email: String!
    $building: String!
    $street: String!
    $phone: String!
    $zip: String!
    $city: String!
    $state: String!
    $firstName: String!
    $lastName: String!
  ) {
    insert_contact(
      objects: {
        address: {
          data: {
            building: $building
            city: $city
            state: $state
            street: $street
            zip: $zip
          }
        }
        email: { data: { email_address: $email } }
        phone: { data: { phone_number: $phone } }
        user: { data: { first_name: $firstName, last_name: $lastName } }
      }
    ) {
      returning {
        address {
          building
          city
          state
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
          id
          first_name
          last_name
        }
      }
    }
  }
`;

export const DELETE_CONTACT = gql`
  mutation DeleteContact(
    $email_id: uuid!
    $address_id: uuid!
    $phone_id: uuid!
    $user_id: uuid!
    $id: uuid!
  ) {
    delete_contact(
      where: {
        address_id: { _eq: $address_id }
        email_id: { _eq: $email_id }
        id: { _eq: $id }
        phone_id: { _eq: $phone_id }
        user_id: { _eq: $user_id }
      }
    ) {
      affected_rows
      returning {
        address_id
        email_id
        id
        phone_id
        user_id
      }
    }
  }
`;

export const UPDATE_CONTACT = gql`
  mutation updateContact(
    $email: String!
    $building: String!
    $street: String!
    $phone: String!
    $zip: String!
    $city: String!
    $state: String!
    $firstName: String!
    $lastName: String!
    $emailId: uuid!
    $addressId: uuid!
    $phoneId: uuid!
    $userId: uuid!
    $id: uuid!
  ) {
    update_user(
      where: { id: { _eq: $userId } }
      _set: { first_name: $firstName, last_name: $lastName }
    ) {
      affected_rows
      returning {
        id
        last_name
        first_name
      }
    }
    update_phone(
      where: { id: { _eq: $phoneId } }
      _set: { phone_number: $phone }
    ) {
      affected_rows
      returning {
        id
        phone_number
      }
    }
    update_email(
      where: { id: { _eq: $emailId } }
      _set: { email_address: $email }
    ) {
      affected_rows
      returning {
        email_address
        id
      }
    }
    update_address(
      where: { id: { _eq: $addressId } }
      _set: {
        city: $city
        building: $building
        state: $state
        street: $street
        zip: $zip
      }
    ) {
      affected_rows
      returning {
        building
        city
        id
        state
        street
        zip
      }
    }
    update_contact(where: { id: { _eq: $id } }, _set: { id: $id }) {
      returning {
        id
        address {
          building
          city
          state
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
        email_id
        address_id
        phone_id
        user_id
      }
    }
  }
`;
