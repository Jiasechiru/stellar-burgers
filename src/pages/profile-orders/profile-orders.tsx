import { ProfileOrdersUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import { useSelector, useDispatch } from '../../services/store';
import { fetchProfileOrders } from '../../services/profileOrdersSlice';
import { Preloader } from '@ui';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();
  const orders = useSelector((state) => state.profileOrders.orders);
  const loading = useSelector((state) => state.profileOrders.loading);
  const error = useSelector((state) => state.profileOrders.error);

  useEffect(() => {
    dispatch(fetchProfileOrders());
  }, [dispatch]);

  if (loading) return <Preloader />;
  if (error)
    return <div style={{ color: 'red', textAlign: 'center' }}>{error}</div>;

  return <ProfileOrdersUI orders={orders} />;
};
