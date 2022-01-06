import React from 'react';

/**
 * A class used to collect user input about stocks and feed collected data to the Stock component
 */

class StockForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: 'AAPL',
            graphMode: 'daily',
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleDailyClick = this.handleDailyClick.bind(this);
        this.handleIntradayClick = this.handleIntradayClick.bind(this);
    }

    /**
     * Sends all inputed stock information from the user over to the Stock Component
     */

    sendData = () => {
        this.props.sendStockFormData(this.state.value.toUpperCase(), this.state.graphMode);
    }

    handleChange(event) {
        this.setState({ value: event.target.value });
    }

    /**
    * Upon form submission, calls the function to send collected data to Stock component
    */

    handleSubmit(event) {
        event.preventDefault();
        this.sendData();
    }

    /**
     * Sets the displayed graph to the mode clicked by the user
     */

    handleIntradayClick() {
        this.setState({
            graphMode: "intraday"
        }, () => {
            this.updateScreen();
        })
    }

    handleDailyClick() {
        this.setState({
            graphMode: "daily"
        }, () => {
            this.updateScreen();
        })
    }

    updateScreen() {
        this.render();
        this.sendData();
    }

    render() {
        return (
            <>
                <button className='intraday_button' onClick={this.handleIntradayClick}>
                    Intraday
                </button>

                <button className='daily_button' onClick={this.handleDailyClick}>
                    Daily
                </button>

                <form onSubmit={this.handleSubmit}>
                    <label>
                        Stock Ticker:
                        <input type="text" value={this.state.value} onChange={this.handleChange} />
                    </label>
                    <input type="submit" value="Submit" />
                </form>
            </>
        );
    }
}

export default StockForm;