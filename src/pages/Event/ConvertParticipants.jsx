export const convertParticipantsData = (participants) => {
  return participants.map((participant) => {
    return {
      name: participant.user_name,
      availability: participant.slots_selection.flatMap((slot) => {
        const startTime = new Date(slot.start * 1000);
        const endTime = new Date(slot.end * 1000);

        let currentTime = new Date(startTime);
        let timeSlots = [];

        const options = {
          timeZone: "Etc/GMT",
          hour12: false,
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
        };

        while (currentTime <= endTime) {
          const formattedTime = currentTime.toLocaleString("en-US", options);
          const [date, time] = formattedTime.split(", ");

          const hhmm = time.replace(":", "");
          const dateParts = date.split("/");
          const formattedDate = `${dateParts[1]}${dateParts[0]}${dateParts[2]}`;

          timeSlots.push(`${hhmm}-${formattedDate}`);

          currentTime.setMinutes(currentTime.getMinutes() + 15);
        }

        return timeSlots;
      }),
    };
  });
};