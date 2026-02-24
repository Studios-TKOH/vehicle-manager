import { all, takeEvery, put, delay, select } from 'redux-saga/effects';
import { addSaleRequest, addSaleSuccess, updateSaleStatus } from './slices/salesSlice';
import type { RootState } from './index';

const getPendingSales = (state: RootState) =>
  state.sales.items.filter((item) => item.sync_status === 'PENDING');

function* syncPendingSales() {
  if (!navigator.onLine) return;
  const pendingSales: ReturnType<typeof getPendingSales> = yield select(getPendingSales);

  for (const sale of pendingSales) {
    try {
      yield delay(1000);
      yield put(updateSaleStatus({ id: sale.id, status: 'SYNCED' }));
    } catch (error) {
      console.error('Error sincronizando venta:', sale.id);
    }
  }
}

function* handleAddSale(action: any) {
  if (navigator.onLine) {
    yield delay(500);
    yield put(addSaleSuccess(action.payload.id));
  }
}

export default function* rootSaga() {
  yield all([
    takeEvery(addSaleRequest.type, handleAddSale),
    takeEvery('app/RECONNECTED', syncPendingSales)
  ]);
}