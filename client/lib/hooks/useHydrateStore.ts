import { useAppDispatch, useAppSelector } from '@redux/hooks';
import { setUser } from '@redux/slices/user';

export default function useHydrateStore({
  userData,
}: {
  userData?: UserState;
}): void {
  const prevUserData = useAppSelector((store) => store.user);
  const dispatch = useAppDispatch();

  if (userData && userData.name !== prevUserData.name) {
    dispatch(setUser(userData));
  }
}
