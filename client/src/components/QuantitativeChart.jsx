import React, {
  Component
} from 'react';

// Echarts
import ReactEcharts from 'echarts-for-react/lib/core';
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/bar';
import 'echarts/lib/chart/pie';
import Switch from '@material-ui/core/Switch';


class QuantitativeChart extends Component {
  constructor(props) {
    super(props);

    this.state = {
      quantitativeData: {},
      checkedA: true,
    };

    this.getBarOption = this.getBarOption.bind(this);
    this.getAxis = this.getAxis.bind(this);
  }

  handleChange = name => event => {
    this.setState({ [name]: event.target.checked });
  };

  getAxis() {
    const possibleAnswers = this.props.quantitativeData.possible_answers;
    const responses = this.props.quantitativeData.responses;
    let countAnswers = {};

    possibleAnswers.forEach((answer) => {
      countAnswers[answer] = 0;
    });

    responses.forEach((response) => {
      countAnswers[response.answer]++;
    });

    const x = [];
    const y = [];

    Object.keys(countAnswers).forEach((key) => {
      x.push(key);
      y.push(countAnswers[key]);
    });

    return {
      x,
      y
    };
  }

  getBarOption() {
    const axis = this.getAxis();
    const option = {
      xAxis: {
        type: 'category',
        data: axis.x,
      },
      yAxis: {
        type: 'value',
      },
      series: [{
        data: axis.y,
        type: 'bar',
      }, ],
    };

    return option;
  }

  getPieOption() {
    const possibleAnswers = this.props.quantitativeData.possible_answers;
    const responses = this.props.quantitativeData.responses;
    const {
      x,
      y
    } = this.getAxis();

    const values = [];
    x.forEach((name, i) => {
      values.push({
        value: y[i],
        name: x[i],
      });
    });

    return {
      tooltip: {
        trigger: 'item',
        formatter: "{a} <br/>{b}: {c} ({d}%)"
      },
      legend: {
        orient: 'vertical',
        x: 'left',
        data: x,
      },
      series: [{
        name: 'Results',
        type: 'pie',
        radius: ['50%', '70%'],
        avoidLabelOverlap: false,
        label: {
          normal: {
            show: false,
            position: 'center'
          },
          emphasis: {
            show: true,
            textStyle: {
              fontSize: '30',
              fontWeight: 'bold'
            }
          }
        },
        labelLine: {
          normal: {
            show: false
          }
        },
        data: values
      }]
    };
  }

  render() {
    const chartOptions = this.state.checkedA ? this.getPieOption() : this.getBarOption();
    return (
      <React.Fragment>
        <ReactEcharts
          echarts={echarts}
          option={chartOptions}
          notMerge={true}
          lazyUpdate={true}
          theme={'light'}
          onChartReady={this.onChartReadyCallback}
        />
        <Switch
          defaultChecked
          value="checkedF"
          color="default"
          onChange={this.handleChange('checkedA')}
          value="checkedB"
          color="primary"
        />
      </React.Fragment>
    );
  }
}

export default QuantitativeChart;
