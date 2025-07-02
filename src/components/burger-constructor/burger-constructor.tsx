import { FC, useMemo, useEffect } from 'react';
import { useSelector, useDispatch } from '../../services/store';
import { TIngredient, TConstructorIngredient } from '../../utils/types';
import { BurgerConstructorUI } from '@ui';
import { useNavigate, useLocation } from 'react-router-dom';
import { placeOrder, clearOrder } from '../../services/orderSlice';
import { resetConstructor } from '../../services/constructorSlice';

export const BurgerConstructor: FC = () => {
  const bun = useSelector((state) => state.burgerConstructor.bun);
  const ingredients = useSelector(
    (state) => state.burgerConstructor.ingredients
  ) as TConstructorIngredient[];
  const isAuth = useSelector((state) => state.auth.isAuth);
  const orderRequest = useSelector((state) => state.order.loading);
  const orderModalData = useSelector((state) => state.order.order);
  const orderError = useSelector((state) => state.order.error);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const constructorItems = {
    bun: bun,
    ingredients: Array.isArray(ingredients) ? ingredients : []
  };

  const onOrderClick = () => {
    if (!isAuth) {
      navigate('/login', { state: { from: location } });
      return;
    }
    if (!constructorItems.bun || orderRequest) return;
    const ingredientIds = [
      constructorItems.bun._id,
      ...constructorItems.ingredients.map((item) => item._id),
      constructorItems.bun._id
    ];
    dispatch(placeOrder(ingredientIds));
  };
  const closeOrderModal = () => {
    dispatch(clearOrder());
  };

  useEffect(() => {
    if (orderModalData) {
      dispatch(resetConstructor());
    }
  }, [orderModalData, dispatch]);

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
