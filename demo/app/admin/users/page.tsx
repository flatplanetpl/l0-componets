import ResourceListPage from '@/components/admin/pages/ResourceListPage';
import { defaultAdminConfig } from '@/config/adminConfig';

const userResourceConfig = defaultAdminConfig.resources.find(r => r.name === 'users')!;
const { icon: _icon, ...userResourceConfigWithoutIcon } = userResourceConfig;

export default function AdminUsersPage() {
  return <ResourceListPage config={userResourceConfigWithoutIcon} />;
}
