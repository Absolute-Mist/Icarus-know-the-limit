let trackers = [];

let trackerName = document.getElementById("tracker-name");
let currentValue = document.getElementById("current-value");
let limitValue = document.getElementById("limit-value");
let unit = document.getElementById("unit");

let trackerType = document.getElementById("tracker-type");

let counterFields = document.getElementById("counter-fields");
let timerFields = document.getElementById("timer-fields");

let limitHours = document.getElementById("limit-hours");
let limitMinutes = document.getElementById("limit-minutes");
let limitSeconds = document.getElementById("limit-seconds");

let createButton = document.getElementById("create-tracker");
let trackerList = document.getElementById("tracker-list");


// SWITCH BETWEEN COUNTER AND TIMER

trackerType.addEventListener("change", function() {

    if (trackerType.value === "timer") {

        counterFields.classList.add("hidden");
        timerFields.classList.remove("hidden");

        trackerName.placeholder = "e.g. Screen Time";

    } else {

        counterFields.classList.remove("hidden");
        timerFields.classList.add("hidden");

        trackerName.placeholder = "e.g. Patience Level";
        currentValue.placeholder = "e.g. 5";
        limitValue.placeholder = "e.g. 10";
        unit.placeholder = "e.g. level, pages, dollars";

    }

});


// CALCULATE STATUS

function getStatus(percentage) {

    if (percentage < 80) {

        return "Within limit";

    } else if (percentage < 100) {

        return "Approaching limit";

    } else if (percentage === 100) {

        return "Limit reached";

    } else {

        return "Limit exceeded";

    }

}


// FORMAT TIME

function formatTime(totalSeconds) {

    totalSeconds = Math.floor(totalSeconds);

    let hours =
        Math.floor(totalSeconds / 3600);

    let minutes =
        Math.floor(
            (totalSeconds % 3600) / 60
        );

    let seconds =
        totalSeconds % 60;

    return (
        String(hours).padStart(2, "0") +
        ":" +
        String(minutes).padStart(2, "0") +
        ":" +
        String(seconds).padStart(2, "0")
    );

}


// GET TIMER'S CURRENT TIME

function getTimerCurrent(tracker) {

    if (!tracker.running) {

        return Math.floor(tracker.current);

    }

    let elapsedSinceStart =
        (Date.now() - tracker.startTime) / 1000;

    return Math.floor(
        tracker.current + elapsedSinceStart
    );

}


// GET MESSAGE

function getMessage(tracker) {

    if (tracker.percentage >= 100) {

        return tracker.limitMessage ||
            "You've reached your limit. Time to step away.";

    }

    if (tracker.percentage >= 80) {

        return tracker.warningMessage ||
            "You're approaching your limit. Consider taking a break.";

    }

    return "You're within your limit.";

}


// RENDER TRACKERS

