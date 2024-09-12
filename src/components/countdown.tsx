import React, { useState, useEffect } from "react";

interface CountdownProps {
  targetDate: string;
  countdown: boolean;
}

const Countdown: React.FC<CountdownProps> = ({ targetDate, countdown }) => {
  const calculateTimeRemaining = () => {
    const targetDateTime = new Date(targetDate);
    const now = new Date();
    const timeDifference = targetDateTime.getTime() - now.getTime();

    if (timeDifference <= 0) {
      return {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
      };
    }

    const seconds = Math.floor(timeDifference / 1000) % 60;
    const minutes = Math.floor(timeDifference / (1000 * 60)) % 60;
    const hours = Math.floor(timeDifference / (1000 * 60 * 60)) % 24;
    const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

    return { days, hours, minutes, seconds };
  };

  const [timeRemaining, setTimeRemaining] = useState(calculateTimeRemaining());

  useEffect(() => {
    if (countdown) {
      const timerId = setInterval(() => {
        setTimeRemaining(calculateTimeRemaining());
      }, 1000);
      return () => clearInterval(timerId);
    }
  }, [countdown]);

  const formattedTargetDate = new Date(targetDate).toLocaleString();

  return (
    <div className="flex gap-2 font-bold text-3xl">
      {countdown ? (
        <>
          <span>
            {timeRemaining.days}
            <span className="text-muted-foreground ms-1">d</span>
          </span>
          <span>
            {timeRemaining.hours}
            <span className="text-muted-foreground ms-1">hr</span>
          </span>
          <span>
            {timeRemaining.minutes}
            <span className="text-muted-foreground ms-1">min</span>
          </span>
          <span>
            {timeRemaining.seconds}
            <span className="text-muted-foreground ms-1">sec</span>
          </span>
        </>
      ) : (
        <span className="font-bold text-xl">{formattedTargetDate}</span>
      )}
    </div>
  );
};

export default Countdown;
