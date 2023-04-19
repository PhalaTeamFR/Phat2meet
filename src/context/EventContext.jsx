import { createContext, useContext, useState } from "react";

const EventContext = createContext();

export const useEventContext = () => {
  return useContext(EventContext);
};

export const EventProvider = ({ children }) => {
  const [hourRanges, setHourRanges] = useState([]);
  const [slotsRanges, setSlotsRanges] = useState([]);
  const [participants, setParticipants] = useState([]);

  const value = {
    hourRanges,
    setHourRanges,
    slotsRanges,
    setSlotsRanges,
    participants,
    setParticipants,
  };

  return <EventContext.Provider value={value}>{children}</EventContext.Provider>;
};
