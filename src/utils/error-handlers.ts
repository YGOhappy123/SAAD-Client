import { toast } from 'react-toastify';
import toastConfig from '../configs/toast';
import type { IResponseData } from '../types';
import type { AxiosError } from 'axios';
import { t } from 'i18next';
export const onError = (error: Error) => {
  toast(
    t((error as AxiosError<IResponseData<unknown>>).response?.data?.message as string, { nsSeparator: false }).toString() || error.message,
    toastConfig('error'),
  );
};
