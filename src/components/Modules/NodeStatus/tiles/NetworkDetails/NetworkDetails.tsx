import './NetworkDetails.scss';
import React from "react";
import {Card, CardActions, CardContent, Link} from "@mui/material";
import LoadingTile from "../../../../Common/LoadingTile/LoadingTile";
import {CoreNode} from "../../../../../packages/core-sdk/classes/core/CoreNode";
import {useSelector} from "react-redux";
import {RootState} from "../../../../../redux/store";
import LinkToAccount from "../../../Explorer/Common/Links/LinkToAccount";
import WifiIcon from '@mui/icons-material/Wifi';
import dappflow from "../../../../../utils/dappflow";


function NetworkDetails(): JSX.Element {

    const node = useSelector((state: RootState) => state.node);
    const {status, versionsCheck, genesis, loading, health} = node;

    const coreNodeInstance = new CoreNode(status, versionsCheck, genesis, health);

    return (<div className={"network-details-wrapper"}>
        <div className={"network-details-container"}>

            <React.Fragment>
                <Card variant="outlined" className="tile">
                    <CardContent>
                        <div className="tile-header">
                            <div className="tile-title">
                                <WifiIcon color={"primary"}></WifiIcon>Network details
                            </div>
                        </div>

                        <div className="tile-body">
                            {loading ? <div>
                                <LoadingTile count={3}></LoadingTile>
                            </div> : <div>

                                <div className="tile-details">
                                    <div className="tile-detail">
                                        <div className="key">Genesis id</div>
                                        <div className="value">{coreNodeInstance.getGenesisId()}</div>
                                    </div>
                                    <div className="tile-detail">
                                        <div className="key">Genesis hash</div>
                                        <div className="value">{coreNodeInstance.getGenesisHash()}</div>
                                    </div>
                                    <div className="tile-detail">
                                        <div className="key">Fee sink address</div>
                                        <div className="value">
                                            <LinkToAccount address={coreNodeInstance.getFeeSinkAddress()} strip={30}></LinkToAccount>
                                        </div>
                                    </div>
                                    <div className="tile-detail">
                                        <div className="key">Rewards pool address</div>
                                        <div className="value">
                                            <LinkToAccount address={coreNodeInstance.getRewardsPoolAddress()} strip={30}></LinkToAccount>
                                        </div>
                                    </div>
                                    <div className="tile-detail">
                                        <div className="key">Faucet</div>
                                        <div className="value">
                                            <Link href="/dispenser">Open faucet page</Link>
                                        </div>
                                    </div>
                                    <div className="tile-detail">
                                        <div className="key">Build version</div>
                                        <div className="value">
                                            <div className="value">{coreNodeInstance.getBuildVersion()}</div>
                                        </div>
                                    </div>
                                    <div className="tile-detail">
                                        <div className="key">Algod url</div>
                                        <div className="value">
                                            <div className="value">{dappflow.network.getAlgodUrl()}</div>
                                        </div>
                                    </div>
                                    <div className="tile-detail">
                                        <div className="key">Indexer url</div>
                                        <div className="value">
                                            <div className="value">{dappflow.network.getIndexerUrl()}</div>
                                        </div>
                                    </div>
                                </div>




                            </div>}
                        </div>


                    </CardContent>
                    <CardActions sx={{textAlign: 'right'}}>

                    </CardActions>
                </Card>

            </React.Fragment>
        </div>
    </div>);
}

export default NetworkDetails;
