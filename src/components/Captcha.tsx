import { RefreshCw } from "lucide-react";
import { ChangeEvent, useState } from "react";
import { Input } from "./ui/input";

interface CaptchaProps {
  onCaptchaChange: (inputValue: string, generatedCaptcha?: string) => void;
}
export const Captcha = ({ onCaptchaChange }: CaptchaProps) => {
  const generateCaptcha = () => Math.random().toString(36).slice(2, 8);
  const [captcha, setCaptcha] = useState(generateCaptcha());

  const refreshCaptcha = () => {
    setCaptcha(generateCaptcha());
    onCaptchaChange("");
  };
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;
    onCaptchaChange(text, captcha);
  };

  return (
    <div className="flex justify-between">
      <div className="card-actions flex justify-center gap-5">
        <div className=" bg-black line-through text-white px-2 py-2 rounded-md">
          {captcha}
        </div>

        <RefreshCw
          onClick={refreshCaptcha}
          className="h-4 w-4 mt-3 transition duration-0 md:duration-150"
        />
      </div>
      <div className="flex">
        <Input
          placeholder="Enter Captcha"
          className="rounded-md h-10"
          onChange={handleInputChange}
          autoComplete="off"
        />
      </div>
    </div>
  );
};
