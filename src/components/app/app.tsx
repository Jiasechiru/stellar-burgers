import {
  ConstructorPage,
  Feed,
  Login,
  Register,
  ForgotPassword,
  ResetPassword,
  Profile,
  ProfileOrders,
  NotFound404
} from '@pages';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch } from '../../services/store';
import { fetchIngredients } from '../../services/ingredientsSlice';

import '../../index.css';
import styles from './app.module.css';

import { AppHeader, Modal, OrderInfo, IngredientDetails } from '@components';
import { ProtectedRoute } from '../protected-route/protected-route';

const App = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const background = location.state && location.state.background;

  useEffect(() => {
    dispatch(fetchIngredients());
  }, [dispatch]);

  const isModalRoute = location.pathname.match(
    /^\/(feed|ingredients|profile\/orders)\/[^\/]+$/
  );

  useEffect(() => {
    if (isModalRoute) {
      sessionStorage.setItem('modalOpened', 'true');
    }
  }, [isModalRoute]);

  const handleModalClose = () => {
    sessionStorage.removeItem('modalOpened');

    if (background?.pathname === '/profile/orders') {
      navigate('/profile/orders', { replace: true });
    } else if (background?.pathname === '/feed') {
      navigate('/feed', { replace: true });
    } else if (location.pathname.startsWith('/profile/orders/')) {
      navigate('/profile/orders', { replace: true });
    } else if (location.pathname.startsWith('/feed/')) {
      navigate('/feed', { replace: true });
    } else if (location.pathname.startsWith('/ingredients/')) {
      navigate('/', { replace: true });
    } else {
      navigate(-1);
    }
  };

  const shouldShowModal =
    (background && isModalRoute) ||
    (!background &&
      isModalRoute &&
      sessionStorage.getItem('modalOpened') === 'true');

  return (
    <div className={styles.app}>
      <AppHeader />
      <Routes location={background || location}>
        <Route path='/' element={<ConstructorPage />} />
        <Route path='/feed' element={<Feed />} />
        <Route
          path='/login'
          element={
            <ProtectedRoute>
              <Login />
            </ProtectedRoute>
          }
        />
        <Route
          path='/register'
          element={
            <ProtectedRoute>
              <Register />
            </ProtectedRoute>
          }
        />
        <Route
          path='/forgot-password'
          element={
            <ProtectedRoute>
              <ForgotPassword />
            </ProtectedRoute>
          }
        />
        <Route
          path='/reset-password'
          element={
            <ProtectedRoute>
              <ResetPassword />
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile'
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile/orders'
          element={
            <ProtectedRoute>
              <ProfileOrders />
            </ProtectedRoute>
          }
        />

        <Route path='/feed/:number' element={<OrderInfo />} />
        <Route path='/ingredients/:id' element={<IngredientDetails />} />
        <Route
          path='/profile/orders/:number'
          element={
            <ProtectedRoute>
              <OrderInfo />
            </ProtectedRoute>
          }
        />
        <Route path='*' element={<NotFound404 />} />
      </Routes>
      {shouldShowModal && (
        <>
          <Routes>
            <Route
              path='/feed/:number'
              element={
                <Modal onClose={handleModalClose} title='Информация о заказе'>
                  <OrderInfo />
                </Modal>
              }
            />
            <Route
              path='/ingredients/:id'
              element={
                <Modal onClose={handleModalClose} title='Детали ингредиента'>
                  <IngredientDetails />
                </Modal>
              }
            />
            <Route
              path='/profile/orders/:number'
              element={
                <ProtectedRoute>
                  <Modal onClose={handleModalClose} title='Информация о заказе'>
                    <OrderInfo />
                  </Modal>
                </ProtectedRoute>
              }
            />
          </Routes>
        </>
      )}
    </div>
  );
};

export default App;
