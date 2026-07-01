import Link from "next/link";
import { Avatar } from "@/components/ui/Avatar";
import { Card } from "@/components/ui/Card";
import { chatThreads, getStudent } from "@/lib/mock-data";

export default function ChatListPage() {
  const threads = Object.entries(chatThreads).map(([studentId, messages]) => ({
    student: getStudent(studentId),
    lastMessage: messages[messages.length - 1],
  }));

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-text-primary">Chat</h1>
      <div className="flex flex-col gap-3">
        {threads.map(
          ({ student, lastMessage }) =>
            student && (
              <Link key={student.id} href={`/alunos/${student.id}?tab=chat`}>
                <Card className="flex items-center gap-3 p-4">
                  <Avatar name={student.name} />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-text-primary">{student.name}</p>
                    <p className="truncate text-sm text-text-secondary">
                      {lastMessage.from === "professional" ? "Você: " : ""}
                      {lastMessage.text}
                    </p>
                  </div>
                  <span className="shrink-0 text-xs text-text-muted">{lastMessage.time}</span>
                </Card>
              </Link>
            ),
        )}
      </div>
    </div>
  );
}
