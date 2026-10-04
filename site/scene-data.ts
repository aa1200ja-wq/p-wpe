export type SectionId =
  | "about"
  | "events"
  | "members"
  | "booking"
  | "video"
  | "contact";

export const sections: Array<{
  id: SectionId;
  label: string;
  eyebrow: string;
  title: string;
  body: string;
}> = [
  {
    id: "about",
    label: "認識任我行",
    eyebrow: "ABOUT US",
    title: "十個不同的人，\n因為同一個夢想，走到了一起。",
    body: "我們來自不同的行業，有著不同的人生，卻因為熱愛薩克斯風而相遇。十名團員，在工作與生活之外，把時間留給音樂，也把每一次練習與演出，變成一起前進的理由。",
  },
  {
    id: "events",
    label: "活動精選",
    eyebrow: "EVENTS",
    title: "把值得記住的時刻，留在聲音裡。",
    body: "演出、聚會與交流活動，會在這裡留下完整紀錄。",
  },
  {
    id: "members",
    label: "人物",
    eyebrow: "PEOPLE",
    title: "十個角色，組成同一段聲音。",
    body: "九位團員與一位指導老師。人物照片完成後會接進這一頁。",
  },
  {
    id: "booking",
    label: "加入我們",
    eyebrow: "JOIN US",
    title: "如果你也熱愛薩克斯風，\n下一段旋律，想和你一起吹。",
    body: "不論來自哪個行業，只要還喜歡音樂，都歡迎加入任我行。一起練習、一起演出，把喜歡的事繼續下去。",
  },
  {
    id: "video",
    label: "影片欣賞",
    eyebrow: "WATCH",
    title: "旋律不只被聽見，也值得被看見。",
    body: "演出影片與精選片段會集中在這個章節。",
  },
  {
    id: "contact",
    label: "聯絡我們",
    eyebrow: "CONTACT",
    title: "下一段旋律，從一個訊息開始。",
    body: "合作、演出與交流需求，可透過聯絡資訊與任我行聯繫。",
  },
];
