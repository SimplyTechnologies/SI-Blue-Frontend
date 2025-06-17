import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import * as z from 'zod';

import { updateUser } from '@/api/user';
import { Form } from '@/components/atom/Form';
import useAuthStore from '@/stores/useAuthStore';
import { Button } from '@/components/atom/Button';
import { zodResolver } from '@hookform/resolvers/zod';
import getColorFromName from '@/utils/getRandomColor';
import InputField from '@/components/molecule/InputField';
import { useForgotPassword } from '@/hooks/useForgotPassword';
import AvatarUpload from '@/components/molecule/AvatarUpload';
import { useUploadAvatar, useDeleteAvatar } from '@/hooks/useUser';
import { CustomAlertDialog } from '@/components/molecule/CustomAlertDialog';

const userFormSchema = z.object({
  firstName: z.string().min(1, 'First Name is required.'),
  lastName: z.string().min(1, 'Last Name is required.'),
  phoneNumber: z
    .string()
    .min(1, 'Phone Number is required.')
    .min(10, 'Phone number must be at least 10 digits')
    .max(25, 'Phone number must be less than 25 digits')
    .regex(/^\+?[\d\s()-]+$/, 'Invalid phone number format')
    .transform(str => str.replace(/\s/g, '')),
});

type UserFormValues = z.infer<typeof userFormSchema>;

const MyProfile = () => {
  const { user, setUser, logout } = useAuthStore();
  const [isEdit, setIsEdit] = useState(false);
  const [isConfirmResetOpen, setIsConfirmResetOpen] = useState(false);
  const { mutateAsync, isPending: isResetPasswordPending } = useForgotPassword();
  const userCredentials = (user?.firstName[0] || '') + (user?.lastName[0] || '');
  const avatarFallback = getColorFromName(`${user?.firstName} ${user?.lastName}`);
  const uploadAvatar = useUploadAvatar();
  const deleteAvatar = useDeleteAvatar();

  const handleImageUpload = (file: File) => {
    if (!user?.id) return;

    const formData = new FormData();
    formData.append('avatar', file);
    uploadAvatar.mutate(
      { id: user.id, body: formData },
      {
        onSuccess: response => {
          setUser({ ...user, avatarUrl: response.avatarUrl });
        },
      },
    );
  };

  const handleImageDelete = () => {
    if (!user?.id) return;

    deleteAvatar.mutate(user.id, {
      onSuccess: () => {
        setUser({ ...user, avatarUrl: null });
      },
    });
  };

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      firstName: user?.firstName,
      lastName: user?.lastName,
      phoneNumber: user?.phoneNumber,
    },
    mode: 'onBlur',
  });

  const { mutate, isPending } = useMutation({
    mutationFn: updateUser,
    onSuccess: data => {
      setUser(data.user);
      setIsEdit(false);
      form.reset({
        firstName: data.user.firstName,
        lastName: data.user.lastName,
        phoneNumber: data.user.phoneNumber,
      });
      toast.success('Profile has been successfully updated!');
    },
    onError: () => {
      toast.error('Failed to update profile. Please try again.');
    },
  });

  const onSubmit = (values: UserFormValues) => {
    mutate(values);
  };

  const handleResetPassword = async () => {
    try {
      await mutateAsync({ email: user?.email || '' });
      toast.success('Password reset link sent to your email.');
      setIsConfirmResetOpen(false);
      logout();
    } catch (e) {
      console.dir(e);
      toast.error('Failed to send password reset link. Please try again.');
    }
  };

  return (
    <div className="bg-white m-6 p-6 rounded-2xl h-full">
      <div className="mb-10">
        <h1 className="text-2xl font-bold text-primary mb-1">My Profile</h1>
        <p className="text-support-5">This information can be edited from your profile page.</p>
      </div>
      <div className="mb-9">
        <AvatarUpload
          src={user?.avatarUrl || undefined}
          fallback={userCredentials}
          onImageUpload={handleImageUpload}
          onImageDelete={handleImageDelete}
          fallbackColor={avatarFallback.color}
          fallbackBackground={avatarFallback.bg}
          loading={uploadAvatar.isPending}
        />
      </div>
      <div>
        <h2 className="text-lg font-bold text-primary mb-0.5">
          {user?.firstName} {user?.lastName}
        </h2>
        <p className="text-support-5 font-medium">{user?.email}</p>
      </div>
      <hr className="h-px my-6 border-support-12" />
      <Form {...form}>
        <form id="update-user-form" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4">
            <h2 className="text-lg font-bold text-primary mb-1 sm:mb-0">Personal Information</h2>
            <div className="flex items-center space-x-2 sm:space-x-12">
              {isEdit && (
                <Button
                  type="button"
                  className="h-[40px] w-[128px] text-xs"
                  variant="outline"
                  onClick={() => {
                    form.reset();
                    setIsEdit(false);
                  }}
                >
                  Cancel
                </Button>
              )}
              <Button
                type={isEdit ? 'submit' : 'button'}
                className="h-[40px] w-[128px] text-xs"
                variant="default"
                disabled={isPending || (isEdit && !form.formState.isDirty)}
                onClick={e => {
                  if (!isEdit) {
                    e.preventDefault();
                    setIsEdit(true);
                  }
                }}
              >
                {!isEdit ? 'Edit' : 'Save'}
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-x-[10px] gap-y-[10px] sm:grid-cols-2 max-w-xl">
            <InputField
              form={form}
              name="firstName"
              label="First Name"
              errorClassName={form.formState.errors.lastName ? 'min-h-[1.25rem]' : ''}
              disabled={!isEdit}
            />
            <InputField
              form={form}
              name="lastName"
              label="Last Name"
              errorClassName={form.formState.errors.firstName ? 'min-h-[1.25rem]' : ''}
              disabled={!isEdit}
            />
            <InputField
              form={form}
              name="phoneNumber"
              label="Phone Number"
              formItemClassName="sm:col-span-2"
              disabled={!isEdit}
            />
          </div>
        </form>
      </Form>
      <hr className="h-px my-6 border-support-12" />
      <div className="flex flex-col sm:flex-row justify-between sm:items-center">
        <div className="mb-1 sm:mb-0">
          <h2 className="text-lg font-bold text-primary mb-1">Change Password</h2>
          <p className="text-support-5 font-medium">Forgot your password, find back in seconds</p>
        </div>
        <div>
          <Button className="h-[40px] w-[128px] text-xs" variant="default" onClick={() => setIsConfirmResetOpen(true)}>
            Reset Password
          </Button>
        </div>
      </div>
      <CustomAlertDialog
        open={isConfirmResetOpen}
        setOpen={setIsConfirmResetOpen}
        title="Reset Password"
        description="Are you sure that you would like to reset password? You will be logged out from all devices."
        handleConfirm={handleResetPassword}
        actionBtnText={isResetPasswordPending ? 'Loading...' : 'Reset'}
        actionBtnDisabled={isResetPasswordPending}
      />
    </div>
  );
};

export default MyProfile;
