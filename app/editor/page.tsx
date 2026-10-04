import { CraftBridge } from "@/editor/CraftBridge";
import { EditorShell } from "@/editor/EditorShell";
import { genericProject } from "@/editor/generic-project";

export default function EditorPage() {
  return (
    <CraftBridge>
      <EditorShell initialProject={genericProject} />
    </CraftBridge>
  );
}
