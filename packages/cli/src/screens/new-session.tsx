import { useNavigate, useLocation } from "react-router";
import { useEffect } from "react";
import { ErrorMessage } from "../components/messages/error-message";
import { SessionShell } from "../components/session-shell";
import { BotMessage, UserMessage } from "../components/messages";

export function NewSession() {
  const navigate = useNavigate();
  const location = useLocation();

  const state = location.state as { message?: string } | null;

  // Guard: if navigated here directly without state, go home
  useEffect(() => {
    if (!state?.message) {
      navigate("/", { replace: true });
    }
  }, [state, navigate]);

  if (!state?.message) return null;
  
   return (
    <SessionShell onSubmit={() => {}} inputDisabled loading>
      <UserMessage message={state.message} />
      <BotMessage 
        content="This is a sample bot message."
        model="opus-4-6"
      />
      <ErrorMessage message="This is a sample error message." />
    </SessionShell>
  );
};
