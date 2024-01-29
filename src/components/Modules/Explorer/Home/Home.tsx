import './Home.scss';
import React from "react";
import Search from '../Search/Search';
import {Grid} from "@mui/material";
import LiveBlocks from "../LiveBlocks/LiveBlocks";
import LiveTransactions from "../LiveTransactions/LiveTransactions";

function Home(): JSX.Element {
    return (<div className={"home-wrapper"}>
        <div className={"home-container"}>
            <div className="home-body">
                <div className="tag-line">
                    Quantinium Blockchain Explorer
                </div>
                <div className="search-section">
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                            <Search></Search>
                        </Grid>
                    </Grid>
                </div>
                <div className="live-section">
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                            <LiveBlocks></LiveBlocks>
                        </Grid>
                        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                            <LiveTransactions></LiveTransactions>
                        </Grid>
                    </Grid>
                </div>
            </div>
        </div>
    </div>);
}

export default Home;
