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
export declare type LandingEmailListUpdateFormInputValues = {
    email?: string;
    createdAt?: string;
    isForSurvey?: boolean;
    isForSubscription?: boolean;
};
export declare type LandingEmailListUpdateFormValidationValues = {
    email?: ValidationFunction<string>;
    createdAt?: ValidationFunction<string>;
    isForSurvey?: ValidationFunction<boolean>;
    isForSubscription?: ValidationFunction<boolean>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type LandingEmailListUpdateFormOverridesProps = {
    LandingEmailListUpdateFormGrid?: PrimitiveOverrideProps<GridProps>;
    email?: PrimitiveOverrideProps<TextFieldProps>;
    createdAt?: PrimitiveOverrideProps<TextFieldProps>;
    isForSurvey?: PrimitiveOverrideProps<SwitchFieldProps>;
    isForSubscription?: PrimitiveOverrideProps<SwitchFieldProps>;
} & EscapeHatchProps;
export declare type LandingEmailListUpdateFormProps = React.PropsWithChildren<{
    overrides?: LandingEmailListUpdateFormOverridesProps | undefined | null;
} & {
    id?: string;
    landingEmailList?: any;
    onSubmit?: (fields: LandingEmailListUpdateFormInputValues) => LandingEmailListUpdateFormInputValues;
    onSuccess?: (fields: LandingEmailListUpdateFormInputValues) => void;
    onError?: (fields: LandingEmailListUpdateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: LandingEmailListUpdateFormInputValues) => LandingEmailListUpdateFormInputValues;
    onValidate?: LandingEmailListUpdateFormValidationValues;
} & React.CSSProperties>;
export default function LandingEmailListUpdateForm(props: LandingEmailListUpdateFormProps): React.ReactElement;
