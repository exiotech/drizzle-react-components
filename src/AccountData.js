import { drizzleConnect } from "drizzle-react";
import React, { Component } from "react";
import PropTypes from "prop-types";

class AccountData extends Component {
  constructor(props) {
    super(props);

    this.precisionRound = this.precisionRound.bind(this);
  }

  precisionRound(number, precision) {
    var factor = Math.pow(10, precision);
    return Math.round(number * factor) / factor;
  }

  render() {
    // No accounts found.
    if (Object.keys(this.props.accounts).length === 0) {
      return <span>Initializing...</span>;
    }

    // Get account address and balance.
    const address = this.props.accounts[this.props.accountIndex];
    var balance = this.props.accountBalances[address];

    // Convert to given units.
    if (this.props.units && typeof balance !== "undefined") {
      balance = this.context.drizzle.web3.utils.fromWei(
        balance,
        this.props.units,
      );
    }

    // Adjust to given precision.
    if (this.props.precision) {
      balance = this.precisionRound(balance, this.props.precision);
    }

    return { balance };
  }
}

AccountData.contextTypes = {
  drizzle: PropTypes.object,
};

AccountData.propTypes = {
  accounts: PropTypes.arrayOf(PropTypes.string),
  accountBalances: PropTypes.arrayOf(PropTypes.string),
  accountIndex: PropTypes.number.isRequired,
  units: PropTypes.string,
  precision: PropTypes.number,
};

/*
 * Export connected component.
 */

const mapStateToProps = state => {
  return {
    accounts: state.accounts,
    accountBalances: state.accountBalances,
  };
};

export default drizzleConnect(AccountData, mapStateToProps);
