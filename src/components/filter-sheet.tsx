import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

interface FilterSheetProps {
  sheetState: boolean;
  setSheetState: () => void;
}

const FilterSheet: React.FC<FilterSheetProps> = ({
  setSheetState,
  sheetState,
}) => {
  return (
    <Sheet open={sheetState} onOpenChange={setSheetState}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Filters</SheetTitle>
          <SheetDescription>Apply Filters</SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-2">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="ticketId" className="text-left">
              Ticket Id
            </Label>
            <Input
              id="ticketId"
              type="number"
              value={0}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="ticketBucket" className="text-left">
              Ticket Bucket
            </Label>
            <Input
              id="ticketBucket"
              type="text"
              value=""
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="createdOn" className="text-left">
              Created On
            </Label>
            <Input id="createdOn" type="date" value="" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="createdBy" className="text-left">
              Created By
            </Label>
            <Input id="createdBy" type="text" value="" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="severity" className="text-left">
              Severity
            </Label>
            <Input id="severity" type="text" value="" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="subject" className="text-left">
              Subject
            </Label>
            <Input id="subject" type="text" value="" className="col-span-3" />
          </div>
          {/* <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="technician" className="text-left">
            Technician
          </Label>
          <Input
            id="technician"
            type="text"
            value=""
            className="col-span-3"
          />
        </div> */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="dueDate" className="text-left">
              Due Date
            </Label>
            <Input id="dueDate" type="date" value="" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="breachStatus" className="text-left">
              Breach Status
            </Label>
            <Input
              id="breachStatus"
              type="text"
              value=""
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4 ">
            <Label htmlFor="assigned/Pickup" className="text-left">
              Assigned/Pickup
            </Label>
            <Input
              id="assignedPickup"
              type="text"
              value=""
              className="col-span-3"
            />
          </div>
        </div>

        <SheetFooter>
          <SheetClose asChild>
            <Button type="submit">Apply</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default FilterSheet;
