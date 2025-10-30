import ResourceListPage from '@/components/admin/pages/ResourceListPage';
import { defaultAdminConfig } from '@/config/adminConfig';

const coursesResourceConfig = defaultAdminConfig.resources.find(r => r.name === 'courses')!;
const { icon: _icon, ...coursesResourceConfigWithoutIcon } = coursesResourceConfig;

export default function AdminCoursesPage() {
  return <ResourceListPage config={coursesResourceConfigWithoutIcon} />;
}
