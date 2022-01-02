import React from 'react';

/**
 * A class used to collect user input about stocks and feed collected data to the Stock component
 */

class StockForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: 'AAPL',
            isToggleOn: false,
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }

    /**
     * Sends all inputed stock information from the user over to the Stock Component
     */

    sendData = () => {
        this.props.sendStockFormData(this.state.value.toUpperCase(), this.state.isToggleOn);
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

    handleClick() {
        this.setState({
            isToggleOn: !this.state.isToggleOn
        }, () => {
            this.render();
            this.sendData();
        })
    }

    render() {
        return (
            <>
                <button onClick={this.handleClick}>
                    {this.state.isToggleOn ? 'Intraday: ON' : 'Intraday: OFF'}
                </button>

                <button onClick={this.handleClick}>
                    {this.state.isToggleOn ? 'Daily: OFF' : 'Daily: ON'}
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