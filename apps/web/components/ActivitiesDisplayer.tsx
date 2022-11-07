import { faEye, faEyeSlash, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { useQueryClient } from "react-query";

export type Activity = {
  uuid: string;
  activityType: string;
  amount: number;
  activityDate: string;
  emissions: {
    CO2: number;
    CH4: number;
    N2O: number;
  };
};

export default function ActivitiesDisplayer(props: { data: Activity[] }) {
  const { data } = props;
  return (
    <div className="flex flex-col gap-2">
      <AnimatePresence>
        {data.map((a) => (
          <Activity key={`activity-${a.uuid}`} data={a} />
        ))}
      </AnimatePresence>
    </div>
  );
}

function Activity(props: { data: Activity }) {
  const { data } = props;
  const [showEmissions, setShowEmissions] = useState(false);
  const queryClient = useQueryClient();
  return (
    <motion.div
      layout
      initial={{ height: 50, opacity: 0 }}
      animate={{ height: showEmissions ? 100 : 50, opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full bg-hanagreen py-1 px-4 text-hanastone rounded flex flex-col items-start  overflow-hidden"
    >
      <div className="w-full flex flex-row items-center justify-between h-[50px] flex-shrink-0">
        <div className="flex flex-col h-full">
          <p>{data.activityType.toLocaleUpperCase()}</p>
          <p className="text-xs font-light">{data.uuid}</p>
        </div>
        <div className="flex flex-row h-full items-center gap-4">
          <button
            onClick={async () => {
              await fetch(
                `http://localhost:9080/climatix/activities/${data.uuid}`,
                {
                  method: "DELETE",
                }
              );
              queryClient.invalidateQueries(`activities_${data.activityDate}`);
            }}
          >
            <FontAwesomeIcon icon={faTrash} size="lg" />
          </button>
          <button onClick={() => setShowEmissions((c) => !c)}>
            <FontAwesomeIcon
              icon={showEmissions ? faEyeSlash : faEye}
              size="lg"
            />
          </button>
        </div>
      </div>
      <div className="flex flex-row h-[50px] w-full gap-2">
        <div className="rounded bg-hanastone text-hanagreen h-min px-2 py-1">
          CO2:{" "}
          <span className="text-hanagreen font-bold">{data.emissions.CO2}</span>
        </div>
        <div className="rounded bg-hanastone text-hanagreen h-min px-2 py-1">
          CH4:{" "}
          <span className="text-hanagreen font-bold">{data.emissions.CH4}</span>
        </div>
        <div className="rounded bg-hanastone text-hanagreen h-min px-2 py-1">
          N2O:{" "}
          <span className="text-hanagreen font-bold">{data.emissions.N2O}</span>
        </div>
      </div>
    </motion.div>
  );
}
