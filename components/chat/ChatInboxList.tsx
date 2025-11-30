"use client";

import { useChat } from "@/contexts/ChatContext";
import { useAuth } from "@/contexts/AuthContext";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { id } from "date-fns/locale";

// Helper untuk memparsing pesan
const getDisplayMessage = (content: string) => {
  try {
    if (content.startsWith('{"type":"service_inquiry"')) {
      const parsed = JSON.parse(content);
      return parsed.text || "Menanyakan Jasa...";
    }
    return content;
  } catch (e) {
    return content;
  }
};

export const ChatInboxList = () => {
  const { conversations, openChatWith } = useChat();
  const { user } = useAuth();

  if (conversations.length === 0) {
    return (
      <div className="p-6 text-center text-sm text-muted-foreground">
        Belum ada percakapan.
      </div>
    );
  }

  return (
    <ScrollArea className="h-[300px] w-full">
      <div className="divide-y">
        {conversations.map((conv) => {
          const otherParticipant = conv.participants.find(
            (p) => p.user.id !== user?.id
          )?.user;

          if (!otherParticipant) return null;

          const lastMessageContent = conv.lastMessage?.content || "";
          const displayMessage = getDisplayMessage(lastMessageContent);

          return (
            <div
              key={conv.id}
              className="p-3 hover:bg-gray-100 bg-white cursor-pointer transition-colors flex gap-3 items-center"
              onClick={() => openChatWith(otherParticipant)}
            >
              <Avatar className="h-10 w-10 border">
                <AvatarImage src={otherParticipant.profilePicture || ""} />
                <AvatarFallback>{otherParticipant.fullName[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1 overflow-hidden">
                <div className="flex justify-between items-center mb-1">
                  <h4 className="font-semibold text-xs truncate">
                    {otherParticipant.fullName}
                  </h4>
                  {conv.lastMessage && (
                    <span className="text-[10px] text-muted-foreground shrink-0 ml-2">
                      {formatDistanceToNow(
                        new Date(conv.lastMessage.createdAt),
                        { addSuffix: false, locale: id }
                      )}
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground truncate">
                  {displayMessage || "Mulai percakapan..."}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </ScrollArea>
  );
};
