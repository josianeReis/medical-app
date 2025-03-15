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
import { FcGoogle } from "react-icons/fc";

const Login = () => {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6">
      <div className="w-full max-w-sm">
      <Card className="flex flex-col gap-6">
      <CardHeader>
        <CardTitle>Login</CardTitle>
        <CardDescription>
          Enter your email below to login to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-2 ">
          <Label htmlFor="email" className="mb-2">
            Email
          </Label>
          <Input id="email" placeholder="m@example.com" />
          <div className="grid grid-cols-2 my-2 gap-5">
            <Label htmlFor="password" >Password</Label>
            <Link href="" className="hover:underline text-sm ">
              Forgot your password?
            </Link>
          </div>
          <Input className="mb-2" id="password" />
          <Button className="my-2 w-full  active:scale-95">Login</Button>
          <div>
            <Button className="w-full active:scale-95 gap-2">
              <span>Login with</span>
              <span className="flex flex-row items-center ">
                <FcGoogle size={20} />
                <span>oogle</span>
              </span>
            </Button>
          </div>
        </div>
      </CardContent>
      <CardFooter className="justify-center">
        <Label> Don&apos;t have an account?</Label>
        <Link href="/signup" className="hover:underline mx-2">
          Sign up
        </Link>
      </CardFooter>
    </Card>
      </div>
    </div>
   
  );
};

export default Login;
