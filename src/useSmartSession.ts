import { useEffect, useState, useCallback } from "react";

interface UseSmartSessionProps {
  idleTimeout?: number;
  onIdle?: () => void;
  reminderTimeout?: number;
  onBeforeIdle?: () => void;
  onActive?: () => void;
  onLogout?: () => void;
  refreshTokenFn?: () => Promise<void>;
}

export const useSmartSession = ({
  idleTimeout = 300,
  reminderTimeout = 10,
  onIdle,
  onBeforeIdle,
  onActive,
  onLogout,
  refreshTokenFn,
}: UseSmartSessionProps) => {
  const [isIdle, setIsIdle] = useState(false);
  const [lastActive, setLastActive] = useState(Date.now());
  const [timeLeft, setTimeLeft] = useState(idleTimeout);
  const [warningMessage, setWarningMessage] = useState<string>("");

  const resetIdleTimer = useCallback(() => {
    if (isIdle) {
      onActive?.();
      setIsIdle(false);
    }
    setLastActive(Date.now());
    setTimeLeft(idleTimeout);
    setWarningMessage("");
  }, [isIdle, onActive, idleTimeout]);

  useEffect(() => {
    let idleTimeoutId: ReturnType<typeof setTimeout> | null = null;
    let reminderIntervalId: ReturnType<typeof setInterval> | null = null;

    const checkReminder = () => {
      const timePassed = (Date.now() - lastActive) / 1000;
      const remaining = idleTimeout - timePassed;
      setTimeLeft(Math.max(0, Math.floor(remaining)));

      if (!isIdle && remaining <= reminderTimeout && remaining > 0) {
        setWarningMessage(
          `Session will expire due to inactivity in ${Math.floor(
            remaining
          )} seconds.`
        );
        onBeforeIdle?.();
      } else {
        setWarningMessage("");
      }
    };

    idleTimeoutId = setTimeout(() => {
      setIsIdle(true);
      setWarningMessage("Session has expired due to inactivity.");
      onIdle?.();
      onLogout?.();
    }, idleTimeout * 1000);

    reminderIntervalId = setInterval(checkReminder, 1000);

    const events = ["mousemove", "keydown", "click"];
    events.forEach((event) => window.addEventListener(event, resetIdleTimer));

    if (refreshTokenFn) {
      resetIdleTimer();
      refreshTokenFn().catch((err) =>
        console.error("Token refresh failed:", err)
      );
    }

    return () => {
      if (idleTimeoutId) clearTimeout(idleTimeoutId);
      if (reminderIntervalId) clearInterval(reminderIntervalId);
      events.forEach((event) =>
        window.removeEventListener(event, resetIdleTimer)
      );
    };
  }, [
    idleTimeout,
    reminderTimeout,
    onIdle,
    onBeforeIdle,
    onActive,
    onLogout,
    refreshTokenFn,
    resetIdleTimer,
  ]);

  return { isIdle, lastActive, timeLeft, warningMessage, resetIdleTimer };
};
