import { useNavigate, useLocation } from "react-router";
import { useEffect, useMemo, useRef } from "react";
import { ErrorMessage } from "../components/messages/error-message";
import { SessionShell } from "../components/session-shell";
import { BotMessage, UserMessage } from "../components/messages";
import { z }  from "zod";
import { useToast } from "../providers/toast";
import { apiClient } from "../lib/api-client";
import { DEFAULT_CHAT_MODEL_ID } from "../../../shared/src/models";
import { getErrorMessage } from "../lib/http-errors";

const newSessionStateSchema = z.object({
  message: z.string(),
});

export function NewSession() {
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();
  const hasStartedRef = useRef(false);

  const state = useMemo(() => {
    const parsed = newSessionStateSchema.safeParse(location.state);

    return parsed.success ? parsed.data : null;
  }, [location.state]);

  // Guard: if navigated here directly without state, go home
  
    useEffect(() => {
    if (!state) {
      navigate("/", { replace: true });
    }
  }, [state, navigate]);

  // Create the session on mount — this screen exists to do this
  useEffect(() => {
    if (!state || hasStartedRef.current) return;

    hasStartedRef.current = true;

    let ignored = false;

    const createSession = async () => {
      try {
        const res = await apiClient.sessions.$post({
          json: {
            title: state.message.slice(0, 100),
            cwd: process.cwd(),
            initialMessage: {
              role: "USER",
              content: state.message,
              mode: "BUILD",
              model: DEFAULT_CHAT_MODEL_ID,
            },
          },
        });

        if (ignored) return;
        if (!res.ok) {
          throw new Error(await getErrorMessage(res));
        }

        const session = await res.json();
        navigate(
          `/sessions/${session.id}`,
          { replace: true, state: { session } }
        );
      } catch (error) {
        if (ignored) return;
        toast.show({
          variant: "error",
          message: error instanceof Error ? error.message : "Failed to create session",
        });
        navigate("/", { replace: true });
      }
    };

    createSession();
    return () => {
      ignored = true;
    };
  }, [state, navigate, toast]);

  if (!state) return null;
  
   return (
    <SessionShell onSubmit={() => {}} inputDisabled loading>
      <UserMessage message={state.message} />
    </SessionShell>
  );
};
