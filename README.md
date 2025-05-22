# use-smart-session

A lightweight and customizable React hook to detect user inactivity, show session timeout warnings, and handle auto-logout functionality.

## 🚀 Features

- ⏱ Detects inactivity and marks user as idle
- ⏳ Optional reminder before session expiration
- 🔐 Auto-logout after session timeout
- 🔄 Refreshes token on activity (optional)
- ⚙️ Fully customizable

## 📦 Installation (soon...)

```bash
npm install use-smart-session
```

## 🧠 Usage

```bash
import React from "react";
import { useSmartSession } from "use-smart-session";

const App = () => {
  const { isIdle, timeLeft, warningMessage } = useSmartSession({
    idleTimeout: 300, // seconds before user is considered idle
    reminderTimeout: 60, // seconds before idle to trigger a warning
    onIdle: () => alert("You are now idle."),
    onBeforeIdle: () => console.log("You will be idle soon."),
    onActive: () => console.log("Welcome back!"),
    onLogout: () => console.log("Session ended."),
  });

  return (
    <div>
      <h1>User Session Tracker</h1>
      <p>Status: {isIdle ? "Idle" : "Active"}</p>
      {warningMessage && <p>{warningMessage}</p>}
      <p>Time left: {timeLeft} seconds</p>
    </div>
  );
};

export default App;
```

## ⚙️ Hook API

```bash
interface UseSmartSessionProps {
  idleTimeout?: number; // default: 300
  reminderTimeout?: number; // default: 10
  onIdle?: () => void;
  onBeforeIdle?: () => void;
  onActive?: () => void;
  onLogout?: () => void;
  refreshTokenFn?: () => Promise<void>;
}
```

## Returned Values

```bash
{
isIdle: boolean;
lastActive: number;
timeLeft: number;
warningMessage: string;
resetIdleTimer: () => void;
}
```
## 💡 Example Scenarios
Auto-logout users after inactivity

Show countdown reminder before session expires

Refresh token automatically on user activity

Custom behavior on idle/active/logout events

## ✅ Best Practices
Use shorter idleTimeout and reminderTimeout for testing

Combine with authentication context to handle auto-logout

Customize onBeforeIdle to show modals or warnings

🧾 License
MIT © Mohamed Hadbi
