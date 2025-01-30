/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

/* eslint-disable */
import * as React from "react";
import {
  Button,
  Flex,
  Grid,
  SwitchField,
  TextField,
} from "@aws-amplify/ui-react";
import { fetchByPath, getOverrideProps, validateField } from "./utils";
import { generateClient } from "aws-amplify/api";
import { getLandingEmailList } from "../../queries";
import { updateLandingEmailList } from "../../mutations";
const client = generateClient();
export default function LandingEmailListUpdateForm(props) {
  const {
    id: idProp,
    landingEmailList: landingEmailListModelProp,
    onSuccess,
    onError,
    onSubmit,
    onValidate,
    onChange,
    overrides,
    ...rest
  } = props;
  const initialValues = {
    email: "",
    createdAt: "",
    isForSurvey: false,
    isForSubscription: false,
  };
  const [email, setEmail] = React.useState(initialValues.email);
  const [createdAt, setCreatedAt] = React.useState(initialValues.createdAt);
  const [isForSurvey, setIsForSurvey] = React.useState(
    initialValues.isForSurvey
  );
  const [isForSubscription, setIsForSubscription] = React.useState(
    initialValues.isForSubscription
  );
  const [errors, setErrors] = React.useState({});
  const resetStateValues = () => {
    const cleanValues = landingEmailListRecord
      ? { ...initialValues, ...landingEmailListRecord }
      : initialValues;
    setEmail(cleanValues.email);
    setCreatedAt(cleanValues.createdAt);
    setIsForSurvey(cleanValues.isForSurvey);
    setIsForSubscription(cleanValues.isForSubscription);
    setErrors({});
  };
  const [landingEmailListRecord, setLandingEmailListRecord] = React.useState(
    landingEmailListModelProp
  );
  React.useEffect(() => {
    const queryData = async () => {
      const record = idProp
        ? (
            await client.graphql({
              query: getLandingEmailList.replaceAll("__typename", ""),
              variables: { id: idProp },
            })
          )?.data?.getLandingEmailList
        : landingEmailListModelProp;
      setLandingEmailListRecord(record);
    };
    queryData();
  }, [idProp, landingEmailListModelProp]);
  React.useEffect(resetStateValues, [landingEmailListRecord]);
  const validations = {
    email: [{ type: "Email" }],
    createdAt: [],
    isForSurvey: [],
    isForSubscription: [],
  };
  const runValidationTasks = async (
    fieldName,
    currentValue,
    getDisplayValue
  ) => {
    const value =
      currentValue && getDisplayValue
        ? getDisplayValue(currentValue)
        : currentValue;
    let validationResponse = validateField(value, validations[fieldName]);
    const customValidator = fetchByPath(onValidate, fieldName);
    if (customValidator) {
      validationResponse = await customValidator(value, validationResponse);
    }
    setErrors((errors) => ({ ...errors, [fieldName]: validationResponse }));
    return validationResponse;
  };
  const convertToLocal = (date) => {
    const df = new Intl.DateTimeFormat("default", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      calendar: "iso8601",
      numberingSystem: "latn",
      hourCycle: "h23",
    });
    const parts = df.formatToParts(date).reduce((acc, part) => {
      acc[part.type] = part.value;
      return acc;
    }, {});
    return `${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}`;
  };
  return (
    <Grid
      as="form"
      rowGap="15px"
      columnGap="15px"
      padding="20px"
      onSubmit={async (event) => {
        event.preventDefault();
        let modelFields = {
          email: email ?? null,
          createdAt: createdAt ?? null,
          isForSurvey: isForSurvey ?? null,
          isForSubscription: isForSubscription ?? null,
        };
        const validationResponses = await Promise.all(
          Object.keys(validations).reduce((promises, fieldName) => {
            if (Array.isArray(modelFields[fieldName])) {
              promises.push(
                ...modelFields[fieldName].map((item) =>
                  runValidationTasks(fieldName, item)
                )
              );
              return promises;
            }
            promises.push(
              runValidationTasks(fieldName, modelFields[fieldName])
            );
            return promises;
          }, [])
        );
        if (validationResponses.some((r) => r.hasError)) {
          return;
        }
        if (onSubmit) {
          modelFields = onSubmit(modelFields);
        }
        try {
          Object.entries(modelFields).forEach(([key, value]) => {
            if (typeof value === "string" && value === "") {
              modelFields[key] = null;
            }
          });
          await client.graphql({
            query: updateLandingEmailList.replaceAll("__typename", ""),
            variables: {
              input: {
                id: landingEmailListRecord.id,
                ...modelFields,
              },
            },
          });
          if (onSuccess) {
            onSuccess(modelFields);
          }
        } catch (err) {
          if (onError) {
            const messages = err.errors.map((e) => e.message).join("\n");
            onError(modelFields, messages);
          }
        }
      }}
      {...getOverrideProps(overrides, "LandingEmailListUpdateForm")}
      {...rest}
    >
      <TextField
        label="Email"
        isRequired={false}
        isReadOnly={false}
        value={email}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              email: value,
              createdAt,
              isForSurvey,
              isForSubscription,
            };
            const result = onChange(modelFields);
            value = result?.email ?? value;
          }
          if (errors.email?.hasError) {
            runValidationTasks("email", value);
          }
          setEmail(value);
        }}
        onBlur={() => runValidationTasks("email", email)}
        errorMessage={errors.email?.errorMessage}
        hasError={errors.email?.hasError}
        {...getOverrideProps(overrides, "email")}
      ></TextField>
      <TextField
        label="Created at"
        isRequired={false}
        isReadOnly={false}
        type="datetime-local"
        value={createdAt && convertToLocal(new Date(createdAt))}
        onChange={(e) => {
          let value =
            e.target.value === "" ? "" : new Date(e.target.value).toISOString();
          if (onChange) {
            const modelFields = {
              email,
              createdAt: value,
              isForSurvey,
              isForSubscription,
            };
            const result = onChange(modelFields);
            value = result?.createdAt ?? value;
          }
          if (errors.createdAt?.hasError) {
            runValidationTasks("createdAt", value);
          }
          setCreatedAt(value);
        }}
        onBlur={() => runValidationTasks("createdAt", createdAt)}
        errorMessage={errors.createdAt?.errorMessage}
        hasError={errors.createdAt?.hasError}
        {...getOverrideProps(overrides, "createdAt")}
      ></TextField>
      <SwitchField
        label="Is for survey"
        defaultChecked={false}
        isDisabled={false}
        isChecked={isForSurvey}
        onChange={(e) => {
          let value = e.target.checked;
          if (onChange) {
            const modelFields = {
              email,
              createdAt,
              isForSurvey: value,
              isForSubscription,
            };
            const result = onChange(modelFields);
            value = result?.isForSurvey ?? value;
          }
          if (errors.isForSurvey?.hasError) {
            runValidationTasks("isForSurvey", value);
          }
          setIsForSurvey(value);
        }}
        onBlur={() => runValidationTasks("isForSurvey", isForSurvey)}
        errorMessage={errors.isForSurvey?.errorMessage}
        hasError={errors.isForSurvey?.hasError}
        {...getOverrideProps(overrides, "isForSurvey")}
      ></SwitchField>
      <SwitchField
        label="Is for subscription"
        defaultChecked={false}
        isDisabled={false}
        isChecked={isForSubscription}
        onChange={(e) => {
          let value = e.target.checked;
          if (onChange) {
            const modelFields = {
              email,
              createdAt,
              isForSurvey,
              isForSubscription: value,
            };
            const result = onChange(modelFields);
            value = result?.isForSubscription ?? value;
          }
          if (errors.isForSubscription?.hasError) {
            runValidationTasks("isForSubscription", value);
          }
          setIsForSubscription(value);
        }}
        onBlur={() =>
          runValidationTasks("isForSubscription", isForSubscription)
        }
        errorMessage={errors.isForSubscription?.errorMessage}
        hasError={errors.isForSubscription?.hasError}
        {...getOverrideProps(overrides, "isForSubscription")}
      ></SwitchField>
      <Flex
        justifyContent="space-between"
        {...getOverrideProps(overrides, "CTAFlex")}
      >
        <Button
          children="Reset"
          type="reset"
          onClick={(event) => {
            event.preventDefault();
            resetStateValues();
          }}
          isDisabled={!(idProp || landingEmailListModelProp)}
          {...getOverrideProps(overrides, "ResetButton")}
        ></Button>
        <Flex
          gap="15px"
          {...getOverrideProps(overrides, "RightAlignCTASubFlex")}
        >
          <Button
            children="Submit"
            type="submit"
            variation="primary"
            isDisabled={
              !(idProp || landingEmailListModelProp) ||
              Object.values(errors).some((e) => e?.hasError)
            }
            {...getOverrideProps(overrides, "SubmitButton")}
          ></Button>
        </Flex>
      </Flex>
    </Grid>
  );
}