function renderTrackers() {

    trackerList.innerHTML = "";

    trackers.forEach(function(tracker) {

        let current = tracker.current;


        if (tracker.type === "timer") {

            current =
                getTimerCurrent(tracker);

        }


        let percentage =
            (current / tracker.limit) * 100;


        if (percentage < 0) {

            percentage = 0;

        }


        let displayPercentage =
            Math.min(percentage, 100);


        let status =
            getStatus(percentage);


        tracker.percentage =
            percentage;

        tracker.status =
            status;


        let statusClass = "";


        if (percentage >= 100) {

            statusClass =
                "limit-exceeded";

        } else if (percentage >= 80) {

            statusClass =
                "limit-warning";

        }


        let card =
            document.createElement("div");


        card.className =
            `tracker-card ${statusClass}`;


        card.dataset.id =
            tracker.id;


        let displayedCurrent;

        let displayedLimit;


        if (tracker.type === "timer") {

            displayedCurrent =
                formatTime(current);

            displayedLimit =
                formatTime(tracker.limit);

        } else {

            displayedCurrent =
                current;

            displayedLimit =
                tracker.limit;

        }


        card.innerHTML = `

            <div class="tracker-header">

                <div>

                    <h2>
                        ${tracker.name}
                    </h2>


                    <p class="tracker-value">

                        ${displayedCurrent}
                        /
                        ${displayedLimit}

                        ${
                            tracker.type === "counter"
                                ? tracker.unit
                                : ""
                        }

                    </p>

                </div>


                <button
                    class="delete-button"
                    data-id="${tracker.id}"
                >
                    Delete
                </button>

            </div>


            <div class="progress-container">

                <div
                    class="progress-bar"
                    style="width: ${displayPercentage}%"
                ></div>

            </div>


            <div class="tracker-info">

                <span class="tracker-percentage">

                    ${Math.round(percentage)}%

                </span>


                <span class="status">

                    ${status}

                </span>

            </div>


            ${
                percentage >= 100
                    ? `
                        <div class="limit-alert">

                            ${
                                percentage === 100
                                    ? "LIMIT REACHED"
                                    : "LIMIT EXCEEDED"
                            }

                        </div>
                    `
                    : ""
            }


            <p class="tracker-message">

                ${getMessage(tracker)}

            </p>


            ${
                tracker.type === "counter"

                    ? `

                        <div class="tracker-controls">

                            <button
                                class="minus-button"
                                data-id="${tracker.id}"
                            >
                                −
                            </button>


                            <input
                                class="counter-amount"
                                data-id="${tracker.id}"
                                type="number"
                                min="1"
                                value="${tracker.amount || 1}"
                            >


                            <button
                                class="plus-button"
                                data-id="${tracker.id}"
                            >
                                +
                            </button>

                        </div>

                    `

                    : `

                        <div class="tracker-controls">

                            <button
                                class="start-button"
                                data-id="${tracker.id}"
                            >
                                Start
                            </button>


                            <button
                                class="pause-button"
                                data-id="${tracker.id}"
                            >
                                Pause
                            </button>

                        </div>

                    `
            }


            <div class="card-actions">

                <button
                    class="edit-button"
                    data-id="${tracker.id}"
                >
                    Edit Limit
                </button>


                <button
                    class="reset-button"
                    data-id="${tracker.id}"
                >
                    Reset
                </button>

            </div>

        `;


        trackerList.appendChild(card);

    });


    saveTrackers();

    updateDashboard();

}


// SAVE

function saveTrackers() {

    localStorage.setItem(
        "icarusTrackers",
        JSON.stringify(trackers)
    );

}


// LOAD

function loadTrackers() {

    let savedTrackers =
        localStorage.getItem("icarusTrackers");


    if (savedTrackers) {

        trackers =
            JSON.parse(savedTrackers);

    }

}


// DASHBOARD

function updateDashboard() {

    let total =
        trackers.length;


    let approaching =
        trackers.filter(function(tracker) {

            return (
                tracker.percentage >= 80 &&
                tracker.percentage < 100
            );

        }).length;


    let exceeded =
        trackers.filter(function(tracker) {

            return tracker.percentage > 100;

        }).length;


    let dashboard =
        document.getElementById("dashboard");


    if (!dashboard) {

        return;

    }


    dashboard.innerHTML = `

        <div class="stat-box">

            <strong>
                ${total}
            </strong>

            <span>
                Total Trackers
            </span>

        </div>


        <div class="stat-box">

            <strong>
                ${approaching}
            </strong>

            <span>
                Approaching
            </span>

        </div>


        <div class="stat-box">

            <strong>
                ${exceeded}
            </strong>

            <span>
                Exceeded
            </span>

        </div>

    `;

}


// CREATE TRACKER

