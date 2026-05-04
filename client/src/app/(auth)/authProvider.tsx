"use client";

import { ReactNode, useEffect, useMemo } from "react";
import { Amplify } from "aws-amplify";
import {
  Authenticator,
  Heading,
  Radio,
  RadioGroupField,
  useAuthenticator,
  View,
} from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import { usePathname, useRouter } from "next/navigation";

/* ---------------- Amplify Config (RUN ONCE) ---------------- */

const amplifyConfigured = (() => {
  Amplify.configure({
    Auth: {
      Cognito: {
        userPoolId: process.env.NEXT_PUBLIC_AWS_COGNITO_USER_POOL_ID!,
        userPoolClientId:
          process.env.NEXT_PUBLIC_AWS_COGNITO_USER_POOL_CLIENT_ID!,
      },
    },
  });
  return true;
})();

/* ---------------- Auth UI Customizations ---------------- */

const components = {
  Header() {
    return (
      <View className="mb-7 mt-4">
        <Heading level={3} className="!text-2xl !font-bold">
          ZEN
          <span className="font-medium text-red-500">villa</span>
        </Heading>
        <p className="mt-2 text-muted-foreground">
          <span className="font-bold">Welcome!</span> Please sign in to continue
        </p>
      </View>
    );
  },

  SignIn: {
    Footer() {
      const { toSignUp } = useAuthenticator();
      return (
        <View className="mt-4 text-center">
          <p className="text-muted-foreground">
            Don&apos;t have an account?{" "}
            <button
              onClick={toSignUp}
              className="bg-transparent p-0 text-primary hover:underline"
            >
              Sign up here
            </button>
          </p>
        </View>
      );
    },
  },

  SignUp: {
    FormFields() {
      const { validationErrors } = useAuthenticator();

      return (
        <>
          <Authenticator.SignUp.FormFields />
          <RadioGroupField
            legend="Role"
            name="custom:role"
            isRequired
            hasError={!!validationErrors?.["custom:role"]}
            errorMessage={validationErrors?.["custom:role"]}
          >
            <Radio value="tenant">Tenant</Radio>
            <Radio value="manager">Manager</Radio>
          </RadioGroupField>
        </>
      );
    },

    Footer() {
      const { toSignIn } = useAuthenticator();
      return (
        <View className="mt-4 text-center">
          <p className="text-muted-foreground">
            Already have an account?{" "}
            <button
              onClick={toSignIn}
              className="bg-transparent p-0 text-primary hover:underline"
            >
              Sign in
            </button>
          </p>
        </View>
      );
    },
  },
};

/* ---------------- Form Field Config ---------------- */

const formFields = {
  signIn: {
    username: {
      label: "Email",
      placeholder: "Enter your email",
      isRequired: true,
    },
    password: {
      label: "Password",
      placeholder: "Enter your password",
      isRequired: true,
    },
  },
  signUp: {
    username: {
      order: 1,
      label: "Username",
      placeholder: "Choose a username",
      isRequired: true,
    },
    email: {
      order: 2,
      label: "Email",
      placeholder: "Enter your email address",
      isRequired: true,
    },
    password: {
      order: 3,
      label: "Password",
      placeholder: "Create a password",
      isRequired: true,
    },
    confirm_password: {
      order: 4,
      label: "Confirm Password",
      placeholder: "Confirm your password",
      isRequired: true,
    },
  },
};

/* ---------------- Component ---------------- */

interface AuthLayoutProps {
  children: ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
  const { user, isLoading } = useAuthenticator((ctx) => [
    ctx.user,
    ctx.isLoading,
  ]);

  const router = useRouter();
  const pathname = usePathname();

  const isAuthPage =
    pathname.startsWith("/signin") || pathname.startsWith("/signup");
  const isProtectedPage =
    pathname.startsWith("/manager") || pathname.startsWith("/tenants");

  /* ---------------- Redirect Logic ---------------- */

  useEffect(() => {
    if (isLoading) return;

    // Logged-in users should never see auth pages
    if (user && isAuthPage) {
      router.replace("/landing");
    }
  }, [user, isAuthPage, isLoading, router]);

  /* ---------------- Route Guards ---------------- */

  // Public pages → no auth wrapper
  if (!isAuthPage && !isProtectedPage) {
    return <>{children}</>;
  }

  return (
    <div className="h-full">
      <Authenticator
        initialState={pathname.includes("signup") ? "signUp" : "signIn"}
        components={components}
        formFields={formFields}
      >
        {() => <>{children}</>}
      </Authenticator>
    </div>
  );
};

export default AuthLayout;
