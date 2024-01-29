import './Transactions.scss';
import React, {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../../../redux/store";
import {loadTransactions} from "../../../../../redux/explorer/actions/transactions";
import TransactionsList from "../TransactionsList/TransactionsList";


function Transactions(): JSX.Element {
    const dispatch = useDispatch();
    const transactions = useSelector((state: RootState) => state.transactions);
    const {list} = transactions;


    useEffect(() => {
        dispatch(loadTransactions());
    }, [dispatch]);

    function reachedLastPage() {
        dispatch(loadTransactions());
    }

    return (<div className={"transactions-wrapper"}>
        <div className={"transactions-container"}>
            <div className="transactions-body">
                <TransactionsList transactions={list} loading={transactions.loading} reachedLastPage={reachedLastPage}></TransactionsList>
            </div>
        </div>
    </div>);
}

export default Transactions;
