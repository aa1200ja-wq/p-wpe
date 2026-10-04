import { CraftBridge } from "@/editor/CraftBridge";
import { EditorShell } from "@/editor/EditorShell";
import { renwoxingProject } from "@/editor/renwoxing-project";

export default function EditorPage() {
  return (
    <CraftBridge>
      <EditorShell initialProject={renwoxingProject} />
    </CraftBridge>
  );
}