createButton.addEventListener(
    "click",
    function() {

        let name =
            trackerName.value.trim();


        if (name === "") {

            alert(
                "Please enter a tracker name."
            );

            return;

        }


        // COUNTER

        if (trackerType.value === "counter") {

            let current =
                Number(currentValue.value);


            let limit =
                Number(limitValue.value);


            let trackerUnit =
                unit.value.trim();


            if (trackerUnit === "") {

                alert(
                    "Please enter a unit."
                );

                return;

            }


            if (
                limit <= 0 ||
                isNaN(limit)
            ) {

                alert(
                    "Limit must be greater than 0."
                );

                return;

            }


            if (
                isNaN(current) ||
                current < 0
            ) {

                alert(
                    "Current value must be 0 or greater."
                );

                return;

            }


            let tracker = {

                id: Date.now(),

                name: name,

                type: "counter",

                current: current,

                limit: limit,

                unit: trackerUnit,

                amount: 1,

                percentage:
                    (current / limit) * 100,

                status:
                    getStatus(
                        (current / limit) * 100
                    ),

                warningMessage: "",

                limitMessage: ""

            };


            trackers.push(tracker);

        }


        // TIMER

        else {

            let hours =
                Number(limitHours.value);


            let minutes =
                Number(limitMinutes.value);


            let seconds =
                Number(limitSeconds.value);


            if (
                hours < 0 ||
                minutes < 0 ||
                seconds < 0
            ) {

                alert(
                    "Time values cannot be negative."
                );

                return;

            }


            if (
                minutes >= 60 ||
                seconds >= 60
            ) {

                alert(
                    "Minutes and seconds must be below 60."
                );

                return;

            }


            let totalSeconds =
                hours * 3600 +
                minutes * 60 +
                seconds;


            if (totalSeconds <= 0) {

                alert(
                    "Timer limit must be greater than 0."
                );

                return;

            }


            let tracker = {

                id: Date.now(),

                name: name,

                type: "timer",

                current: 0,

                limit: totalSeconds,

                running: false,

                startTime: null,

                percentage: 0,

                status: "Within limit",

                warningMessage: "",

                limitMessage: ""

            };


            trackers.push(tracker);

        }


        // CLEAR FORM

        trackerName.value = "";

        currentValue.value = "";

        limitValue.value = "";

        unit.value = "";

        limitHours.value = 0;

        limitMinutes.value = 0;

        limitSeconds.value = 0;


        renderTrackers();

    }
);


// BUTTON CONTROLS

