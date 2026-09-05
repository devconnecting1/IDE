import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";

function App() {
  const [output, setOutput] = useState("");
  const [command, setCommand] = useState("");
  const [loading, setLoading] = useState(false);

  const runCommand = async () => {
    if (!command.trim()) return;
    setLoading(true);
    try {
      const result = await invoke<{ stdout: string; stderr: string; code: number }>(
        "execute_command",
        { command },
      );
      setOutput(result.stdout || result.stderr || "No output");
    } catch (error) {
      setOutput(String(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <header className="mb-6">
        <h1 className="text-2xl font-bold">Workspaacing</h1>
        <p className="text-gray-400 text-sm">AI Agent IDE - Mobile</p>
      </header>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Command</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={command}
              onChange={(e) => setCommand(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && runCommand()}
              placeholder="Enter command..."
              className="flex-1 bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
            />
            <button
              onClick={runCommand}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 px-4 py-2 rounded text-sm font-medium transition-colors"
            >
              {loading ? "Running..." : "Run"}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Output</label>
          <pre className="bg-gray-800 border border-gray-700 rounded p-3 text-sm overflow-auto max-h-96 font-mono whitespace-pre-wrap">
            {output || "No output yet"}
          </pre>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={async () => {
              const home = await invoke<string>("get_home_dir");
              setCommand(`cd ${home} && ls`);
            }}
            className="bg-gray-800 hover:bg-gray-700 px-3 py-2 rounded text-sm transition-colors"
          >
            Home Dir
          </button>
          <button
            onClick={async () => {
              const appData = await invoke<string>("get_app_data_dir");
              setCommand(`cd ${appData} && ls`);
            }}
            className="bg-gray-800 hover:bg-gray-700 px-3 py-2 rounded text-sm transition-colors"
          >
            App Data
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
