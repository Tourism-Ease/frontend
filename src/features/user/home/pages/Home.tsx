import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../../../components/ui/avatar";
import { Button } from "../../../../components/ui/Button";

export default function Home() {
  return (
    <>
      <div className="flex min-h-svh flex-col items-center justify-center">
        <h1 className="text-4xl font-bold text-blue-700 leading-tight mb-4">
          TailwindCSS works
        </h1>

        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <Button>Shadcn works</Button>
      </div>
    </>
  );
}
