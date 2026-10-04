"use client";

import { EditorContextMenu } from "./EditorContextMenu";
import { EditorSidebar } from "./EditorSidebar";
import { InspectorPanel } from "./InspectorPanel";
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
        <input
          className="project-name-input"
          value={c.project.name}
          onChange={(event) => c.setProjectName(event.target.value)}
          aria-label="網站名稱"
        />
        <div>
          <span className="save-status">{c.saveState}</span>
          <button disabled={c.saving} onClick={c.save}>
            儲存草稿
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
        </div>
      </header>

      <EditorSidebar
        project={c.project}
        page={c.page}
        viewport={c.viewport}
        selectedIds={c.selectedIds}
        onPageChange={c.changePage}
        onPageRename={c.renamePage}
        onElementSelect={(id) => c.selectElement(id)}
        onAddElement={c.addElement}
        onAddPage={c.addPage}
        onDuplicatePage={c.duplicateCurrentPage}
        onDeletePage={c.requestDeletePage}
        onMovePage={c.moveCurrentPage}
        onSetHomePage={c.setHomePage}
        onMoveLayer={c.moveLayer}
      />

      <main
        className="editor-canvas"
        onContextMenu={(event) => {
          event.preventDefault();
          const target = event.target as HTMLElement;
          const element = target.closest<HTMLElement>("[data-editor-id]");
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
        page={c.page}
        pages={c.project.pages}
        viewport={c.viewport}
        onPageChange={c.patchPage}
        onNameChange={c.patchName}
        onLayoutChange={(patch) =>
          c.selectedId && c.patchLayouts({ [c.selectedId]: patch })
        }
        onContentChange={c.patchContent}
        onStyleChange={c.patchStyle}
        onViewportStyleChange={c.patchViewportStyle}
        onSettingChange={c.patchSetting}
        onComponentDataChange={c.patchComponentData}
        onActionChange={c.patchAction}
        onAnimationChange={c.patchAnimation}
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
