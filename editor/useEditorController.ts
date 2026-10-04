"use client";
import { useEffect, useMemo, useState } from "react";
import { createElement, type AddableElementType } from "./element-factory";
import {
  EditorClipboard,
  cloneElements,
  makeBlankPage,
  makePastedElements,
  removePageAndLinks,
} from "./editor-ops";
import {
  applyInnerTemplate,
  canSyncInnerElement,
  isInnerPage,
  shouldSyncInnerContent,
} from "./inner-page-sync";
import { migrateInnerMobileLayout } from "./inner-mobile-layout";
import type {
  ComponentData,
  ElementLayout,
  SiteElement,
  SitePage,
  SiteProject,
  ViewportMode,
} from "./model";
import { loadDraft, persistProject } from "./project-storage";
import { renameProjectPage } from "./project-rename";
const DELETE_SKIP_KEY = "renwoxing-page-delete-no-confirm";
export function useEditorController(initialProject: SiteProject) {
  const [project, setProject] = useState(() =>
    migrateInnerMobileLayout(initialProject),
  );
  const [pageId, setPageId] = useState(initialProject.pages[0].id);
  const [viewport, setViewport] = useState<ViewportMode>("desktop");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [syncInnerPages, setSyncInnerPages] = useState(false);
  const [saveState, setSaveState] = useState("尚未儲存");
  const [saving, setSaving] = useState(false);
  const [clipboard, setClipboard] = useState<EditorClipboard | null>(null);
  const [menu, setMenu] = useState<{ x: number; y: number } | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<SitePage | null>(null);
  useEffect(() => {
    loadDraft().then((draft) => {
      if (!draft) return;
      const migrated = migrateInnerMobileLayout(draft);
      setProject(migrated);
      setPageId(migrated.pages[0].id);
      setSaveState("已載入草稿");
    });
  }, []);
  const page = useMemo(
    () => project.pages.find((item) => item.id === pageId) ?? project.pages[0],
    [pageId, project.pages],
  );
  const selectedId = selectedIds.length === 1 ? selectedIds[0] : null;
  const selectedElement = selectedId
    ? page.elements.find((item) => item.id === selectedId) ?? null
    : null;
  function updatePage(updater: (elements: SiteElement[]) => SiteElement[]) {
    setProject((current) => ({
      ...current,
      pages: current.pages.map((item) =>
        item.id === page.id ? { ...item, elements: updater(item.elements) } : item,
      ),
    }));
  }
  function selectElement(id: string, additive = false) {
    setMenu(null);
    setSelectedIds((current) => {
      if (!additive) return [id];
      return current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id];
    });
  }
  function patchLayouts(changes: Record<string, Partial<ElementLayout>>) {
    setProject((current) => ({
      ...current,
      pages: current.pages.map((item) => ({
        ...item,
        elements: item.elements.map((element) => {
          const patch = changes[element.id];
          if (!patch) return element;
          const apply =
            item.id === page.id ||
            (syncInnerPages &&
              canSyncInnerElement(page.id, element.id) &&
              isInnerPage(item.id));
          return apply
            ? { ...element, [viewport]: { ...element[viewport], ...patch } }
            : element;
        }),
      })),
    }));
  }
  function updateSelected(
    updater: (element: SiteElement) => SiteElement,
    allowSync = true,
  ) {
    if (!selectedId) return;
    const sync =
      allowSync &&
      syncInnerPages &&
      canSyncInnerElement(page.id, selectedId);
    setProject((current) => ({
      ...current,
      pages: current.pages.map((item) => ({
        ...item,
        elements: item.elements.map((element) =>
          element.id === selectedId &&
          (item.id === page.id || (sync && isInnerPage(item.id)))
            ? updater(element)
            : element,
        ),
      })),
    }));
  }
  function addElement(type: AddableElementType) {
    const element = createElement(type, page);
    updatePage((elements) => [...elements, element]);
    setSelectedIds([element.id]);
  }
  function deleteSelectedElements() {
    if (!selectedIds.length) return;
    updatePage((elements) =>
      elements.filter((element) => !selectedIds.includes(element.id)),
    );
    setSelectedIds([]);
  }
  function copyOrCut(mode: "copy" | "cut") {
    const elements = page.elements.filter((item) =>
      selectedIds.includes(item.id),
    );
    if (!elements.length) return;
    setClipboard({ mode, elements: cloneElements(elements) });
    if (mode === "cut") deleteSelectedElements();
  }
  function pasteElements() {
    if (!clipboard) return;
    const next = makePastedElements(clipboard);
    updatePage((elements) => [...elements, ...next]);
    setSelectedIds(next.map((item) => item.id));
    if (clipboard.mode === "cut") {
      setClipboard({ ...clipboard, mode: "copy" });
    }
  }
  function renamePage(targetPageId: string, name: string) {
    setProject((current) => renameProjectPage(current, targetPageId, name));
    setSaveState("分頁名稱已修改，尚未儲存");
  }
  function addPage() {
    const name = window.prompt("新分頁名稱", "新分頁")?.trim();
    if (!name) return;
    const next = makeBlankPage(page, name);
    setProject((current) => ({ ...current, pages: [...current.pages, next] }));
    setPageId(next.id);
    setSelectedIds([]);
  }
  function deletePageNow(target: SitePage) {
    const remaining = project.pages.filter((item) => item.id !== target.id);
    if (!remaining.length) return;
    setProject((current) => removePageAndLinks(current, target.id));
    setPageId(remaining[0].id);
    setSelectedIds([]);
  }
  function requestDeletePage() {
    if (project.pages.length <= 1) return;
    if (window.localStorage.getItem(DELETE_SKIP_KEY) === "1") {
      deletePageNow(page);
    } else {
      setDeleteDialog(page);
    }
  }
  function confirmDeletePage(dontAskAgain: boolean) {
    if (!deleteDialog) return;
    if (dontAskAgain) window.localStorage.setItem(DELETE_SKIP_KEY, "1");
    deletePageNow(deleteDialog);
    setDeleteDialog(null);
  }
  async function save() {
    setSaving(true);
    setSaveState("儲存中…");
    try {
      const result = await persistProject(project);
      setSaveState(result.cancelled ? "已取消" : "草稿已儲存");
    } catch (error) {
      setSaveState(error instanceof Error ? error.message : "儲存失敗");
    } finally {
      setSaving(false);
    }
  }
  const changePage = (id: string) => {
    setPageId(id);
    setSelectedIds([]);
  };
  const changeViewport = (mode: ViewportMode) => {
    setViewport(mode);
    setSelectedIds([]);
  };
  const applyTemplate = () => {
    setProject((current) => applyInnerTemplate(current, page.id));
    setSaveState("六個內頁版型已同步，尚未儲存");
  };
  const patchContent = (content: string) =>
    updateSelected(
      (element) => ({ ...element, content }),
      shouldSyncInnerContent(page.id, selectedId),
    );
  const patchStyle = (patch: Record<string, string | number>) => {
    const key = viewport === "desktop" ? "desktopStyle" : "mobileStyle";
    updateSelected((element) => ({
      ...element,
      [key]: { ...element[key], ...patch },
    }));
  };
  const patchSetting = (patch: Record<string, string | number | boolean>) =>
    updateSelected((element) => ({
      ...element,
      settings: {
        ...element.settings,
        [viewport]: { ...element.settings?.[viewport], ...patch },
      },
    }));
  const patchComponentData = (componentData: ComponentData) =>
    updateSelected((element) => ({ ...element, componentData }), false);
  const patchSharedStyle = (patch: Record<string, string | number>) =>
    updateSelected((element) => ({
      ...element,
      style: { ...element.style, ...patch },
    }));
  return {
    project, page, viewport, selectedIds, selectedId, selectedElement,
    syncInnerPages, saveState, saving, clipboard, menu, deleteDialog,
    setSelectedIds, setSyncInnerPages, setMenu, setDeleteDialog,
    selectElement, patchLayouts, addElement, deleteSelectedElements,
    copyOrCut, pasteElements, renamePage, addPage, requestDeletePage,
    confirmDeletePage, save, changePage, changeViewport, applyTemplate,
    patchContent, patchStyle, patchSharedStyle, patchSetting, patchComponentData,
  };
}
