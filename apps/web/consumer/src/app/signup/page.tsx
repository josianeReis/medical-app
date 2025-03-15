import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Input,
  Label,
} from "@packages/ui-components";
import Link from "next/link";
import React from "react";

const Signup = () => {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <Card className="flex flex-col gap-6">
          <CardHeader>
            <CardTitle>Signup</CardTitle>
            <CardDescription>
              Enter your informations to create a new account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div>
              <Label className="mb-2" htmlFor="firtName">
                First Name
              </Label>
              <Input className="mb-2" id="firstName" />
              <Label className="mb-2" htmlFor="lastName">
                Last Name
              </Label>
              <Input className="mb-2" id="lastName" />
              <Label className="mb-2" htmlFor="email">
                Email
              </Label>
              <Input className="mb-2" placeholder="m@example.com" id="email" />
              <Label className="mb-2" htmlFor="password">
                Password
              </Label>
              <Input className="mb-2" id="password" />
              <Label className="mb-2" htmlFor="confirmPassword">
                Confirm password
              </Label>
              <Input className=" w-full" id="confirmPassword" />
              <Button className="w-full my-2 active:scale-95">Create Account</Button>
            </div>
          </CardContent>
          <CardFooter className="justify-center">
            <Label>Already have any account?</Label>
            <Link href="/login" className="hover:underline mx-2">
              Sign in
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Signup;
