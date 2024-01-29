import './KMDConfiguration.scss';
import {useDispatch} from "react-redux";
import React, {useState} from "react";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle, FormLabel, Grid,
    InputBase, InputBaseProps, styled
} from "@mui/material";
import {theme} from "../../../theme";
import {getKMDConfig} from "../../../utils/nodeConfig";
import {showSnack} from "../../../redux/common/actions/snackbar";
import {isNumber} from "../../../utils/common";
import {hideLoader, showLoader} from "../../../redux/common/actions/loader";
import {isBrave} from "../../../packages/core-sdk/utils";
import {KMDConnectionParams} from "../../../packages/core-sdk/types";
import {KmdClient} from "../../../packages/core-sdk/clients/kmdClient";
import CloseIcon from "@mui/icons-material/Close";

const kmdConfig = getKMDConfig();

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
    fontSize: '14px',
    fontWeight: 'bold',
    color: theme.palette.grey[600]
};

interface KMDConfigurationState{
    url: string,
    port: string,
    token: string,
}

const initialState: KMDConfigurationState = {
    url: kmdConfig.url,
    port: kmdConfig.port,
    token: kmdConfig.token as string
};

function KMDConfiguration(props): JSX.Element {

    const dispatch = useDispatch();
    const show = props.show ? true : false;

    const [
        {url, port, token},
        setState
    ] = useState(initialState);

    const clearState = () => {
        setState({ ...initialState });
    };

    async function saveConfig() {
        let message = '';
        let failed = false;

        if (!url) {
            message = 'Invalid url';
        }
        else if (port && !isNumber(port)) {
            message = 'Invalid port';
        }

        if (message) {
            dispatch(showSnack({
                severity: 'error',
                message
            }));
            return;
        }

        const connectionParams: KMDConnectionParams = {
            url,
            port,
            token
        }

        try {
            dispatch(showLoader('Connecting to KMD ...'));
            const kmdClient = new KmdClient(connectionParams);
            await kmdClient.getVersions();
            dispatch(hideLoader());
        } catch (e) {
            dispatch(hideLoader());
            failed = true;
            message = 'Invalid KMD configuration.';
        }


        if (failed) {
            if (isBrave()) {
                message += ' If you are using Brave browser, localhost connections are shielded by default. Please turnoff shields and try again. <a href="https://support.brave.com/hc/en-us/articles/360023646212-How-do-I-configure-global-and-site-specific-Shields-settings" target="_blank">Click here</a> to know more.';
            }

            dispatch(showSnack({
                severity: 'error',
                message
            }));

            return;
        }
        dispatch(showLoader('Saving KMD configuration ...'));
        localStorage.setItem('kmdUrl', url);
        localStorage.setItem('kmdPort', port || '');
        localStorage.setItem('kmdToken', token || '');
        dispatch(hideLoader());
        props.onClose();
        window.location.reload();
    }

    function handleClose() {
        props.onClose();
        clearState();
    }

    return (<div>
        {show ? <Dialog
            onClose={handleClose}
            fullWidth={true}
            maxWidth={"xs"}
            open={show}
        >
            <DialogTitle >
                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                    <div>
                        <div style={{fontWeight: "bold", fontSize: 18}}>KMD Configuration</div>
                    </div>
                    <CloseIcon className="modal-close-button" onClick={handleClose}/>
                </div>
            </DialogTitle>
            <DialogContent>
                <div className="kmd-configuration-wrapper">
                    <div className="kmd-configuration-container">
                        <div className="kmd-configuration-header">
                        </div>
                        <div className="kmd-configuration-body">
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                    <FormLabel sx={formLabelStyle}>KMD url</FormLabel>
                                    <ShadedInput
                                        placeholder="http://localhost"
                                        value={url}
                                        onChange={(ev) => {
                                            setState(prevState => ({...prevState, url: ev.target.value}));
                                        }}
                                        fullWidth/>
                                </Grid>
                                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                    <FormLabel sx={formLabelStyle}>KMD port</FormLabel>
                                    <ShadedInput
                                        placeholder="4002"
                                        value={port}
                                        onChange={(ev) => {
                                            setState(prevState => ({...prevState, port: ev.target.value}));
                                        }}
                                        fullWidth/>
                                </Grid>
                                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                    <FormLabel sx={formLabelStyle}>KMD token</FormLabel>
                                    <ShadedInput
                                        multiline={true}
                                        rows={4}
                                        placeholder="aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
                                        value={token}
                                        onChange={(ev) => {
                                            setState(prevState => ({...prevState, token: ev.target.value}));
                                        }}
                                        fullWidth/>
                                </Grid>




                                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                    <div style={{textAlign: "center", marginTop: 10}}>
                                        <Button
                                            variant={"outlined"}
                                            size={"large"}
                                            color={"primary"}
                                            onClick={handleClose}
                                            className="black-button"
                                        >Close</Button>

                                        <Button
                                            variant={"contained"}
                                            size={"large"}
                                            color={"primary"}
                                            style={{marginLeft: '10px'}}
                                            className="black-button"
                                            onClick={() => {
                                                saveConfig();
                                            }}
                                        >Save</Button>
                                    </div>

                                </Grid>
                            </Grid>

                        </div>
                    </div>
                </div>
            </DialogContent>
            <DialogActions>

            </DialogActions>
        </Dialog> : ''}
    </div>);
}

export default KMDConfiguration;
