import React from 'react';

/**
 * A class used to collect user input about stocks and feed collected data to the Stock component
 */

class StockForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = { value: 'AAPL' };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    /**
     * Sends all inputed stock information from the user over to the Stock Component
     */

    sendData = () => {
        this.props.sendStockFormData(this.state.value.toUpperCase());
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

    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <label>
                    Stock Ticker:
                    <input type="text" value={this.state.value} onChange={this.handleChange} />
                </label>
                <input type="submit" value="Submit" />
            </form>
        );
    }
}

export default StockForm;