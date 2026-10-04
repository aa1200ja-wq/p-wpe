"use client";

import { EditorContextMenu } from "./EditorContextMenu";
import { EditorSidebar } from "./EditorSidebar";
import { InspectorPanel } from "./InspectorPanel";
import { isInnerPage } from "./inner-page-sync";
import type { SiteProject } from "./model";
import { PageDeleteDialog } from "./PageDeleteDialog";
import { SelectionOverlay } from "./SelectionOverlay";
import { SiteRenderer } from "./SiteRenderer";
import { useEditorController } from "./useEditorController";

export function EditorShell({ initialProject }: { initialProject: SiteProject }) {
  const c = useEditorController(initialProject);

  return (
    <div className="editor-shell" onMouseDown={() => c.setMenu(null)}>
      <header className="editor-topbar">
        <strong>{c.project.name}</strong>
        <div>
          <span className="save-status">{c.saveState}</span>
          <button disabled={c.saving} onClick={() => c.save("save")}>
            儲存草稿
          </button>
          <button disabled={c.saving} onClick={() => c.save("publish")}>
            儲存並發布
          </button>
          <button
            className={c.viewport === "desktop" ? "active" : ""}
            onClick={() => c.changeViewport("desktop")}
          >
            桌機
          </button>
          <button
            className={c.viewport === "mobile" ? "active" : ""}
            onClick={() => c.changeViewport("mobile")}
          >
            手機
          </button>
          <a href="/site" target="_blank">查看正式網站</a>
        </div>
      </header>

      <EditorSidebar
        project={c.project}
        page={c.page}
        selectedIds={c.selectedIds}
        onPageChange={c.changePage}
        onPageRename={c.renamePage}
        onElementSelect={(id) => c.selectElement(id)}
        onAddElement={c.addElement}
        onAddPage={c.addPage}
        onDeletePage={c.requestDeletePage}
        innerSyncAvailable={isInnerPage(c.page.id)}
        syncInnerPages={c.syncInnerPages}
        onSyncInnerPagesChange={c.setSyncInnerPages}
        onApplyInnerTemplate={c.applyTemplate}
      />

      <main
        className="editor-canvas"
        onContextMenu={(event) => {
          event.preventDefault();
          const element = (event.target as HTMLElement).closest<HTMLElement>(
            "[data-editor-id]",
          );
          const id = element?.dataset.editorId;
          if (id && !c.selectedIds.includes(id)) c.setSelectedIds([id]);
          c.setMenu({ x: event.clientX, y: event.clientY });
        }}
      >
        <SiteRenderer
          page={c.page}
          viewport={c.viewport}
          editable
          selectedIds={c.selectedIds}
          onSelect={c.selectElement}
          onClearSelection={() => c.setSelectedIds([])}
        />
        <SelectionOverlay
          selectedIds={c.selectedIds}
          onSelectIds={c.setSelectedIds}
          onLayoutsChange={c.patchLayouts}
        />
      </main>

      <InspectorPanel
        element={c.selectedElement}
        viewport={c.viewport}
        onLayoutChange={(patch) =>
          c.selectedId && c.patchLayouts({ [c.selectedId]: patch })
        }
        onContentChange={c.patchContent}
        onStyleChange={c.patchStyle}
        onSharedStyleChange={c.patchSharedStyle}
        onSettingChange={c.patchSetting}
        onComponentDataChange={c.patchComponentData}
        onDelete={c.deleteSelectedElements}
      />

      {c.menu && (
        <EditorContextMenu
          x={c.menu.x}
          y={c.menu.y}
          hasSelection={c.selectedIds.length > 0}
          canPaste={Boolean(c.clipboard)}
          onCopy={() => c.copyOrCut("copy")}
          onCut={() => c.copyOrCut("cut")}
          onPaste={c.pasteElements}
          onDelete={c.deleteSelectedElements}
          onClose={() => c.setMenu(null)}
        />
      )}

      {c.deleteDialog && (
        <PageDeleteDialog
          pageName={c.deleteDialog.name}
          onCancel={() => c.setDeleteDialog(null)}
          onConfirm={c.confirmDeletePage}
        />
      )}
    </div>
  );
}
