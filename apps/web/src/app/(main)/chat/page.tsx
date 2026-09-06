import { Chat } from "./_components/chat";
import { conversations } from "./_components/data";

export default function Page() {
  return (
    <div className="h-full min-h-0 overflow-hidden">
      <Chat conversations={conversations} />
    </div>
  );
}
