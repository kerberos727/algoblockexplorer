import { configureStore } from '@reduxjs/toolkit';
import snackbarReducer from './common/actions/snackbar';
import accountsReducer from "./explorer/actions/accounts";
import transactionsReducer from "./explorer/actions/transactions";
import assetsReducer from "./explorer/actions/assets";
import applicationsReducer from "./explorer/actions/applications";
import settingsReducer from "./settings/actions/settings";
import developerApiReducer from "./developerApi/actions/developerApi";
import loaderReducer from "./common/actions/loader";
import accountReducer from "./explorer/actions/account";
import blockReducer from "./explorer/actions/block";
import assetReducer from "./explorer/actions/asset";
import applicationReducer from "./explorer/actions/application";
import transactionReducer from "./explorer/actions/transaction";
import groupReducer from "./explorer/actions/group";
import liveData from "./explorer/actions/liveData";
import arcs from "./arcPortal/actions/arcs";
import arc from "./arcPortal/actions/arc";
import node from "./network/actions/node";
import app from "./app/actions/app";
import kmd from "./explorer/actions/kmd";
import connectWallet from "./wallet/actions/connectWallet";
import wallet from "./wallet/actions/wallet";
import signer from "./wallet/actions/signer";
import abiStudio from "./abi/actions/abiStudio";
import devWallets from "./devWallets/actions/devWallets";

export const store = configureStore({
    reducer: {
        snackbar: snackbarReducer,
        accounts: accountsReducer,
        transactions: transactionsReducer,
        assets: assetsReducer,
        applications: applicationsReducer,
        settings: settingsReducer,
        developerApi: developerApiReducer,
        loader: loaderReducer,
        account: accountReducer,
        block: blockReducer,
        asset: assetReducer,
        application: applicationReducer,
        transaction: transactionReducer,
        group: groupReducer,
        liveData: liveData,
        arcs: arcs,
        arc: arc,
        node: node,
        app: app,
        kmd: kmd,
        connectWallet: connectWallet,
        wallet: wallet,
        signer: signer,
        abiStudio: abiStudio,
        devWallets: devWallets
    },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch