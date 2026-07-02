import { useState, useEffect, useMemo, useRef } from "react";
import { useParams, useLocation, useNavigate } from "react-router";
import { z } from "zod";
import { useKeyboard } from "@opentui/react";
// import { type ModeType, type SupportedChatModelId } from "@nightcode/shared";
import type { InferResponseType } from "hono/client";
import { SessionShell } from "../components/session-shell";
import { 
  UserMessage, 
  BotMessage, 
  ErrorMessage
} from "../components/messages";
import { useToast } from "../providers/toast";
// import { useChat } from "../hooks/use-chat";
// import { usePromptConfig } from "../providers/prompt-config";
// import type { Message } from "../hooks/use-chat";
import { apiClient } from "../lib/api-client";
import { getErrorMessage } from "../lib/http-errors";
// import { useKeyboardLayer } from "../providers/keyboard-layer";

type SessionData = InferResponseType<(typeof apiClient.sessions)[":id"]["$get"], 200>;

const sessionLocationSchema = z.object({
  session: z.custom<SessionData>((val) => val != null && typeof val === "object" && "id" in val),
  // initialPrompt: z
  //   .object({
  //     message: z.string(),
  //     mode: z.custom<ModeType>(),
  //     model: z.custom<SupportedChatModelId>(),
  //   })
  //   .optional(),
});

function ChatMessage(
  { msg }: { 
    msg: SessionData["messages"][number] 
  }
) {
  if (msg.role === "USER") {
    return <UserMessage message={msg.content} />;
  }

  if (msg.role === "ERROR") {
    return <ErrorMessage message={msg.content} />;
  }

  return <BotMessage content={msg.content} model={msg.model} />;
};

export function Session() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const toast = useToast();

  const prefetched = useMemo(() => {
    const parsed = sessionLocationSchema.safeParse(location.state);
    return parsed.success ? parsed.data.session : null;
  }, [location.state]);

  const [session, setSession] = useState<SessionData | null>(prefetched);

  useEffect(() => {
    // Skip fetch if session was passed via location state
    if (prefetched) return;

    setSession(null);

    if (!id) return;

    let ignore = false;

    const fetchSession = async () => {
      try{
        const res = await apiClient.sessions[":id"].$get({ 
          param: { id } 
        });

        if (ignore) return;

        if (!res.ok) throw new Error(await getErrorMessage(res));

        const resolved = await res.json();

        setSession(resolved);
      } catch (err) {
        if (ignore) return;

        toast.show({
          variant: "error",
          message: err instanceof Error ? err.message : "Failed to load session"
        });

        navigate("/", { replace: true });
      }
    }

    fetchSession();
    return () => {
      ignore = false;
    };
  }, [id, prefetched, toast, navigate]);

  if (!session) {
    return <SessionShell onSubmit={() => {}} inputDisabled loading />
  }

  return (
    <SessionShell onSubmit={() => {}} inputDisabled>
      {session.messages.map((msg) => (
        <ChatMessage key={msg.id} msg={msg} />
      ))}
    </SessionShell>
  );
};
