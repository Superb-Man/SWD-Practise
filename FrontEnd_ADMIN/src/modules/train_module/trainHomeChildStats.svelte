<script>
	import { slide } from 'svelte/transition';
	import { Chart ,registerables} from 'chart.js';
	Chart.register(...registerables);
    import { onMount } from "svelte"
    // library that creates chart objects in page
    import {getRoutes, getScheduleByUID} from '../../api/trainAdmin/trainGet'
    import {getSeatInfoBySchedule} from '../../api/trainAdmin/trainPost'


    // let train = []

    // const url = new URL(window.location.href)

    // const pathsegments = url.hash.split('/').filter(Boolean)

    // console.log(pathsegments)

    let train = window.sessionStorage.getItem("selected")

    let scheds = [] , ticketData = [[]] ;

    //export let option = "route"

    function getFirstDate(route) {
        if (route.length > 0 && route[0].date) {
            return new Date(route[0].date);
        }
        return null;
    }

    //get routes of a train
    //getSEatInfo By schedule
    // function fade(
    //     node: Element,
    //     { delay, duration, easing }?: FadeParams | undefined
    // ): TransitionConfig;

    /**
     * task 1 - get the last 10 schedules of the specific train and
     * task-2 - get the details of coach wise 
    */
    async function todo() {
        const schedResponse = await getScheduleByUID(train) ;
        if(!schedResponse.ok){
            console.log("error") ;
            return ;
        }
        if(schedResponse.status != 200){
            console.log("no routes found") ;
            return ;
        }
        let data = await schedResponse.json() ;
        //data is an array
        console.log(data.length) ;
        data.sort((a, b) => {
            let firstDateA = getFirstDate(a.routes);
            let firstDateB = getFirstDate(b.routes);
            if (firstDateA && firstDateB) {
                return firstDateA - firstDateB;
            }
            return 0 ;
        }) ;
        scheds = data.slice(0, 10) ;

        //now get the TICKETINFO
        for(let i = 0 ; i < scheds.length ; i++){
            let data = {
            schedule_id : scheds[i].schedule_id,
            train_uid : train
            }
            const response = await getSeatInfoBySchedule(data) ;
            if(!response.ok){
                console.log("error") ;
                return ;
            }
            if(response.status != 200){
                console.log("no ticket found") ;
                return ;
            }
            ticketData.push(await response.json()) ;
        }
        console.log(ticketData) ;
    }
    // init chart
    onMount(async () => {
      
                //at first get the schdules of the train
      await todo()

      let dates = scheds.map(f=>f.routes[0].date) ;
      console.log(dates) ;
      let config = {
        type: 'bar',
        data: {
          labels: dates ,
          datasets: [
            {
              label: new Date().getFullYear(),
              backgroundColor: "#ed64a6",
              borderColor: "#ed64a6",
              data: [30, 78, 56, 34, 100, 45, 13],
              fill: false,
              barThickness: 8
            },
            {
              label: new Date().getFullYear() - 1,
              fill: false,
              backgroundColor: "#4c51bf",
              borderColor: "#4c51bf",
              data: [27, 68, 86, 74, 10, 4, 87],
              barThickness: 8
            }
          ]
        },
        options: {
          maintainAspectRatio: false,
          responsive: true,
          title: {
            display: false,
            text: "Orders Chart",
          },
          tooltips: {
            mode: "index",
            intersect: false,
          },
          hover: {
            mode: "nearest",
            intersect: true,
          },
          legend: {
            labels: {
              fontColor: "rgba(0,0,0,.4)",
            },
            align: "end",
            position: "bottom",
          },
          scales: {
            xAxes: [
              {
                display: false,
                scaleLabel: {
                  display: true,
                  labelString: "Month",
                },
                gridLines: {
                  borderDash: [2],
                  borderDashOffset: [2],
                  color: "rgba(33, 37, 41, 0.3)",
                  zeroLineColor: "rgba(33, 37, 41, 0.3)",
                  zeroLineBorderDash: [2],
                  zeroLineBorderDashOffset: [2],
                },
              },
            ],
            yAxes: [
              {
                display: true,
                scaleLabel: {
                  display: false,
                  labelString: "Value",
                },
                gridLines: {
                  borderDash: [2],
                  drawBorder: false,
                  borderDashOffset: [2],
                  color: "rgba(33, 37, 41, 0.2)",
                  zeroLineColor: "rgba(33, 37, 41, 0.15)",
                  zeroLineBorderDash: [2],
                  zeroLineBorderDashOffset: [2],
                },
              },
            ],
          },
        },
      };
    let ctx = document.getElementById("bar-chart").getContext("2d");
    window.myBar = new Chart(ctx, config);
    // await todo()
});
  </script>
  
  <div class="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded">
    <div class="rounded-t mb-0 px-4 py-3 bg-transparent">
      <div class="flex flex-wrap items-center">
        <div class="relative w-full max-w-full flex-grow flex-1">
          <h6 class="uppercase text-blueGray-400 mb-1 text-xs font-semibold">
            Performance
          </h6>
          <h2 class="text-blueGray-700 text-xl font-semibold">
            Total orders
          </h2>
        </div>
      </div>
    </div>
    <div class="p-4 flex-auto">
      <div class="relative h-350-px">
        <canvas id="bar-chart"></canvas>
      </div>
    </div>
  </div>