export type Member = {
  id: number;
  name: string;
  role: string;
  cover: string;
  detail: string;
};

const asset = (file: string) => `/assets/renwoxing/${file}`;

export const members: Member[] = [
  { id: 1, name: "貞如", role: "團員", cover: asset("zhenru-01.webp"), detail: asset("zhenru-02.webp") },
  { id: 2, name: "團員 A", role: "團員", cover: asset("member-a-01.webp"), detail: asset("member-a-02.webp") },
  { id: 3, name: "團員 B", role: "團員", cover: asset("member-b-02.webp"), detail: asset("member-b-01.webp") },
  { id: 4, name: "團員 C", role: "團員", cover: asset("member-c-01.webp"), detail: asset("member-c-02.webp") },
  { id: 5, name: "團員 D", role: "團員", cover: asset("member-d-02.webp"), detail: asset("member-d-01.webp") },
  { id: 6, name: "團員 E", role: "團員", cover: asset("member-e-01.webp"), detail: asset("member-e-02.webp") },
  { id: 7, name: "團員 F", role: "團員", cover: asset("member-f-01.webp"), detail: asset("member-f-02.webp") },
  { id: 8, name: "團員 G", role: "團員", cover: asset("member-g-01.webp"), detail: asset("member-g-02.webp") },
  { id: 9, name: "團長", role: "團長", cover: asset("leader-01.webp"), detail: asset("leader-02.webp") },
  { id: 10, name: "指導老師", role: "指導老師", cover: asset("instructor-01.webp"), detail: asset("instructor-02.webp") },
];
