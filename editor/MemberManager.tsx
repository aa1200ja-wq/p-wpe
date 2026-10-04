"use client";

import { useMemo, useState } from "react";
import { resolveMemberCarouselData } from "./member-config";
import { MemberImageDrop } from "./MemberImageDrop";
import type {
  ComponentData,
  MemberCarouselData,
  MemberItem,
  SiteElement,
  ViewportMode,
} from "./model";
import { uploadMemberImage } from "./upload-member-image";
import "./member-manager.css";

type Props = {
  element: SiteElement;
  viewport: ViewportMode;
  onChange: (data: ComponentData) => void;
};

type ImageKind = "cover" | "detail";

export function MemberManager({
  element,
  viewport,
  onChange,
}: Props) {
  const data = resolveMemberCarouselData(
    element.componentData?.memberCarousel,
  );
  const [activeId, setActiveId] = useState(data.members[0]?.id ?? "");
  const [uploading, setUploading] = useState<ImageKind | null>(null);
  const [message, setMessage] = useState("");

  const active = useMemo(
    () =>
      data.members.find((member) => member.id === activeId) ??
      data.members[0],
    [activeId, data.members],
  );

  function commit(next: MemberCarouselData) {
    onChange({
      ...element.componentData,
      memberCarousel: next,
    });
  }

  function patchMember(patch: Partial<MemberItem>) {
    if (!active) return;
    commit({
      ...data,
      members: data.members.map((member) =>
        member.id === active.id ? { ...member, ...patch } : member,
      ),
    });
  }

  function addMember() {
    const id =
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : "member-" + Date.now();
    const next: MemberItem = {
      id,
      name: "新團員",
      role: "團員",
      cover: "/assets/renwoxing/activity-01.webp",
      detail: "/assets/renwoxing/activity-01.webp",
    };
    commit({ ...data, members: [...data.members, next] });
    setActiveId(id);
  }

  function deleteMember() {
    if (!active || data.members.length <= 1) return;
    const next = data.members.filter((member) => member.id !== active.id);
    commit({ ...data, members: next });
    setActiveId(next[0]?.id ?? "");
  }

  function patchModal(
    patch: Partial<(typeof data.modal)[ViewportMode]>,
  ) {
    commit({
      ...data,
      modal: {
        ...data.modal,
        [viewport]: {
          ...data.modal[viewport],
          ...patch,
        },
      },
    });
  }

  async function replaceImage(kind: ImageKind, file: File) {
    setMessage("");
    setUploading(kind);
    try {
      const url = await uploadMemberImage(file);
      patchMember({ [kind]: url } as Partial<MemberItem>);
      setMessage("圖片已替換，記得儲存草稿。");
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "圖片上傳失敗",
      );
    } finally {
      setUploading(null);
    }
  }

  if (!active) return null;

  return (
    <section className="member-manager">
      <p className="member-manager-title">人物輪播管理</p>

      <div className="member-tabs">
        {data.members.map((member, index) => (
          <button
            key={member.id}
            type="button"
            className={member.id === active.id ? "active" : ""}
            onClick={() => setActiveId(member.id)}
          >
            {String(index + 1).padStart(2, "0")} {member.name}
          </button>
        ))}
      </div>

      <div className="member-fields">
        <label>
          <span>名稱</span>
          <input
            value={active.name}
            onChange={(event) =>
              patchMember({ name: event.target.value })
            }
          />
        </label>
        <label>
          <span>身分</span>
          <input
            value={active.role}
            onChange={(event) =>
              patchMember({ role: event.target.value })
            }
          />
        </label>
      </div>

      <MemberImageDrop
        title="輪播照片"
        src={active.cover}
        busy={uploading === "cover"}
        onFile={(file) => replaceImage("cover", file)}
      />
      <MemberImageDrop
        title="放大照片"
        src={active.detail}
        busy={uploading === "detail"}
        onFile={(file) => replaceImage("detail", file)}
      />

      <div className="member-modal-settings">
        <strong>
          放大照片（{viewport === "desktop" ? "桌機" : "手機"}）
        </strong>
        <div>
          <label>
            <span>寬</span>
            <input
              type="number"
              min="160"
              max="1200"
              value={data.modal[viewport].width}
              onChange={(event) =>
                patchModal({ width: Number(event.target.value) })
              }
            />
          </label>
          <label>
            <span>高</span>
            <input
              type="number"
              min="180"
              max="1400"
              value={data.modal[viewport].height}
              onChange={(event) =>
                patchModal({ height: Number(event.target.value) })
              }
            />
          </label>
        </div>
        <label>
          <span>圖片顯示</span>
          <select
            value={data.modal[viewport].fit}
            onChange={(event) =>
              patchModal({
                fit: event.target.value as "contain" | "cover",
              })
            }
          >
            <option value="contain">完整顯示</option>
            <option value="cover">裁切填滿</option>
          </select>
        </label>
      </div>

      <div className="member-actions">
        <button type="button" onClick={addMember}>
          ＋ 新增人物
        </button>
        <button
          type="button"
          className="danger"
          disabled={data.members.length <= 1}
          onClick={deleteMember}
        >
          刪除此人物
        </button>
      </div>

      {message && <p className="member-upload-message">{message}</p>}
    </section>
  );
}
