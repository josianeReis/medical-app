import { getCurrentUser } from "@/services/auth";
import { SignupForm } from "./Signup";
import { redirect } from "@/i18n/navigation";

const Signup = async () => {
  const user = await getCurrentUser();
  if (user) {
    redirect({
      href: "/organizations",
      locale: user.language,
    });
  }

  return <SignupForm />;
};

export default Signup;
