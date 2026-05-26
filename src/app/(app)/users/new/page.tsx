import { UserForm } from '@/components/users/UserForm';

export default function NewUserPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold tracking-tight">New User</h1>
      <UserForm />
    </div>
  );
}
