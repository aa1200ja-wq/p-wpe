import { genericProject } from "@/editor/generic-project";
import { PublicProjectSite } from "@/site/PublicProjectSite";

export default function SitePage() {
  return <PublicProjectSite project={genericProject} />;
}
