import { useCallback } from "react";

import Option0 from "@/public/icon/eventItems/0.svg";
import Option1 from "@/public/icon/eventItems/1.svg";
import Option2 from "@/public/icon/eventItems/2.svg";
import Option3 from "@/public/icon/eventItems/3.svg";
import Option4 from "@/public/icon/eventItems/4.svg";

interface EventIdxProps {
  eventIdx: number;
}

const EventCard = ({ eventIdx }: EventIdxProps) => {
  const getEventByIndex = useCallback((index: number) => {
    switch (index) {
      case 0:
        return <Option0 width={"100%"} height={"100%"} />;
      case 1:
        return <Option1 width={"100%"} height={"100%"} />;
      case 2:
        return <Option2 width={"100%"} height={"100%"} />;
      case 3:
        return <Option3 width={"100%"} height={"100%"} />;
      case 4:
        return <Option4 width={"100%"} height={"100%"} />;
    }
  }, []);

  return <>{getEventByIndex(eventIdx)}</>;
};

export default EventCard;
