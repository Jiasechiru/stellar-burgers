import { FC, useMemo, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from '../../services/store';
import { fetchProfileOrders } from '../../services/profileOrdersSlice';
import { fetchFeed } from '../../services/feedSlice';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';

export const OrderInfo: FC = () => {
  const { number } = useParams();
  const location = useLocation();
  const dispatch = useDispatch();
  const feedOrders = useSelector((state) => state.feed.orders);
  const profileOrders = useSelector((state) => state.profileOrders.orders);
  const ingredients = useSelector((state) => state.ingredients.items);
  const feedLoading = useSelector((state) => state.feed.loading);
  const profileLoading = useSelector((state) => state.profileOrders.loading);

  useEffect(() => {
    if (
      location.pathname.startsWith('/profile/orders/') &&
      profileOrders.length === 0 &&
      !profileLoading
    ) {
      dispatch(fetchProfileOrders());
    }
  }, [location.pathname, profileOrders.length, profileLoading, dispatch]);

  useEffect(() => {
    if (
      location.pathname.startsWith('/feed/') &&
      feedOrders.length === 0 &&
      !feedLoading
    ) {
      dispatch(fetchFeed());
    }
  }, [location.pathname, feedOrders.length, feedLoading, dispatch]);

  const orderData =
    feedOrders.find((order) => String(order.number) === number) ||
    profileOrders.find((order) => String(order.number) === number);

  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (feedLoading || profileLoading || !orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
