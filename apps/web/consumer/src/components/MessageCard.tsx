import {
    Button,
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@packages/ui-components";
import {
    ChevronLeft,
    CircleCheckBig,
    CircleX
} from "lucide-react";
import Link from "next/link";

interface MessageCardProps {
  title: string;
  description: string;
  description2?: string;
  backButton: string;
  backButtonHref: string;
  icon?: React.ReactNode;
  variant?: "error" | "success" | "custom";
}
export const MessageCard = ({
  title,
  description,
  description2,
  backButton,
  backButtonHref,
  variant = "success",
  icon,
}: MessageCardProps) => {
  switch (variant) {
    case "error":
      icon = <CircleX className="text-red-500" />;
      break;
    case "success":
      icon = <CircleCheckBig className="text-green-500" />;
      break;
    case "custom":
      icon = icon;
      break;

    default:
      break;
  }

  return (
    <Card className="flex flex-col gap-6">
      <CardHeader className="items-center justify-center gap-2">
        <div className="m-2">{icon}</div>
        <CardTitle className="text-2xl">{title}</CardTitle>
        <CardDescription className=" text-center text-slate-950">
          <p>{description}</p>
          {description2 && <p>{description2}</p>}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <CardFooter className="items-center justify-center">
          <Button variant="outline" asChild>
            <Link href={backButtonHref}>
              <ChevronLeft />
              {backButton}
            </Link>
          </Button>
        </CardFooter>
      </CardContent>
    </Card>
  );
};
