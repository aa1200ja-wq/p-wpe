import { renwoxingProject } from "@/editor/renwoxing-project";
import { getPublishedProject } from "@/lib/supabase-site-store";
import { PublicProjectSite } from "@/site/PublicProjectSite";
import { RenwoxingExperience } from "@/site/RenwoxingExperience";

export const dynamic = "force-dynamic";

export default async function SitePage() {
  const published = await getPublishedProject("renwoxing").catch(() => null);

  if (!published) {
    return <RenwoxingExperience />;
  }

  return <PublicProjectSite project={published ?? renwoxingProject} />;
}
