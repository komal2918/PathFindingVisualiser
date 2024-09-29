function constructGrid(){
    var canvas=document.getElementById('grid');
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    if(canvas.getContext)
    {
        var ctx=canvas.getContext('2d');
        var totalWidth=canvas.width;
        var totalHeight=canvas.height;
        var blockSize=25;
        var blockfillsize=25-2;
        var rows=Math.floor(totalHeight/blockSize)+1;
        var cols=Math.floor(totalWidth/blockSize)+1;

        // Build the grid
        for(var i=0;i<rows;i++)
        {
            ctx.beginPath();
            ctx.strokeStyle= "black";
            ctx.lineWidth=0.3;
            ctx.moveTo(0,i*blockSize);
            ctx.lineTo(totalWidth,i*blockSize);
            ctx.closePath();
            ctx.stroke();
        }
        for(var i=0;i<cols;i++)
        {
            ctx.beginPath();
            ctx.strokeStyle="black";
            ctx.lineWidth= 0.3;
            ctx.moveTo(i*blockSize,0);
            ctx.lineTo(i*blockSize,totalHeight);
            ctx.closePath();
            ctx.stroke();
        }


        // Generating the start and end point
        let start = {
            x: (Math.floor(cols/4)),
            y: (Math.floor(rows/2))
        }

        let end = {
            x: (Math.floor((3*cols)/4)),
            y: (Math.floor(rows/2)),
        }

        ctx.fillStyle = "Green";
        fillRect(start.x, start.y)

        ctx.fillStyle = "#9a27cf"; // Red  
        fillRect(end.x, end.y)

        ctx.fillStyle="Black";



        // Create a 2D Javascript array to represent the grid
        var arrMatrix = new Array(rows);
        for(let i=0;i<arrMatrix.length;i++){
            arrMatrix[i] = new Array(cols);
        }
        
        // Initializing the current Grid
        for(let y=0;y<rows;y++){
           for(let x=0;x<cols;x++){
               if((x === start.x)&&(y === start.y)){
                    arrMatrix[y][x]=2;
               }
               else if((x === end.x)&&(y === end.y)){
                    arrMatrix[y][x]=3;
               }
               else
                    arrMatrix[y][x]=0;
           }
        }



        /* GRID PAINTING */


        var mousePressed = 0;   // 0 => false, 1 => draw walls, 2 => move starting point, 3 => move end point
        let x = 0;
        let y = 0;
        let lastpoint = [-1, -1];    // to prevent grid wall flickering       
        let allowDraw = true;

        // Functions to drag the intial and final position from one position to other 

        // Moves the starting point of search
        function redrawStart(x, y){
            if(arrMatrix[y][x] === 0){
                clearRect(start.x, start.y)
                fillRect(x, y)
                arrMatrix[start.y][start.x] = 0;
                arrMatrix[y][x] = 2;
                start.x = x;
                start.y = y;
            }
        }
        
        // Moves the end point of search
        function redrawEnd(x, y) {
            if(arrMatrix[y][x] === 0){
                clearRect(end.x, end.y)
                fillRect(x, y)
                arrMatrix[end.y][end.x] = 0;
                arrMatrix[y][x] = 3; 
                end.x = x;
                end.y = y;
            }
        }
        
        function onDown(event){
            if (!allowDraw) return;
            let cx=event.offsetX;
            let cy=event.offsetY;
            var Col_num=Math.floor(cx/25);
            var Row_num=Math.floor(cy/25);
            x=Col_num;
            y=Row_num;
            if((x===start.x)&&(y===start.y)){
                mousePressed = 2;
                ctx.fillStyle = "Green";
            }
            else if((x===end.x)&&(y===end.y)){
               mousePressed = 3;
                ctx.fillStyle = "#9a27cf";  // Red
            }
            else{
                mousePressed = 1;
                ctx.fillStyle = "Black";
            }
        }

        function onMove(event) {
            if (!allowDraw) return;
            let cx=event.offsetX;
            let cy=event.offsetY;
            var Col_num=Math.floor(cx/25);
            var Row_num=Math.floor(cy/25);
            x=Col_num;
            y=Row_num;
            if(mousePressed === 1){
                if(!((x === start.x) && (y === start.y)) && !((x === end.x)&&(y === end.y))){
                	if (lastpoint[0] == x && lastpoint[1] == y) return
                    if(arrMatrix[y][x] === 0){
                        fillRect(x, y)
                        arrMatrix[y][x] = 1;
                    }
                    else if(arrMatrix[y][x] === 1){
                        clearRect(x, y)
                        arrMatrix[y][x] = 0;
                    }
                    lastpoint = [x, y]
                }
            }
            else if(mousePressed === 2){
                redrawStart(x, y);
            }
            else if(mousePressed === 3){
                redrawEnd(x, y);
            }
        }

        function onUp(event) {
            mousePressed = 0;
            lastpoint = [-1, -1]
        }


        // Attach event listeners
        canvas.addEventListener('mousedown',onDown);    
        canvas.addEventListener('mousemove',onMove);    
        canvas.addEventListener('mouseup',onUp);



        // Clears walls
        function clearGrid(){
            for(let i=0;i<rows;i++){
                for(let j=0;j<cols;j++){
                    if(arrMatrix[i][j] === 1){
                        arrMatrix[i][j]=0;
                        clearRect(j, i)
                    }
                }
            }
        }

        function preProcess(){
            for(let i=0;i<rows;i++){
                for(let j=0;j<cols;j++){
                    if(arrMatrix[i][j] === 0){
                        clearRect(j, i)
                    }
                    else if(arrMatrix[i][j] === 2){
                        ctx.fillStyle = "Green";
                        ctx.fillRect(j*blockSize+1,i*blockSize+1,blockfillsize,blockSize);
                    }
                    else if(arrMatrix[i][j] === 3){
                        ctx.fillStyle = "#9a27cf";
                        ctx.fillRect(j*blockSize+1,i*blockSize+1,blockfillsize,blockSize);
                    }
                }
            }

            for(var i=0;i<rows;i++)
            {
                ctx.beginPath();
                ctx.strokeStyle= "white";
                ctx.lineWidth=0.3;
                ctx.moveTo(0,i*blockSize);
                ctx.lineTo(totalWidth,i*blockSize);
                ctx.closePath();
                ctx.stroke();
                ctx.beginPath();
                ctx.strokeStyle= "black";
                ctx.lineWidth=0.3;
                ctx.moveTo(0,i*blockSize);
                ctx.lineTo(totalWidth,i*blockSize);
                ctx.closePath();
                ctx.stroke();
            }
            for(var i=0;i<cols;i++)
            {
                ctx.beginPath();
                ctx.strokeStyle="white";
                ctx.lineWidth= 0.3;
                ctx.moveTo(i*blockSize,0);
                ctx.lineTo(i*blockSize,totalHeight);
                ctx.closePath();
                ctx.stroke();
                ctx.beginPath();
                ctx.strokeStyle="black";
                ctx.lineWidth= 0.3;
                ctx.moveTo(i*blockSize,0);
                ctx.lineTo(i*blockSize,totalHeight);
                ctx.closePath();
                ctx.stroke();
            }
        }


        /* STATE AND UTILITIES */

        function clearRect(x, y) {
            ctx.clearRect(x*blockSize+1, y*blockSize+1, blockfillsize, blockfillsize)
        }

        function fillRect(x, y) {
            ctx.fillRect(x*blockSize+1, y*blockSize+1, blockfillsize, blockfillsize)
        }

        function moveTo(x, y) {
            ctx.moveTo(x*blockSize+12, y*blockSize+12)
        }

        function lineTo(x, y) {
            ctx.lineTo(x*blockSize+12, y*blockSize+12)
        }

        // Sleep for ms milliseconds
        function sleep(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }

        // Creating a state variable for information passing
        let state = {
            // Values
            start: start,
            end: end,
            context: ctx,
            matrix: arrMatrix,
            blockSize: blockSize,
            blockfillsize: blockfillsize,
            rows: rows,
            cols: cols,
            heuristic: 'Manhattan',
            diagonal: false,
            algo: 'bfs',

            // Functions
            fillRect: fillRect,
            clearRect: clearRect,
            moveTo: moveTo,
            lineTo: lineTo,
            sleep: sleep
        }




        /* PATHFINDING ALGORITHMS */

        async function runBFS() {
            if (!allowDraw) return;
            preProcess();
            allowDraw = false;
            let dist = await bfs(state, false);
            allowDraw = true;
            return dist;
        }

        async function runBiDirBFS(){
            if (!allowDraw) return;
            preProcess();
            allowDraw = false;
            await bdbfs(state, state.diagonal);   
            allowDraw = true;
        }

        async function runAStar(){
            if (!allowDraw) return;
            preProcess();
            allowDraw = false;
            await aStar(state, state.diagonal);
            allowDraw = true;
        }
        
        async function runBiDirAStar(){
            if (!allowDraw) return;
            preProcess();
            allowDraw = false;
            await bidiraStar(state, state.diagonal);
            allowDraw = true;
        }
        async function runBestFirst(){
            if (!allowDraw) return;
            preProcess();
            allowDraw = false;
            await bestFirstSearch(state, state.diagonal);
            allowDraw = true;
        }

        async function runBiDirBestFirst(){
            if (!allowDraw) return;
            preProcess();
            allowDraw = false;
            await biDirbestFirstSearch(state, state.diagonal);
            allowDraw = true;
        }

        async function runDijkstra(){
            if (!allowDraw) return;
            preProcess();
            allowDraw = false;
            await dijkstra(state, state.diagonal);
            allowDraw = true;
        }

        async function runBiDirDijkstra(){
            if (!allowDraw) return;
            preProcess();
            allowDraw = false;
            await bidirDijkstra(state, state.diagonal);
            allowDraw = true;
        }

        algos = {
            'bfs': bfs,
            'bidirbfs': bdbfs,
            'astar': aStar,
            'biastar': bidiraStar,
            'bestfirst': bestFirstSearch,
            'bibestfirst': biDirbestFirstSearch,
            'dijkstra': dijkstra,
            'bidijkstra': bidirDijkstra
        }


        document.getElementById("clrbtn").addEventListener('click', clearGrid)

        document.getElementById("bfsbtn").addEventListener('click', () => {
            state.algo = 'bfs'
            document.getElementById('algoname').innerHTML = "Algorithm : BFS" 
        });
        document.getElementById("bidirbfsbtn").addEventListener('click', () => {
            state.algo = 'bidirbfs'
            document.getElementById('algoname').innerHTML = "Algorithm : Bi Directional BFS" 
        });
        document.getElementById("astarbtn").addEventListener('click', () => {
            state.algo = 'astar'
            document.getElementById('algoname').innerHTML = "Algorithm : A* Search"
        });
        document.getElementById("bidirastarbtn").addEventListener('click', () => {
            state.algo = 'biastar'
            document.getElementById('algoname').innerHTML = "Algorithm : Bi Directional A* Search"
        });
        document.getElementById("bestfirstsearchbtn").addEventListener('click', () => {
            state.algo = 'bestfirst'
            document.getElementById('algoname').innerHTML = "Algorithm : Best First Search"
        });
        document.getElementById("bidirbestfirstbtn").addEventListener('click', () => {
            state.algo = 'bibestfirst'
            document.getElementById('algoname').innerHTML = "Algorithm : Bi Directional Best First Search"
        });
        document.getElementById("dijkstrabtn").addEventListener('click', () => {
            state.algo = 'dijkstra'
            document.getElementById('algoname').innerHTML = "Algorithm : Dijkstra"
        });
        document.getElementById("bidirdijkstrabtn").addEventListener('click',() => {
            state.algo = 'bidijkstra'
            document.getElementById('algoname').innerHTML = "Algorithm : Bi Directional Dijkstra"
        });


        // Update heuristics
        document.getElementById('man_heu').addEventListener('click', () => {
            state.heuristic = 'Manhattan'
            document.getElementById('heuristicname').innerHTML = "Heuristic : Manhattan"
        })

        document.getElementById('euc_heu').addEventListener('click', () => {
            state.heuristic = 'Euclidean'
            document.getElementById('heuristicname').innerHTML = "Heuristic : Euclidean"
        })

        document.getElementById('oct_heu').addEventListener('click', () => {
            state.heuristic = 'Octile'
            document.getElementById('heuristicname').innerHTML = "Heuristic : Octile"
        })

        document.getElementById('che_heu').addEventListener('click', () => {
            state.heuristic = 'Chebyshev'
            document.getElementById('heuristicname').innerHTML = "Heuristic : Chebyshev"
        })


        // Diagonal movement
        document.getElementById('allow').addEventListener('click', () => {
            state.diagonal = true;
            document.getElementById('diagonalstatus').innerHTML = "Diagonal movement : Allowed"
        })

        document.getElementById('disallow').addEventListener('click', () => {
            state.diagonal = false;
            document.getElementById('diagonalstatus').innerHTML = "Diagonal movement : Disallowed"
        })

        // Start algo
        document.getElementById('start').addEventListener('click', async () => {
            if (!allowDraw) return;
            preProcess();
            allowDraw = false;
            let dis = await algos[state.algo](state, state.diagonal);
            if(dis === -1){
                document.getElementById('stats').innerHTML = "Sorry : Unable to reach the destination";
            }
            else{
                document.getElementById('stats').innerHTML = "Shortest Path Length : " + dis + " units";
            }
            
            allowDraw = true;
            
        })

    }
}
