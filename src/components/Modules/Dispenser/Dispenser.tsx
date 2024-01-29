import './Dispenser.scss';
import React, {useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../redux/store";
import LoadingTile from "../../Common/LoadingTile/LoadingTile";
import {Alert, Button, FormLabel, Grid, InputBase, InputBaseProps, styled} from "@mui/material";
import {CoreNode} from "../../../packages/core-sdk/classes/core/CoreNode";
import {KmdClient} from "../../../packages/core-sdk/clients/kmdClient";
import {showSnack} from "../../../redux/common/actions/snackbar";
import algosdk, {isValidAddress, SuggestedParams, waitForConfirmation} from "algosdk";
import {hideLoader, showLoader} from "../../../redux/common/actions/loader";
import dappflow from "../../../utils/dappflow";
import LinkToTransaction from "../Explorer/Common/Links/LinkToTransaction";
import {isNumber} from "../../../utils/common";
import KMDConfiguration from "../../LeftBar/KMDConfiguration/KMDConfiguration";
import {getKMDConfig} from "../../../utils/nodeConfig";
import {KMDConnectionParams} from "../../../packages/core-sdk/types";
import LaunchIcon from '@mui/icons-material/Launch';
import {theme} from "../../../theme";
import AlgoIcon from "../Explorer/AlgoIcon/AlgoIcon";

const ShadedInput = styled(InputBase)<InputBaseProps>(({ theme }) => {
    return {
        padding: 5,
        paddingLeft: 10,
        marginTop: 5,
        border: '1px solid ' + theme.palette.grey[200]
    };
});

const formLabelStyle = {
    marginLeft: '5px',
    color: theme.palette.grey[600]
};

interface DispenserState{
    address: string,
    success: boolean
    error: boolean,
    txId: string,
    errMsg: string,
    amount: string,
    showKmdConfig: boolean
}

const initialState: DispenserState = {
    address: "",
    success: false,
    error: false,
    txId: "",
    errMsg: "",
    amount: "",
    showKmdConfig: false
};

function Dispenser(): JSX.Element {

    const node = useSelector((state: RootState) => state.node);
    const {loading, versionsCheck, status, genesis, health} = node;
    const coreNodeInstance = new CoreNode(status, versionsCheck, genesis, health);
    const isSandbox = coreNodeInstance.isSandbox();
    const dispenerLinks = coreNodeInstance.getDispenserLinks();
    const dispatch = useDispatch();

    const [
        {address, success, error, txId, errMsg, amount, showKmdConfig},
        setState
    ] = useState(initialState);

    function resetAttempt() {
        setState(prevState => ({...prevState, success: false, error: false, txId: "", errMsg: ""}));
    }

    function setSuccess(txId: string) {
        setState(prevState => ({...prevState, success: true, error: false, txId, errMsg: "", address: "", amount: ""}));
    }

    function setError(message: string) {
        setState(prevState => ({...prevState, success: false, error: true, txId: "", errMsg: message}));
    }

    async function dispense() {
        const params: KMDConnectionParams = getKMDConfig();

        if (!address) {
            dispatch(showSnack({
                severity: 'error',
                message: 'Invalid address'
            }));
            return;
        }
        if (!isValidAddress(address)) {
            dispatch(showSnack({
                severity: 'error',
                message: 'Invalid address'
            }));
            return;
        }
        if (!amount) {
            dispatch(showSnack({
                severity: 'error',
                message: 'Invalid amount'
            }));
            return;
        }
        if (!isNumber(amount)) {
            dispatch(showSnack({
                severity: 'error',
                message: 'Invalid amount'
            }));
            return;
        }

        try {
            resetAttempt();
            dispatch(showLoader("Checking KMD configuration"));
            const dispenserAccount = await new KmdClient(params).getDispenserAccount();
            dispatch(hideLoader());

            dispatch(showLoader("Loading suggested params"));
            const client = dappflow.network.getClient();
            const suggestedParams: SuggestedParams = await client.getTransactionParams().do();
            dispatch(hideLoader());

            dispatch(showLoader(""));
            const amountInMicros = algosdk.algosToMicroalgos(Number(amount));
            const enc = new TextEncoder();
            const note = enc.encode("Dispencing algos from dappflow dispenser");

            const unsignedTxn = algosdk.makePaymentTxnWithSuggestedParams(dispenserAccount.addr, address, amountInMicros, undefined, note, suggestedParams, undefined);
            const signedTxn = unsignedTxn.signTxn(dispenserAccount.sk);

            dispatch(hideLoader());

            dispatch(showLoader("Submitting transaction"));
            const {txId} = await client.sendRawTransaction(signedTxn).do();
            dispatch(hideLoader());

            dispatch(showLoader("Waiting for confirmation"));
            await waitForConfirmation(client, txId, 10);
            dispatch(hideLoader());

            setSuccess(txId);

        }
        catch (e: any) {
            dispatch(hideLoader());
            setError(e.message);
        }

    }

    return (<div className={"dispenser-wrapper"}>
        <div className={"dispenser-container"}>

            <div className={"dispenser-header"}>
                <div>
                    Dispenser
                </div>
                <div>
                    {isSandbox ? <Button
                        size="small"
                        color={"warning"}
                        sx={{marginTop: '-5px'}}
                        variant={"outlined"} onClick={() => {
                        setState(prevState => ({...prevState, showKmdConfig: true}));
                    }
                    }>KMD config</Button> : ''}

                </div>
            </div>
            <div className={"dispenser-body"}>
                {loading ? <div>
                    <Grid container spacing={0}>
                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                            <LoadingTile></LoadingTile>
                        </Grid>
                    </Grid>
                </div> : <div>
                    {isSandbox ? <div className="sandbox-dispenser">
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                <div>
                                    <FormLabel sx={formLabelStyle}>Address</FormLabel>
                                    <ShadedInput
                                        multiline={true}
                                        placeholder="L3E67NGZMM5G7PXFV377HJZBJJ335F32GTA77JAIOBXAXPZF2ZRNEPH2MA"
                                        type={"text"}
                                        required
                                        value={address}
                                        onChange={(ev) => {
                                            setState(prevState => ({...prevState, address: ev.target.value + ""}));
                                        }}
                                        fullWidth
                                        sx={{marginTop: '5px', marginBottom: '10px', fieldset: {borderRadius: '10px'}}}
                                        rows={4}
                                    />
                                </div>
                                <div>
                                    <FormLabel sx={formLabelStyle}>Amount</FormLabel>

                                    <ShadedInput
                                        type={"number"}
                                        required
                                        size={"medium"}
                                        value={amount}
                                        sx={{marginTop: '5px', marginBottom: '10px', fieldset: {borderRadius: '10px'}}}
                                        onChange={(ev) => {
                                            setState(prevState => ({...prevState, amount: ev.target.value + ""}));
                                        }}
                                        endAdornment={<div style={{marginRight: '10px'}}><AlgoIcon></AlgoIcon></div>}
                                        fullWidth
                                    />
                                </div>

                                <div style={{marginTop: '15px', textAlign: "right"}}>
                                    <Button color={"primary"}
                                            className="black-button"
                                            fullWidth
                                            size={"large"}
                                            variant={"contained"} onClick={() => {
                                        dispense();
                                    }
                                    }>Dispense</Button>
                                </div>

                                <div style={{marginTop: '30px', wordBreak: "break-all"}}>
                                    {success ? <div>
                                        <Alert icon={false} color={"success"}>
                                            <div>
                                                Transaction successful :
                                            </div>
                                            <LinkToTransaction id={txId} sx={{color: 'common.black', marginTop: 15}}></LinkToTransaction>
                                        </Alert>

                                    </div> : ''}

                                    {error ? <div>
                                        <Alert icon={false} color={"error"}>
                                            {errMsg}
                                        </Alert>

                                    </div> : ''}
                                </div>
                            </Grid>
                        </Grid>
                    </div> : <div>
                        <Grid container spacing={0}>
                            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                <Alert icon={false} color={"warning"}>
                                    Dispenser is available only for sandbox environment.
                                    <br/>
                                    {dispenerLinks.length > 0 ? 'Please try below dispensers by community.' : 'Community dispensers are not available for this network.'}

                                </Alert>
                                {dispenerLinks.map((link, index) => {
                                    return <Button
                                        endIcon={<LaunchIcon fontSize={"small"}></LaunchIcon>}
                                        className="black-button" color={"primary"} variant={"contained"} sx={{marginTop: '15px', marginLeft: '10px'}} onClick={() => {
                                        window.open(link, "_blank")
                                    }
                                    }>
                                        Dispenser {index + 1}
                                    </Button>
                                })}
                            </Grid>
                        </Grid>

                    </div>}
                </div>}
            </div>



        <KMDConfiguration show={showKmdConfig} onClose={() => {
            setState(prevState => ({...prevState, showKmdConfig: false}));
        }}></KMDConfiguration>
        </div>
    </div>);
}

export default Dispenser;