trackerList.addEventListener(
    "click",
    function(event) {

        // DO NOTHING WHEN USER CLICKS THE AMOUNT INPUT

        if (
            event.target.classList.contains(
                "counter-amount"
            )
        ) {

            return;

        }


        let id =
            Number(event.target.dataset.id);


        if (!id) {

            return;

        }


        let tracker =
            trackers.find(function(item) {

                return item.id === id;

            });


        if (!tracker) {

            return;

        }


        // COUNTER +

        if (
            event.target.classList.contains(
                "plus-button"
            )
        ) {

            let amountInput =
                document.querySelector(
                    `.counter-amount[data-id="${tracker.id}"]`
                );


            let amount =
                Number(amountInput.value);


            if (
                isNaN(amount) ||
                amount <= 0
            ) {

                alert(
                    "Enter an amount greater than 0."
                );

                return;

            }


            tracker.amount =
                amount;


            tracker.current +=
                amount;

        }


        // COUNTER -

        if (
            event.target.classList.contains(
                "minus-button"
            )
        ) {

            let amountInput =
                document.querySelector(
                    `.counter-amount[data-id="${tracker.id}"]`
                );


            let amount =
                Number(amountInput.value);


            if (
                isNaN(amount) ||
                amount <= 0
            ) {

                alert(
                    "Enter an amount greater than 0."
                );

                return;

            }


            tracker.amount =
                amount;


            tracker.current =
                Math.max(
                    0,
                    tracker.current - amount
                );

        }


        // TIMER START

        if (
            event.target.classList.contains(
                "start-button"
            )
        ) {

            if (!tracker.running) {

                tracker.startTime =
                    Date.now();

                tracker.running = true;

            }

        }


        // TIMER PAUSE

        if (
            event.target.classList.contains(
                "pause-button"
            )
        ) {

            if (tracker.running) {

                tracker.current =
                    getTimerCurrent(tracker);

                tracker.running = false;

                tracker.startTime = null;

            }

        }


        // EDIT LIMIT

        if (
            event.target.classList.contains(
                "edit-button"
            )
        ) {

            if (tracker.type === "counter") {

                let newLimit =
                    Number(
                        prompt(
                            "Enter the new limit:",
                            tracker.limit
                        )
                    );


                if (
                    isNaN(newLimit) ||
                    newLimit <= 0
                ) {

                    alert(
                        "Limit must be greater than 0."
                    );

                    return;

                }


                tracker.limit =
                    newLimit;

            }


            else {

                let currentTimerValue =
                    tracker.running
                        ? getTimerCurrent(tracker)
                        : tracker.current;


                let newMinutes =
                    Number(
                        prompt(
                            "Enter the new timer limit in minutes:",
                            tracker.limit / 60
                        )
                    );


                if (
                    isNaN(newMinutes) ||
                    newMinutes <= 0
                ) {

                    alert(
                        "Limit must be greater than 0."
                    );

                    return;

                }


                tracker.limit =
                    Math.floor(
                        newMinutes * 60
                    );


                if (
                    currentTimerValue >=
                    tracker.limit
                ) {

                    tracker.current =
                        tracker.limit;

                    tracker.running =
                        false;

                    tracker.startTime =
                        null;

                }

            }

        }


        // RESET

        if (
            event.target.classList.contains(
                "reset-button"
            )
        ) {

            tracker.current = 0;


            if (tracker.type === "timer") {

                tracker.running = false;

                tracker.startTime = null;

            }

        }


        // DELETE

        if (
            event.target.classList.contains(
                "delete-button"
            )
        ) {

            trackers =
                trackers.filter(function(item) {

                    return item.id !== id;

                });

        }


        renderTrackers();

    }
);


// UPDATE RUNNING TIMERS

setInterval(
    function() {

        let shouldRender =
            false;


        trackers.forEach(function(tracker) {

            if (
                tracker.type !== "timer" ||
                !tracker.running
            ) {

                return;

            }


            let current =
                getTimerCurrent(tracker);


            // STOP TIMER AT LIMIT

            if (current >= tracker.limit) {

                tracker.current =
                    tracker.limit;

                tracker.running =
                    false;

                tracker.startTime =
                    null;

                current =
                    tracker.limit;

                shouldRender = true;

            }


            let percentage =
                (current / tracker.limit) * 100;


            let card =
                document.querySelector(
                    `.tracker-card[data-id="${tracker.id}"]`
                );


            if (!card) {

                return;

            }


            let valueElement =
                card.querySelector(
                    ".tracker-value"
                );


            let percentageElement =
                card.querySelector(
                    ".tracker-percentage"
                );


            let statusElement =
                card.querySelector(
                    ".status"
                );


            let progressBar =
                card.querySelector(
                    ".progress-bar"
                );


            if (valueElement) {

                valueElement.textContent =
                    `${formatTime(current)} / ${formatTime(tracker.limit)}`;

            }


            if (percentageElement) {

                percentageElement.textContent =
                    `${Math.round(percentage)}%`;

            }


            let status =
                getStatus(percentage);


            if (statusElement) {

                statusElement.textContent =
                    status;

            }


            if (progressBar) {

                progressBar.style.width =
                    `${Math.min(percentage, 100)}%`;

            }


            tracker.percentage =
                percentage;

            tracker.status =
                status;

        });


        updateDashboard();


        if (shouldRender) {

            renderTrackers();

        }

    },
    1000
);


// START

loadTrackers();

renderTrackers();