/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

import * as React from "react";
import { GridProps, SwitchFieldProps, TextFieldProps } from "@aws-amplify/ui-react";
export declare type EscapeHatchProps = {
    [elementHierarchy: string]: Record<string, unknown>;
} | null;
export declare type VariantValues = {
    [key: string]: string;
};
export declare type Variant = {
    variantValues: VariantValues;
    overrides: EscapeHatchProps;
};
export declare type ValidationResponse = {
    hasError: boolean;
    errorMessage?: string;
};
export declare type ValidationFunction<T> = (value: T, validationResponse: ValidationResponse) => ValidationResponse | Promise<ValidationResponse>;
export declare type LandingEmailListCreateFormInputValues = {
    email?: string;
    createdAt?: string;
    isForSurvey?: boolean;
    isForSubscription?: boolean;
};
export declare type LandingEmailListCreateFormValidationValues = {
    email?: ValidationFunction<string>;
    createdAt?: ValidationFunction<string>;
    isForSurvey?: ValidationFunction<boolean>;
    isForSubscription?: ValidationFunction<boolean>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type LandingEmailListCreateFormOverridesProps = {
    LandingEmailListCreateFormGrid?: PrimitiveOverrideProps<GridProps>;
    email?: PrimitiveOverrideProps<TextFieldProps>;
    createdAt?: PrimitiveOverrideProps<TextFieldProps>;
    isForSurvey?: PrimitiveOverrideProps<SwitchFieldProps>;
    isForSubscription?: PrimitiveOverrideProps<SwitchFieldProps>;
} & EscapeHatchProps;
export declare type LandingEmailListCreateFormProps = React.PropsWithChildren<{
    overrides?: LandingEmailListCreateFormOverridesProps | undefined | null;
} & {
    clearOnSuccess?: boolean;
    onSubmit?: (fields: LandingEmailListCreateFormInputValues) => LandingEmailListCreateFormInputValues;
    onSuccess?: (fields: LandingEmailListCreateFormInputValues) => void;
    onError?: (fields: LandingEmailListCreateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: LandingEmailListCreateFormInputValues) => LandingEmailListCreateFormInputValues;
    onValidate?: LandingEmailListCreateFormValidationValues;
} & React.CSSProperties>;
export default function LandingEmailListCreateForm(props: LandingEmailListCreateFormProps): React.ReactElement;
