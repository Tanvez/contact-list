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

export const GET_USER_CONTACTS = gql`
  query UserContacts {
    user {
      first_name
      last_name
      id
      contacts {
        address_id
        email_id
        id
        phone_id
        user_id
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
    $userId: uuid
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
        user: {
          data: { first_name: $firstName, last_name: $lastName, id: $userId }
          on_conflict: {
            constraint: user_pkey
            update_columns: [first_name, last_name]
          }
        }
      }
    ) {
      returning {
        user {
          id
          first_name
          last_name
          contacts {
            address_id
            email_id
            id
            phone_id
            user_id
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
          }
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
  ) {
    delete_user(where: { id: { _eq: $user_id } }) {
      affected_rows
      returning {
        last_name
        id
        first_name
      }
    }
    delete_email(where: { id: { _eq: $email_id } }) {
      affected_rows
    }
    delete_address(where: { id: { _eq: $address_id } }) {
      affected_rows
    }
    delete_phone(where: { id: { _eq: $phone_id } }) {
      affected_rows
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
    $userId: uuid! # $id: uuid!
  ) {
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
    update_user(
      where: { id: { _eq: $userId } }
      _set: { first_name: $firstName, last_name: $lastName }
    ) {
      affected_rows
      returning {
        id
        last_name
        first_name
        contacts {
          address_id
          email_id
          id
          phone_id
          user_id
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
        }
      }
    }
  }
`;
