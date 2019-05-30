import { Component, Input, OnChanges, ViewChild } from '@angular/core';
import { Chart } from 'chart.js';
import { AirStation } from '../airStation.model';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements OnChanges {

  myChart: Chart;
  myPieChart: Chart;
  @Input() chartData;
  @Input() closestAirStation;
  @ViewChild('myChart') private chartRef;

  private good = 0;
  private bad = 0;
  private takietam = 0;

  constructor() { }

  ngOnChanges() {
    if (this.chartData) { this.createChart(); }
  }

  createChart() {
    const ctx = document.getElementById('myChart');
    const pctx = document.getElementById('myPieChart');

    const data = [];
    const labels = [];
    const backgroundColor = [];

    this.chartData.forEach((station: AirStation) => {
      data.push(station.pm10);
      backgroundColor.push(this.checkColor(station.pm10));
      labels.push('');
    });

    this.myChart = new Chart(ctx, {
      type: 'bar',
      data: {
        datasets: [{
          data,
          backgroundColor,
        }],
        labels
      },
      options: {
        legend: {
          display: false
        }
      }
    });

    this.myPieChart = new Chart(pctx, {
      type: 'doughnut',
      data: {
        datasets: [{
          data: [this.good, this.bad, this.takietam],
          backgroundColor: ['green', 'red', 'orange'],
        }],
        labels: ['W normie', 'Złe', 'Stan alarmowy']
      },
      options: {
        legend: {
          display: false
        },
        tooltips: {
          displayColors: false
        }
      }
    });
  }

  checkColor(pm10: number) {
    if (pm10 < 50) {
      this.good++;
      return 'green';
    } else if (pm10 < 200) {
      this.takietam++;
      return 'orange';
    } else {
      this.bad++;
      return 'red';
    }
  }

}
