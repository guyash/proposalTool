/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getLandingEmailList = /* GraphQL */ `
  query GetLandingEmailList($id: ID!) {
    getLandingEmailList(id: $id) {
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
export const listLandingEmailLists = /* GraphQL */ `
  query ListLandingEmailLists(
    $filter: ModelLandingEmailListFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listLandingEmailLists(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        email
        createdAt
        isForSurvey
        isForSubscription
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
