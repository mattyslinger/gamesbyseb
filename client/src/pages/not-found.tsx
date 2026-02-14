import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { wogId } from "../lib/wog-id";

export default function NotFound() {
  return (
    <div data-wog-id={wogId("NF", 1)} className="min-h-screen w-full flex items-center justify-center bg-gray-50">
      <Card data-wog-id={wogId("NF", 2)} className="w-full max-w-md mx-4">
        <CardContent data-wog-id={wogId("NF", 3)} className="pt-6">
          <div data-wog-id={wogId("NF", 4)} className="flex mb-4 gap-2">
            <AlertCircle className="h-8 w-8 text-red-500" />
            <h1 data-wog-id={wogId("NF", 5)} className="text-2xl font-bold text-gray-900">404 Page Not Found</h1>
          </div>

          <p data-wog-id={wogId("NF", 6)} className="mt-4 text-sm text-gray-600">
            Did you forget to add the page to the router?
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
