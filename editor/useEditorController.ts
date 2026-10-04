"use client";

import { useEffect, useMemo, useState } from "react";
import { createElement, type AddableElementType } from "./element-factory";
import {
  EditorClipboard,
  cloneElements,
  makePastedElements,
} from "./editor-ops";
import type {
  AnimationSpec,
  ComponentData,
  ElementLayout,
  SiteAction,
  SiteElement,
  SitePage,
  SiteProject,
  ViewportMode,
} from "./model";
import {
  duplicatePage,
  makeBlankPage,
  movePage,
  removePageAndLinks,
} from "./page-ops";
import { loadDraft, persistProject } from "./project-storage";
import { renameProjectPage } from "./project-rename";

const DELETE_SKIP_KEY = "p-wpe-page-delete-no-confirm";
type LayerMove = "up" | "down" | "front" | "back";

export function useEditorController(initialProject: SiteProject) {
  const [project, setProject] = useState(initialProject);
  const [pageId, setPageId] = useState(
    initialProject.homePageId ?? initialProject.pages[0].id,
  );
  const [viewport, setViewport] = useState<ViewportMode>("desktop");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [saveState, setSaveState] = useState("尚未儲存");
  const [saving, setSaving] = useState(false);
  const [clipboard, setClipboard] = useState<EditorClipboard | null>(null);
  const [menu, setMenu] = useState<{ x: number; y: number } | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<SitePage | null>(null);

  useEffect(() => {
    loadDraft().then((draft) => {
      if (!draft?.pages?.length) return;
      setProject(draft);
      setPageId(draft.homePageId ?? draft.pages[0].id);
      setSaveState("已載入本機草稿");
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

  function updateSelected(updater: (element: SiteElement) => SiteElement) {
    if (!selectedId) return;
    updatePage((elements) =>
      elements.map((element) =>
        element.id === selectedId ? updater(element) : element,
      ),
    );
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
    updatePage((elements) =>
      elements.map((element) => {
        const patch = changes[element.id];
        return patch
          ? { ...element, [viewport]: { ...element[viewport], ...patch } }
          : element;
      }),
    );
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
    const elements = page.elements.filter((item) => selectedIds.includes(item.id));
    if (!elements.length) return;
    setClipboard({ mode, elements: cloneElements(elements) });
    if (mode === "cut") deleteSelectedElements();
  }

  function pasteElements() {
    if (!clipboard) return;
    const next = makePastedElements(clipboard);
    updatePage((elements) => [...elements, ...next]);
    setSelectedIds(next.map((item) => item.id));
    if (clipboard.mode === "cut") setClipboard({ ...clipboard, mode: "copy" });
  }

  function addPage() {
    const name = window.prompt("新分頁名稱", "新分頁")?.trim();
    if (!name) return;
    const next = makeBlankPage(page, name);
    setProject((current) => ({ ...current, pages: [...current.pages, next] }));
    setPageId(next.id);
    setSelectedIds([]);
  }

  function duplicateCurrentPage() {
    const next = duplicatePage(page);
    setProject((current) => ({ ...current, pages: [...current.pages, next] }));
    setPageId(next.id);
    setSelectedIds([]);
  }

  function deletePageNow(target: SitePage) {
    if (project.pages.length <= 1) return;
    const next = removePageAndLinks(project, target.id);
    setProject(next);
    setPageId(next.homePageId ?? next.pages[0].id);
    setSelectedIds([]);
  }

  function requestDeletePage() {
    if (project.pages.length <= 1) return;
    if (window.localStorage.getItem(DELETE_SKIP_KEY) === "1") deletePageNow(page);
    else setDeleteDialog(page);
  }

  function confirmDeletePage(dontAskAgain: boolean) {
    if (!deleteDialog) return;
    if (dontAskAgain) window.localStorage.setItem(DELETE_SKIP_KEY, "1");
    deletePageNow(deleteDialog);
    setDeleteDialog(null);
  }

  function moveCurrentPage(direction: -1 | 1) {
    setProject((current) => movePage(current, page.id, direction));
  }

  function setHomePage() {
    setProject((current) => ({ ...current, homePageId: page.id }));
  }

  function moveLayer(mode: LayerMove) {
    if (!selectedIds.length) return;
    updatePage((elements) => {
      const values = elements.map((item) => item[viewport].zIndex);
      const min = Math.min(0, ...values);
      const max = Math.max(0, ...values);
      return elements.map((element) => {
        if (!selectedIds.includes(element.id)) return element;
        const current = element[viewport].zIndex;
        const zIndex =
          mode === "front" ? max + 1 :
          mode === "back" ? min - 1 :
          mode === "up" ? current + 1 : current - 1;
        return { ...element, [viewport]: { ...element[viewport], zIndex } };
      });
    });
  }

  async function save() {
    setSaving(true);
    setSaveState("儲存中…");
    try {
      const result = await persistProject(project);
      setSaveState(result.cancelled ? "已取消" : "本機草稿已儲存");
    } catch (error) {
      setSaveState(error instanceof Error ? error.message : "儲存失敗");
    } finally {
      setSaving(false);
    }
  }

  const patchContent = (content: string) =>
    updateSelected((element) => ({ ...element, content }));
  const patchName = (name: string) =>
    updateSelected((element) => ({ ...element, name }));
  const patchStyle = (patch: Record<string, string | number>) =>
    updateSelected((element) => ({
      ...element,
      style: { ...element.style, ...patch },
    }));
  const patchViewportStyle = (patch: Record<string, string | number>) => {
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
    updateSelected((element) => ({ ...element, componentData }));
  const patchAction = (action: SiteAction | undefined) =>
    updateSelected((element) => ({ ...element, action }));
  const patchAnimation = (animation: AnimationSpec) =>
    updateSelected((element) => ({ ...element, animation }));
  const patchPage = (patch: Partial<SitePage>) =>
    setProject((current) => ({
      ...current,
      pages: current.pages.map((item) =>
        item.id === page.id ? { ...item, ...patch } : item,
      ),
    }));

  return {
    project, page, viewport, selectedIds, selectedId, selectedElement,
    saveState, saving, clipboard, menu, deleteDialog,
    setSelectedIds, setMenu, setDeleteDialog,
    setProjectName: (name: string) => setProject((current) => ({ ...current, name })),
    selectElement, patchLayouts, addElement, deleteSelectedElements,
    copyOrCut, pasteElements,
    renamePage: (id: string, name: string) =>
      setProject((current) => renameProjectPage(current, id, name)),
    addPage, duplicateCurrentPage, requestDeletePage, confirmDeletePage,
    moveCurrentPage, setHomePage, moveLayer, save,
    changePage: (id: string) => { setPageId(id); setSelectedIds([]); },
    changeViewport: (mode: ViewportMode) => { setViewport(mode); setSelectedIds([]); },
    patchContent, patchName, patchStyle, patchViewportStyle, patchSetting,
    patchComponentData, patchAction, patchAnimation, patchPage,
  };
}
