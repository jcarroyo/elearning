//http://usejsdoc.org/tags-param.html
//https://dzone.com/articles/introduction-jsdoc
function QueueTasks(configure){
    var interval = configure.interval || 5000,
        tasks = [],
        processing = false;

    /**
     * @param {function} task - task must be a function that returns a promise
     */
    this.push = function(task){
        tasks.push(task);
        awake();
    }

    function awake(){
        if(!processing) {
            setTimeout(processQueue, interval);
        }
    }

    function processQueue(){
        if(!processing){
            processing = true;
            var currentSize = tasks.length;
            if(currentSize){
                for(var i = 0; i < currentSize; i++){
                    var task = tasks.shift();
                    processTask(task);
                }
            }else{
                console.log("Nothing to process now");
            }
            processing = false;
            if(tasks.length){
                awake();
            }
        }
    }

    function processTask(task){
        console.log("starting to process task");
        task().then(
            function(result){
                console.log(result);
                console.log("task has been finished");
            },
            function(error){
                console.log(error);
                console.log("error processing task");
            }
        );
    }

    //setInterval(processQueue, interval);
}

var queueTasks = new QueueTasks({
    interval: 5000
});

module.exports = queueTasks;