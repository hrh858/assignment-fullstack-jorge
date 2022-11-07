import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";

export default function AddNewActivityForm(props: {
  activityTypes: string[];
  onAccept: (activityData: {
    type: string;
    amount: number;
    date: Date;
  }) => void;
}) {
  const { activityTypes, onAccept } = props;

  const [selectedActivityType, setSelectedActivityType] = useState(
    activityTypes[0]
  );
  const [amount, setAmount] = useState(0);
  const [selectedDate, setSelectedDate] = useState(new Date());

  return (
    <div className="flex flex-col w-full gap-2">
      <div className="flex flex-row items-center justify-between">
        <div className="flex flex-col font-semibold">
          <p className="">1. Activity type</p>
          <p className="font font-light text-xs">
            Select one of the available activity types
          </p>
        </div>
        <select
          onChange={(e) => setSelectedActivityType(e.target.value)}
          className="bg-hanagreen rounded text-hanastone px-2 py-1 w-40"
        >
          {activityTypes.map((at) => (
            <option key={at}>{at.toLocaleUpperCase()}</option>
          ))}
        </select>
      </div>
      <div className="flex flex-row items-center justify-between">
        <div className="flex flex-col font-semibold">
          <p>2. Amount</p>
          <p className="font-light text-xs">
            Enter the emission amount for this activty
          </p>
        </div>
        <input
          onChange={(e) => setAmount(parseInt(e.target.value))}
          type={"number"}
          min={0}
          className="rounded bg-hanagreen text-hanastone px-2 py-1 w-40"
          placeholder="0"
        />
      </div>
      <div className="flex flex-row items-center justify-between">
        <div className="flex flex-col font-semibold">
          <p>3. Date</p>
          <p className="font-light text-xs">
            Input a date <span>*in the past*</span> for this activity
          </p>
        </div>
        <input
          type={"date"}
          value={selectedDate.toISOString().substring(0, 10)}
          defaultValue={new Date().toDateString().substring(0, 10)}
          max={new Date().toDateString().substring(0, 10)}
          onChange={(e) => setSelectedDate(new Date(e.target.value))}
          className="bg-hanagreen px-2 py-1 text-hanastone rounded w-40"
        />
      </div>
      <button
        onClick={() =>
          onAccept({
            type: selectedActivityType,
            amount: amount,
            date: selectedDate,
          })
        }
        className="flex flex-row items-center justify-center gap-2 bg-hanagreen text-hanastone rounded w-min px-2 py-1 self-center mt-4"
      >
        <FontAwesomeIcon icon={faCheck} />
        <p>Accept</p>
      </button>
    </div>
  );
}
