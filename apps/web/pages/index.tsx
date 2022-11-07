import { faAdd, faWarning } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Dialog from "../components/Dialog";
import WithNavbarPageWrapper from "../components/WithNavbarPageWrapper";
import { GetServerSideProps } from "next";
import { useCallback, useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import AddNewActivityForm from "../components/AddNewActivityForm";
import { type } from "os";
import ActivitiesDisplayer from "../components/ActivitiesDisplayer";

export default function Index(props: { activityTypes: string[] }) {
  const { activityTypes } = props;

  const [showAddActivityDialog, setShowAddActivityDialog] = useState(false);
  const [dateToQuery, setDateToQuery] = useState<string>(
    new Date().toISOString().substring(0, 10)
  );

  const queryClient = useQueryClient();
  const { data } = useQuery({
    queryKey: `activities_${dateToQuery}`,
    queryFn: async () => {
      const res = await fetch(
        `http://localhost:9080/climatix/activities?date=${dateToQuery}`
      );
      const a = await res.json();
      return a;
    },
  });

  const onAddNewActivity = useCallback(
    async (activityData: { type: string; amount: number; date: Date }) => {
      setShowAddActivityDialog(false);

      const date = activityData.date.toISOString().substring(0, 10);
      const body = {
        activityType: activityData.type.toLowerCase(),
        amount: activityData.amount,
        activityDate: date,
      };
      await fetch("http://localhost:9080/climatix/activities", {
        method: "POST",
        body: JSON.stringify(body),
        headers: { "Content-Type": "application/json" },
      });
      queryClient.invalidateQueries(`activities_${date}`);
    },
    [queryClient]
  );

  return (
    <WithNavbarPageWrapper>
      <div className="w-full h-auto flex flex-row items-center justify-between pt-4 mb-4">
        <p className="text-lg text-hanagreen">
          Activities for{" "}
          <input
            onChange={(e) => {
              const date = e.target.value as string;
              const dateString = new Date(date).toISOString().substring(0, 10);
              setDateToQuery(dateString);
            }}
            type="date"
            className="bg-transparent font-bold"
            value={dateToQuery}
          />
        </p>
        <button
          onClick={() => setShowAddActivityDialog(true)}
          className="px-4 rounded text-hanastone h-10 bg-hanagreen flex flex-row items-center justify-center gap-4"
        >
          <FontAwesomeIcon icon={faAdd} size="sm" />
          Register new activity
        </button>
      </div>
      {data && data.length === 0 && (
        <p className="w-full self-center font-bold text-center text-hanagreen gap-2 flex flex-row items-center justify-center">
          <FontAwesomeIcon icon={faWarning} />
          Add activities to this date to visualize them here
          <FontAwesomeIcon icon={faWarning} />{" "}
        </p>
      )}
      {data && <ActivitiesDisplayer data={data} />}
      <Dialog
        title="Add new activity"
        visible={showAddActivityDialog}
        onExit={() => setShowAddActivityDialog(false)}
      >
        <AddNewActivityForm
          activityTypes={activityTypes}
          onAccept={onAddNewActivity}
        />
      </Dialog>
    </WithNavbarPageWrapper>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const res = await fetch("http://localhost:9080/climatix/activityTypes");
  const data = await res.json();
  console.log(data);
  return {
    props: { activityTypes: data },
  };
};
