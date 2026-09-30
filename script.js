// ==========================================
// Dijkstra's Single Source Shortest Path
// Greedy Method
// ==========================================


// Graph represented using an adjacency list

const graph = {

    A: {
        B: 4,
        C: 2
    },

    B: {
        A: 4,
        C: 1,
        D: 5
    },

    C: {
        A: 2,
        B: 1,
        D: 8,
        E: 10
    },

    D: {
        B: 5,
        C: 8,
        E: 2,
        F: 6
    },

    E: {
        C: 10,
        D: 2,
        F: 3
    },

    F: {
        D: 6,
        E: 3
    }
};


const vertices = Object.keys(graph);

let distance = {};
let previous = {};
let visited = {};

let running = false;


// ==========================================
// Utility Functions
// ==========================================

function sleep(milliseconds) {

    return new Promise(resolve => {
        setTimeout(resolve, milliseconds);
    });
}


// ==========================================
// Initialize Dijkstra
// ==========================================

function initialize(source) {

    distance = {};
    previous = {};
    visited = {};

    vertices.forEach(vertex => {

        distance[vertex] = Infinity;

        previous[vertex] = null;

        visited[vertex] = false;

    });

    distance[source] = 0;
}


// ==========================================
// Find the unvisited vertex
// having minimum distance
// ==========================================

function getMinimumVertex() {

    let minimumDistance = Infinity;

    let minimumVertex = null;


    vertices.forEach(vertex => {

        if (
            !visited[vertex] &&
            distance[vertex] < minimumDistance
        ) {

            minimumDistance = distance[vertex];

            minimumVertex = vertex;
        }

    });


    return minimumVertex;
}


// ==========================================
// Update distances displayed on graph
// ==========================================

function updateDistances() {

    vertices.forEach(vertex => {

        const element =
            document.getElementById(
                "distance" + vertex
            );


        if (distance[vertex] === Infinity) {

            element.textContent = "∞";

        } else {

            element.textContent =
                distance[vertex];

        }

    });
}


// ==========================================
// Change node colors
// ==========================================

function updateNodeColors(source, current) {

    vertices.forEach(vertex => {

        const node =
            document.querySelector(
                "#node" + vertex + " .node"
            );


        node.classList.remove(
            "source",
            "current",
            "visited"
        );


        if (vertex === source) {

            node.classList.add("source");

        }


        if (visited[vertex]) {

            node.classList.add("visited");

        }


        if (vertex === current) {

            node.classList.remove("visited");

            node.classList.add("current");

        }

    });
}


// ==========================================
// Highlight graph edge
// ==========================================

function highlightEdge(from, to) {

    const edge1 =
        document.getElementById(from + to);

    const edge2 =
        document.getElementById(to + from);


    const edge = edge1 || edge2;


    if (edge) {

        edge.classList.add("active");


        setTimeout(() => {

            edge.classList.remove("active");

        }, 800);

    }
}


// ==========================================
// Get shortest path
// ==========================================

function getPath(vertex) {

    const path = [];

    let current = vertex;


    while (current !== null) {

        path.unshift(current);

        current = previous[current];

    }


    return path.join(" → ");
}


// ==========================================
// Display final results
// ==========================================

function showResults(source) {

    const resultCards =
        document.getElementById("resultCards");


    resultCards.innerHTML = "";


    vertices.forEach(vertex => {

        const card =
            document.createElement("div");


        card.className = "card";


        let finalDistance;

        let finalPath;


        if (distance[vertex] === Infinity) {

            finalDistance = "∞";

            finalPath = "No path";

        } else {

            finalDistance = distance[vertex];

            finalPath = getPath(vertex);

        }


        card.innerHTML = `

            <div class="vertex">
                ${vertex}
                ${vertex === source ? " ⭐" : ""}
            </div>

            <div class="distance-value">
                ${finalDistance}
            </div>

            <div class="path">
                ${finalPath}
            </div>

        `;


        resultCards.appendChild(card);

    });

}


// ==========================================
// Main Dijkstra Algorithm
// ==========================================

async function dijkstra(source) {

    initialize(source);

    updateDistances();


    for (;;) {

        // Greedy selection

        const current =
            getMinimumVertex();


        if (current === null) {

            break;

        }


        updateNodeColors(
            source,
            current
        );


        document.getElementById("status")
            .textContent =
            `🔎 Selected ${current} with minimum distance ${distance[current]}`;


        await sleep(900);


        // Mark current vertex visited

        visited[current] = true;


        // Relax neighboring vertices

        for (const neighbor in graph[current]) {

            if (visited[neighbor]) {

                continue;

            }


            const weight =
                graph[current][neighbor];


            const newDistance =
                distance[current] + weight;


            document.getElementById("status")
                .textContent =
                `⚡ Checking ${current} → ${neighbor}: ${distance[current]} + ${weight} = ${newDistance}`;


            await sleep(500);


            // Relaxation

            if (
                newDistance <
                distance[neighbor]
            ) {

                distance[neighbor] =
                    newDistance;


                previous[neighbor] =
                    current;


                highlightEdge(
                    current,
                    neighbor
                );


                updateDistances();


                await sleep(400);

            }

        }


        updateNodeColors(
            source,
            null
        );


        await sleep(300);

    }


    updateNodeColors(
        source,
        null
    );


    showResults(source);


    document.getElementById("status")
        .textContent =
        "✅ Dijkstra completed successfully!";


    running = false;

}


// ==========================================
// Start Button
// ==========================================

document
    .getElementById("startBtn")
    .addEventListener("click", async () => {

        if (running) {

            return;

        }


        running = true;


        const source =
            document.getElementById("source").value;


        resetVisuals();


        document.getElementById("status")
            .textContent =
            `🚀 Starting Dijkstra from ${source}...`;


        await sleep(500);


        await dijkstra(source);

    });


// ==========================================
// Reset Button
// ==========================================

document
    .getElementById("resetBtn")
    .addEventListener("click", () => {

        if (running) {

            return;

        }


        resetVisuals();

    });


// ==========================================
// Reset Everything
// ==========================================

function resetVisuals() {

    vertices.forEach(vertex => {

        const node =
            document.querySelector(
                "#node" + vertex + " .node"
            );


        node.classList.remove(
            "source",
            "current",
            "visited"
        );


        document.getElementById(
            "distance" + vertex
        ).textContent = "∞";

    });


    document
        .querySelectorAll(".edge")
        .forEach(edge => {

            edge.classList.remove("active");

        });


    document.getElementById("resultCards")
        .innerHTML = `

        <div class="waiting">
            Run the algorithm to see results.
        </div>

    `;


    document.getElementById("status")
        .textContent =
        'Select a source and click "Run Dijkstra".';

}
