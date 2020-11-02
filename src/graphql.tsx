import { gql } from "@apollo/client";

export const GET_CONTACTS = gql`
  query Contacts {
    contact {
      id
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
        id
        first_name
        last_name
      }
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
