import dayjs from "dayjs";
import { useCallback, useEffect, useState, useRef } from "react";

type TimerProps = {
  timeoutInSeconds: number;
  onTimerOver: Function;
  autoStart: boolean;
}

export const useTimer = ({ timeoutInSeconds, onTimerOver, autoStart }: TimerProps) => {
  const [startDate, setStartDate] = useState<string | null>(null);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const timer = useRef<NodeJS.Timeout | null>(null);

  const stopTimer = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
    if (!startDate) return;
    const secondsPassedSinceStart = dayjs().diff(startDate, 'seconds');
    const diff = secondsLeft - secondsPassedSinceStart;
    setSecondsLeft(diff);

  }, [timer, startDate, secondsLeft]);

  const startTimer = useCallback((timeout) => {
    timer.current = setTimeout(() => {
      onTimerOver();
    }, timeout * 1000);
    
    const now = dayjs().toISOString();
    setStartDate(now);
    setSecondsLeft(timeout);

  }, [onTimerOver]);

  const resumeTimer = useCallback(() => {
    startTimer(secondsLeft);

  }, [secondsLeft, startTimer]); 

  useEffect(() => {
    if (autoStart) startTimer(timeoutInSeconds);
    
    return () => {
      timer.current && clearTimeout(timer.current)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timer, autoStart]);

  return {
    startTimer,
    stopTimer,
    resumeTimer,
  }
}

export default useTimer;