/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createLandingEmailList = /* GraphQL */ `
  mutation CreateLandingEmailList(
    $input: CreateLandingEmailListInput!
    $condition: ModelLandingEmailListConditionInput
  ) {
    createLandingEmailList(input: $input, condition: $condition) {
      id
      email
      createdAt
      isForSurvey
      isForSubscription
      updatedAt
      __typename
    }
  }
`;
export const updateLandingEmailList = /* GraphQL */ `
  mutation UpdateLandingEmailList(
    $input: UpdateLandingEmailListInput!
    $condition: ModelLandingEmailListConditionInput
  ) {
    updateLandingEmailList(input: $input, condition: $condition) {
      id
      email
      createdAt
      isForSurvey
      isForSubscription
      updatedAt
      __typename
    }
  }
`;
export const deleteLandingEmailList = /* GraphQL */ `
  mutation DeleteLandingEmailList(
    $input: DeleteLandingEmailListInput!
    $condition: ModelLandingEmailListConditionInput
  ) {
    deleteLandingEmailList(input: $input, condition: $condition) {
      id
      email
      createdAt
      isForSurvey
      isForSubscription
      updatedAt
      __typename
    }
  }
`;
