export type UserActivity = {
  id: number;
  userId: number;
  modelType: string;
  actionType: string;
  previousValue: string;
  currentValue: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    avatarPublicId: string | null;
  };
}