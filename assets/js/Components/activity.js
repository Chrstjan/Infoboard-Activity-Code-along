import { myFetchData } from "../Utils/apiUtils.js";

export const activitiesPlan = async () => {
    const config = await myFetchData('../../../config.json')

    const endpoint = "https://iws.itcn.dk/techcollege/schedules?departmentcode=smed"; //Change the endpoint variable to the desired endpoint
    let { value: events_data } = await myFetchData(endpoint);

    const endpoint_friendly = "https://api.mediehuset.net/infoboard/subjects"
    const { result: friendly_data } = await myFetchData(endpoint_friendly);

    events_data = events_data.filter(elm => config.array_valid_educations.includes(elm.Education))

    // console.log(events_data);

    events_data.map(event => {
        event.Time = new Date(event.StartDate).toLocaleTimeString('en-GB', {
            hour: '2-digit',
            minute: '2-digit'
        })

        friendly_data.map(word => {
            if(word.name.toUpperCase() === event.Education.toUpperCase()) {
                event.Education = word.friendly_name
            }

            if(word.name.toUpperCase() === event.Subject.toUpperCase()) {
                event.Subject = word.friendly_name
            }
            // console.log(event);
        })

        event.Stamp = new Date(event.StartDate).getTime();
    })


    events_data.sort((a,b) => {
        if (a.StartDate === b.StartDate) {
            return a.Education < b.Education ? -1 : 1
        }
        else {
            return a.StartDate < b.StartDate ? -1 : 1
        }
    })

    // if (config.max_num_activities) {
    //     events_data = events_data.slice(0, config.max_num_activities);
    // }

    let curday_events = [];
    let nextday_events = [];
    const curday = new Date()
    const curday_stamp = curday.getTime();
    const nextday_stamp = curday.setHours(0,0,0,0) + 86400000; // + 86400000;

    curday_events.push(...events_data.filter(elm => (elm.Stamp + 360000) >= curday_stamp && (elm.Stamp < nextday_stamp)));
    nextday_events.push(...events_data.filter(elm => (elm.Stamp) >= nextday_stamp));


    if (nextday_events.length) {
        console.log(nextday_events[0].StartDate);
        const nextday_date = new Date(nextday_events[0].StartDate);
        curday_events.push({ Day: nextday_date })
        curday_events.push(...nextday_events)
    }
    
    console.log(curday_events);

    let acc_html = `
        <table>
            <tr>
                <th>KL</th>
                <th>Uddannelse</th>
                <th>Hold</th>
                <th>Fag</th>
                <th>Lokale</th>
            </tr>`;

            curday_events.map(event => {
            console.log(event);
            acc_html += event.Day ?  `
                <tr>
                    <td colspan="5">${event.Day}</td>
                </tr>`
            : `
            <tr>
               <td>${event.Time}</td>
               <td>${event.Education}</td>
               <td>${event.Team}</td>
               <td>${event.Subject}</td>
               <td>${event.Room}</td>
            </tr>
            `
        })

        acc_html += `</table>`;
        const container = document.getElementById("activity");
        container.innerHTML = acc_html;

    console.log(events_data);

};