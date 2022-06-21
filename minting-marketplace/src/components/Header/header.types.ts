import { History, LocationState } from 'history';
import { TSearchDataObject } from '../../ducks/search/search.types';
import { ContractType } from '../adminViews/adminView.types';

export interface IMainHeader {
    goHome: () => void,
    loginDone: boolean,
    startedLogin: boolean,
    renderBtnConnect: boolean,
    connectUserData: () => void,
    setLoginDone: (value: boolean) => void,
    userData: TSearchDataObject,
    sentryHistory: History<LocationState>,
    creatorViewsDisabled: boolean,
    selectedChain: string | null,
    showAlert: boolean
};

export type TAxiosCollectionData = {
    succuss: boolean,
    contract: TContractHeaderResponse
}

export type TContractHeaderResponse = Omit<ContractType, "diamond">;
