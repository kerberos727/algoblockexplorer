import './ABIMethod.scss';
import React, {useState} from "react";
import {
    Accordion,
    AccordionDetails,
    AccordionSummary, Button,
    Grid
} from "@mui/material";
import {ExpandMore} from "@mui/icons-material";
import {ABIMethodParams, ABIMethod as ABIMethodSDK} from "algosdk";
import ABIMethodSignature from "../ABIMethodSignature/ABIMethodSignature";
import ABIMethodExecutorCls from "../../../../packages/abi/classes/ABIMethodExecutor";
import ABIMethodExecutor from "../ABIMethodExecutor/ABIMethodExecutor";
import OfflineBoltIcon from '@mui/icons-material/OfflineBolt';
import {Alert} from "@mui/lab";
import {showSnack} from "../../../../redux/common/actions/snackbar";
import {useDispatch} from "react-redux";
import {ABI_METHOD_EXECUTOR_SUPPORTED_TXN_TYPES} from "../../../../packages/abi/types";
import {A_AccountInformation} from "../../../../packages/core-sdk/types";

type ABIMethodProps = {
    method: ABIMethodParams,
    supportExecutor?: boolean,
    account: A_AccountInformation,
    appId: string
};

interface ABIMethodState{
    showExecutor: boolean,
}

const initialState: ABIMethodState = {
    showExecutor: false
};

function ABIMethod({method, supportExecutor = true, account, appId = ''}: ABIMethodProps): JSX.Element {
    
    const dispatch = useDispatch();
    const abiMethodInstance = new ABIMethodSDK(method);
    const args = abiMethodInstance.args;

    const [
        {showExecutor},
        setState
    ] = useState(initialState);

    return (<div className={"abi-method-wrapper"}>
        <div className={"abi-method-container"}>
            <div className="abi-method">
                <Accordion className="rounded">
                    <AccordionSummary
                        expandIcon={<ExpandMore />}>
                        <div style={{width: '100%'}}>
                            <span className="method-name">
                                {abiMethodInstance.name}
                            </span>
                            <span className="method-desc">
                                {abiMethodInstance.description}
                            </span>
                            {supportExecutor ? <span className="method-exec">
                                <Button onClick={(ev) => {
                                    ev.preventDefault();
                                    ev.stopPropagation();

                                    if (!account.address) {
                                        dispatch(showSnack({
                                            severity: 'error',
                                            message: 'Please connect your wallet'
                                        }));
                                        return;
                                    }
                                    if (!appId) {
                                        dispatch(showSnack({
                                            severity: 'error',
                                            message: 'App ID is null. If you already have a existing app, Please setup your app id using edit button above. If not create a new application'
                                        }));
                                        return;
                                    }

                                    if (!new ABIMethodExecutorCls(method).canExecute()) {
                                        dispatch(showSnack({
                                            severity: 'error',
                                            message: `Cannot execute.Only [${ABI_METHOD_EXECUTOR_SUPPORTED_TXN_TYPES.join(',')}] are supported. But this method has [${new ABIMethodExecutorCls(method).getSequenceOfTxnTypes().join(',')}]`
                                        }));
                                        return;
                                    }


                                    setState(prevState => ({...prevState, showExecutor: true}));
                                }} color={"primary"}
                                        startIcon={<OfflineBoltIcon></OfflineBoltIcon>}
                                        className="black-button"
                                        variant={"outlined"} size={"small"}>Execute</Button>
                            </span> : ''}

                        </div>
                    </AccordionSummary>
                    <AccordionDetails>

                        <div className="method-body">

                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                    <div className="method-title">Method details</div>
                                    <ABIMethodSignature method={method}></ABIMethodSignature>
                                </Grid>

                            </Grid>

                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                    <div className="arguments">
                                        <div className="arguments-title">Arguments</div>
                                        <div className="arguments-header">
                                            <Grid container spacing={0}>
                                                <Grid item xs={12} sm={4} md={3} lg={3} xl={3}>
                                                    Name
                                                </Grid>
                                                <Grid item xs={12} sm={4} md={3} lg={3} xl={3}>
                                                    Type
                                                </Grid>
                                                <Grid item xs={12} sm={4} md={6} lg={6} xl={6}>
                                                    Description
                                                </Grid>
                                            </Grid>
                                        </div>


                                        {args.map((arg) => {
                                            return <div className="arg" key={arg.name}>
                                                <Grid container spacing={0}>
                                                    <Grid item xs={12} sm={4} md={3} lg={3} xl={3}>
                                                        <div className="arg-prop">{arg.name}</div>
                                                    </Grid>
                                                    <Grid item xs={12} sm={4} md={3} lg={3} xl={3}>
                                                        <div className="arg-prop">{arg.type.toString()}</div>
                                                    </Grid>
                                                    <Grid item xs={12} sm={4} md={6} lg={6} xl={6}>
                                                        <div className="arg-prop">{arg.description}</div>
                                                    </Grid>
                                                </Grid>
                                            </div>;
                                        })}

                                        <div className="method-returns">
                                            <div className="method-returns-title">Returns</div>
                                            <Alert color={'success'} icon={false} className="mini-alert">
                                                {abiMethodInstance.returns.type.toString()}
                                            </Alert>

                                            <div className="method-returns-desc">
                                                {abiMethodInstance.returns.description}
                                            </div>
                                        </div>

                                    </div>
                                </Grid>
                            </Grid>



                        </div>

                    </AccordionDetails>
                </Accordion>
            </div>
            <ABIMethodExecutor appId={appId} show={showExecutor} method={method} handleClose={() => {
                setState(prevState => ({...prevState, showExecutor: false}));
            }} account={account}></ABIMethodExecutor>
        </div>
    </div>);
}

export default ABIMethod;
