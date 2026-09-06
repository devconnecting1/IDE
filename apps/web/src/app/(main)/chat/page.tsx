import { Chat } from "./_components/chat";
import { conversations } from "./_components/data";

export default function Page() {
  return (
    <div className="min-h-0 flex-1 overflow-hidden">
      <Chat conversations={conversations} />
    </div>
  );
}
